import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';

interface ReviewData {
  cafeId: number;
  comment: string;
  ratings: Record<string, number>;
  images: File[];
}

export const useSubmitReview = () => {
  const navigate = useNavigate();

  const submitReview = async ({ cafeId, comment, ratings, images }: ReviewData) => {
    if (cafeId === 0) {
      alert('카페를 선택해주세요.');
      return;
    }


    const formData = new FormData();

    const reviewData = {
      cafeId,
      shortReview: comment,
      studyScore: ratings.study,
      outletScore: ratings.outlet,
      seatScore: ratings.seat,
      toiletScore: ratings.toilet,
      wifiScore: ratings.wifi,
      noiseScore: ratings.noise,
    };

    formData.append('data', new Blob([JSON.stringify(reviewData)], { type: 'application/json' }));
    images.forEach((file) => formData.append('images', file));

    try {
      await api.post('/api/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/mypage');
    } catch (error: any) {
      if (error.response?.status === 400) {
        alert('입력 정보를 확인해주세요.');
      } else {
        alert('저장 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };
  
  const checkDuplicate = async (cafeId: number) => {
  if (cafeId === 0) return;

  try {
    const res = await api.get('/api/reviews/check', { params: { cafeId } });
    if (res.data.exists) {
      alert('이미 리뷰를 작성하신 카페입니다.');
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

return { submitReview, checkDuplicate };
};
