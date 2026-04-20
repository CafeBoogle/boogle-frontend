import api from '@/api/axios';

interface ReviewData {
  cafeId: number;
  comment: string;
  ratings: Record<string, number>;
  selectedFile: File | null;
}

export const useSubmitReview = () => {
  const submitReview = async ({ cafeId, comment, ratings, selectedFile }: ReviewData) => {
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
    if (selectedFile) formData.append('image', selectedFile);

    try {
      const response = await api.post('/api/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('성공적으로 저장되었습니다! 리뷰 ID: ' + response.data);
    } catch (error) {
      console.error(error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return { submitReview };
};
