import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ImageUploader } from '@/components/addreview/ImageUploader';
import { TextInput } from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import RatingSliderList from '@/components/addreview/RatingSliderList';
import { toImageUrl } from '@/constants/api';
import api from '@/api/axios';

const EditReviewPage = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const parsedReviewId = reviewId ? Number(reviewId) : null;

  const [cafeName, setCafeName] = useState('');
  const [comment, setComment] = useState('');
  const [ratings, setRatings] = useState<Record<string, number> | null>(null);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!parsedReviewId) return;

    const fetchReview = async () => {
      try {
        const res = await api.get(`/api/reviews/detail/${parsedReviewId}`);
        const data = res.data;

        setCafeName(data.cafeName ?? '');
        setComment(data.shortReview ?? '');

        setRatings({
          study: data.studyScore ?? 3,
          outlet: data.outletScore ?? 3,
          seat: data.seatScore ?? 3,
          toilet: data.toiletScore ?? 3,
          wifi: data.wifiScore ?? 3,
          noise: data.noiseScore ?? 3,
        });

        setExistingImages(data.imageUrls ?? []);
      } catch (e) {
        console.error(e);
        alert('리뷰 불러오기 실패');
      }
    };

    fetchReview();
  }, [parsedReviewId]);

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!parsedReviewId || !ratings) return;

    const formData = new FormData();

    const data = {
      shortReview: comment,
      toiletScore: ratings.toilet,
      outletScore: ratings.outlet,
      seatScore: ratings.seat,
      wifiScore: ratings.wifi,
      noiseScore: ratings.noise,
      studyScore: ratings.study,
      imageUrls: existingImages,
    };

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' }),
      'data.json',
    );

    newFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await api.patch(`/api/reviews/${parsedReviewId}`, formData);
      alert('수정 완료!');
      navigate('/mypage');
    } catch (e) {
      console.error(e);
      alert('수정 실패');
    }
  };

  if (!ratings) return <div className="text-center mt-10 text-gray-400">로딩 중...</div>;

  return (
    <div className="max-w-md p-4 bg-white pb-10 px-8 mx-auto mt-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-[#4A3A2E] mb-4">리뷰 수정</h1>

      {/* ✅ 카페 고정 */}
      <div className="mb-4 p-3 bg-[#F7F3EF] rounded-lg">
        <p className="text-sm text-gray-500">카페</p>
        <p className="font-semibold text-[#4A3A2E]">{cafeName}</p>
      </div>

      {/* ✅ 기존 이미지 */}
      {existingImages.length > 0 && (
        <div className="flex gap-2 mb-4">
          {existingImages.map((url, idx) => (
            <div key={idx} className="relative">
              <img
                src={toImageUrl(url)} // ✅ 여기 핵심
                className="w-20 h-20 object-cover rounded"
              />

              <button
                onClick={() => setExistingImages((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute top-0 right-0 bg-black text-white text-xs px-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ✅ 새 이미지 */}
      <div className="flex justify-center mb-6">
        <ImageUploader onFilesSelect={(files) => setNewFiles(files)} />
      </div>

      {/* ✅ 점수 */}
      <RatingSliderList ratings={ratings} onChange={handleRatingChange} />

      {/* ✅ 리뷰 */}
      <div className="mb-8">
        <TextInput
          placeholder="한 줄 리뷰를 작성해주세요"
          value={comment || ''}
          onChange={setComment}
        />
      </div>

      <Button onClick={handleSubmit} variant="brown4" size="full">
        수정하기
      </Button>
    </div>
  );
};

export default EditReviewPage;
