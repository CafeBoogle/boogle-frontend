import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { toImageUrl } from '@/constants/api';
import { ImageUploader } from '@/components/addreview/ImageUploader';
import RatingSliderList from '@/components/addreview/RatingSliderList';
import { TextInput } from '@/components/common/TextInput';
import Button from '@/components/common/Button';

const EditReviewPage = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const parsedReviewId = reviewId ? Number(reviewId) : null;

  const [comment, setComment] = useState('');
  const [ratings, setRatings] = useState<Record<string, number> | null>(null);
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [cafeName, setCafeName] = useState('');

  useEffect(() => {
    if (!parsedReviewId) return;

    const fetchReview = async () => {
      try {
        const res = await api.get(`/api/reviews/detail/${parsedReviewId}`);
        const data = res.data;

        setComment(data.shortReview ?? '');
        setRatings({
          study: data.studyScore ?? 3,
          outlet: data.outletScore ?? 3,
          seat: data.seatScore ?? 3,
          toilet: data.toiletScore ?? 3,
          wifi: data.wifiScore ?? 3,
          noise: data.noiseScore ?? 3,
        });
        setCafeName(data.cafeName);
        setExistingImages(data.images ?? []);
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
    formData.append(
      'data',
      new Blob(
        [
          JSON.stringify({
            shortReview: comment,
            toiletScore: ratings.toilet,
            outletScore: ratings.outlet,
            seatScore: ratings.seat,
            wifiScore: ratings.wifi,
            noiseScore: ratings.noise,
            studyScore: ratings.study,
            deleteImageIds: deletedImageIds,
          }),
        ],
        { type: 'application/json' },
      ),
      'data.json',
    );
    newFiles.forEach((file) => formData.append('images', file));

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
    <div className="max-w-md mx-auto ml-1 my-8 px-8 py-6 bg-white rounded-lg shadow">
      {cafeName && (
        <h1 className="text-2xl font-bold text-[#4A3A2E] leading-snug mb-3">☕ {cafeName}</h1>
      )}

      <p className="mb-4 text-xs text-stone-400">기억을 조금 더 정확하게 남겨봐요 ✏️</p>

      <div className="flex items-center gap-2 mt-6 mb-5">
        <span className="text-sm font-semibold text-[#4A3A2E]">점수 평가</span>
        <span className="text-red-500 text-s">*</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      <RatingSliderList ratings={ratings} onChange={handleRatingChange} />

      <div className="mb-8">
        <TextInput
          placeholder="한 줄 리뷰를 작성해주세요"
          value={comment || ''}
          onChange={setComment}
        />
      </div>
      <ImageUploader
        onFilesSelect={(files) => setNewFiles((prev) => [...prev, ...files])}
        existingImages={existingImages.map((img) => toImageUrl(img.url))}
        onRemoveExisting={(idx) => {
          setDeletedImageIds((prev) => [...prev, existingImages[idx].id]);
          setExistingImages((prev) => prev.filter((_, i) => i !== idx));
        }}
      />

      <Button variant="brown4" size="full" onClick={handleSubmit}>
        저장
      </Button>
    </div>
  );
};

export default EditReviewPage;
