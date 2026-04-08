import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/api/axios';
import Button from '@/components/common/Button';
import CafeImageList from '@/components/cafe/CafeImageList';
import ImageModal from '@/components/cafe/ImageModal';
import CafeReviewChart from '@/components/cafe/CafeReviewChart';

type CafeDetail = {
  id: number;
  name: string;
  address: string;
  placeId?: string;
  contact?: string;
  imageName?: string;
  score: {
    reviewCount: number;
    toiletScoreAvg: number;
    outletScoreAvg: number;
    seatScoreAvg: number;
    wifiScoreAvg: number;
    noiseScoreAvg: number;
  };
  isWished?: boolean;
};

function CafeInfoPage() {
  const { cafeId } = useParams<{ cafeId: string }>();
  const navigate = useNavigate();

  const [cafe, setCafe] = useState<CafeDetail | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isWished, setIsWished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!cafeId) return;

    api.get(`/api/cafes/${cafeId}`)
      .then(res => {
        setCafe(res.data);
        setIsWished(res.data.isWished ?? false);
      })
      .catch(() => {
        alert('카페 정보를 불러올 수 없습니다.');
        navigate(-1);
      });
  }, [cafeId, navigate]);

  const handleWishToggle = async () => {
    if (!cafeId) return;

    setIsLoading(true);
    const prev = isWished;
    setIsWished(!prev);

    try {
      const res = await api.post(
        `/api/cafes/${cafeId}/wish`,
        {},
        { withCredentials: true }
      );
      setIsWished(res.data);
    } catch (err: any) {
      setIsWished(prev);

      if (err.response?.status === 401) {
        alert('로그인이 필요한 서비스입니다.');
        navigate('/loginpage');
      } else {
        alert('찜 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!cafe) {
    return <div className="p-10 text-center">로딩 중…</div>;
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white border p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center text-brown-4">
          {cafe.name}
        </h1>


          <a
            href={`https://place.map.kakao.com/${cafe.placeId}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-800 text-lg text-center font-medium"
          >
            {cafe.name} 알아보기
          </a>

        <p className="text-center text-neutral-600">{cafe.address}</p>

        {/* ✅ 육각형 그래프 */}
        <div className="border p-4">
          {!cafe.score || cafe.score.reviewCount === 0 ? (
            <div className="text-center text-sm text-gray-400 py-6">
              아직 등록된 리뷰가 없습니다.
            </div>
          ) : (
            <CafeReviewChart scores={cafe.score} />
          )}
        </div>

        <div className="break-keep text-center text-neutral-600 leading-relaxed text-xs mb-2">
          실제 리뷰를 바탕으로 카페의 분위기와 작업 환경을 분석한 리포트입니다. <br />
          이용자 경험을 데이터로 정리해 더 정확한 카페 선택을 돕습니다.
        </div>

        <CafeImageList onImageClick={setSelectedImage} />

        <Button
          className="mt-3 bg-[#8B4513] text-white"
          onClick={handleWishToggle}
          disabled={isLoading}
        >
          {isWished ? '카페 찜 취소 ❤️' : '카페 찜하기 ♡'}
        </Button>
      </div>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}

export default CafeInfoPage;