import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '@/components/common/Button';
import CafeImageList from '@/components/cafe/CafeImageList';
import ImageModal from '@/components/cafe/ImageModal';
import CafeStudyGauge from '@/components/cafe/CafeStudyGauge';
import CafeScoreCards from '@/components/cafe/CafeScoreCards';
import { useCafeInfo, toImageUrl } from '@/hooks/useCafeInfo';

function CafeInfoPage() {
  const { cafeId } = useParams<{ cafeId: string }>();
  const navigate = useNavigate();
  const { cafe, isWished, isLoading, handleWishToggle } = useCafeInfo(cafeId);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  
  const cafeImages = (cafe?.imageName ?? []).map(toImageUrl);



  if (!cafe) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-56px)]">
        <div className="w-7 h-7 border-4 border-[#8B7368] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-gray-50">

      {/* 헤더 카드 */}
      <div className="bg-white px-5 pt-5 pb-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold text-gray-900 leading-snug break-keep">
          📍 {cafe.name}
          </h1>
          {cafe.placeId && (
            <a
              href={`https://place.map.kakao.com/${cafe.placeId}`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[#F9E000] text-gray-900 text-xs font-semibold rounded-lg"
            >
              카카오맵 ↗
            </a>
          )}
        </div>

        {/* 태그 */}
        {cafe.tags && cafe.tags.length > 0 && (
          <div className="bg-white rounded-2xl px-1 pt-4">
            <div className="flex flex-wrap gap-2">
              {cafe.tags.map((tag, i) => (
                <span key={i} className="text-xs font-semibold text-[#8B7368] bg-[#F5EDE8] px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4 py-4">

        {/* 카공 적합도 + 스코어 카드 */}
        <div className="bg-white rounded-2xl px-5 py-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-800">카페 분석 리포트</p>
            {cafe.score && cafe.score.reviewCount > 0 && (
              <p className="text-xs text-gray-400">리뷰 {cafe.score.reviewCount}개 기반</p>
            )}
          </div>
          {!cafe.score || cafe.score.reviewCount === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">아직 등록된 리뷰가 없습니다.</p>
              <p className="text-xs text-gray-300 mt-1">첫 번째 리뷰를 남겨보세요!</p>
            </div>
          ) : (
            <>
              <CafeStudyGauge score={cafe.score.studyScoreAvg ?? 0} />
              <div className="mt-3">
                <CafeScoreCards scores={cafe.score} />
              </div>
            </>
          )}
        </div>

        {/* 이미지 */}
        {cafeImages.length > 0 && (
          <div className="bg-white rounded-2xl px-5 py-5">
            <CafeImageList
              images={cafeImages}
              onImageClick={setSelectedImage}
            />
          </div>
        )}




        {/* 한줄리뷰 */}
        <div className="bg-white rounded-2xl px-5 py-5">
          <p className="text-sm font-semibold text-gray-800 mb-3">한줄리뷰</p>
          {cafe.shortReviews && cafe.shortReviews.length > 0 ? (
            <div className="flex flex-col gap-2">
              {cafe.shortReviews.map((review, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#8B7368] mt-0.5">💬</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{review}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">아직 등록된 한줄리뷰가 없습니다.</p>
          )}
        </div>
        {/* 안내 문구 */}
        <p className="text-xs text-gray-400 text-center leading-relaxed px-4 break-keep">
          실제 리뷰를 바탕으로 카페의 분위기와 작업 환경을 분석한 리포트입니다.
          이용자 경험을 데이터로 정리해 더 정확한 카페 선택을 돕습니다.
        </p>

        {/* 버튼 영역 */}
        <div className="flex flex-col gap-2 mt-4">
<Button
  variant="brown4"
  size="full"
  textColor="white"
  onClick={handleWishToggle}
  disabled={isLoading}
>
  <span className="flex items-center justify-center gap-2">
    <span
      className={`text-lg transition ${
        isWished ? 'text-red-500' : 'text-white'
      }`}
    >
      {isWished ? '❤️' : '🤍'}
    </span>
    {isWished ? '찜 완료' : '카페 찜하기'}
  </span>
</Button>
          <Button
            variant="brown1"
            size="full"
            textColor="brown"
            onClick={() => navigate(-1)}
          >
            카페 목록으로 돌아가기
          </Button>
        </div>

      </div>

      <ImageModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}

export default CafeInfoPage;
