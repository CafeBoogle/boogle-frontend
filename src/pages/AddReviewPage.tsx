import { useState } from 'react';
import api from '@/api/axios';
import { ImageUploader } from '@/components/addreview/ImageUploader';
import { TextInput } from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import CafeSearchSection from '@/components/addreview/CafeSearchSection';
import RatingSliderList from '@/components/addreview/RatingSliderList';

const AddReviewPage = () => {
  const [cafeId] = useState(1);
  const [cafeName] = useState('스타벅스 서강대점');
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [ratings, setRatings] = useState<Record<string, number>>({
    study: 3, outlet: 3, seat: 3, toilet: 3, wifi: 3, noise: 3,
  });

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
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

  return (
    <div className="max-w-md p-4 bg-white pb-10 px-8 px-auto mx-4 my-8 mx-auto mt-6 rounded-lg shadow">
      <CafeSearchSection
        cafeName={cafeName}
        onSearch={(v) => console.log(v)}
      />

      <div className="flex justify-center mb-6">
        <ImageUploader onFileSelect={(file) => setSelectedFile(file)} />
      </div>

      <RatingSliderList ratings={ratings} onChange={handleRatingChange} />

      <div className="mb-8">
        <TextInput placeholder="한 줄 리뷰를 작성해주세요" value={comment} onChange={setComment} />
      </div>

      <Button variant="brown4" size="full" onClick={handleSubmit}>
        저장
      </Button>
    </div>
  );
};

export default AddReviewPage;
