import { useState } from 'react';
import { ImageUploader } from '@/components/addreview/ImageUploader';
import { TextInput } from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import CafeSearchSection from '@/components/addreview/CafeSearchSection';
import RatingSliderList from '@/components/addreview/RatingSliderList';
import { useSubmitReview } from '@/hooks/useSubmitReview';
import { KakaoPlace } from '@/hooks/useKakaoSearch';

const INITIAL_RATINGS: Record<string, number> = {
  study: 3, outlet: 3, seat: 3, toilet: 3, wifi: 3, noise: 3,
};

const AddReviewPage = () => {
  const [cafeId, setCafeId] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>(INITIAL_RATINGS);

  const { submitReview } = useSubmitReview();

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelect = (place: KakaoPlace) => {
    setCafeId(Number(place.id));
  };

  return (
    <div className="max-w-md p-4 bg-white pb-10 px-8 px-auto mx-4 my-8 mx-auto mt-6 rounded-lg shadow">
      <CafeSearchSection onSelect={handleSelect} />

      <div className="flex justify-center mb-6">
        <ImageUploader onFileSelect={(file) => setSelectedFile(file)} />
      </div>

      <RatingSliderList ratings={ratings} onChange={handleRatingChange} />

      <div className="mb-8">
        <TextInput placeholder="한 줄 리뷰를 작성해주세요" value={comment} onChange={setComment} />
      </div>

      <Button variant="brown4" size="full" onClick={() => submitReview({ cafeId, comment, ratings, selectedFile })}>
        저장
      </Button>
    </div>
  );
};

export default AddReviewPage;
