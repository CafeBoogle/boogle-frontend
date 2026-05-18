import { useState } from 'react';
import { ImageUploader } from '@/components/addreview/ImageUploader';
import { TextInput } from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import CafeSearchSection from '@/components/addreview/CafeSearchSection';
import RatingSliderList from '@/components/addreview/RatingSliderList';
import { useSubmitReview } from '@/hooks/useSubmitReview';
import { KakaoPlace } from '@/hooks/useKakaoSearch';
import api from '@/api/axios';

const INITIAL_RATINGS: Record<string, number> = {
  study: 3,
  outlet: 3,
  seat: 3,
  toilet: 3,
  wifi: 3,
  noise: 3,
};

const AddReviewPage = () => {
  const [cafeId, setCafeId] = useState<number>(0);
  const [cafeName, setCafeName] = useState<string>('');
  const [comment, setComment] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>(INITIAL_RATINGS);

  const { submitReview } = useSubmitReview();

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelect = async (place: KakaoPlace) => {
    try {
      const response = await api.post('/api/cafes/save', {
        kakaoPlaceId: String(place.id),
        name: place.place_name,
        address: place.address_name,
        latitude: Number(place.y),
        longitude: Number(place.x),
      });
      setCafeId(response.data);
      setCafeName(place.place_name);
    } catch (error) {
      alert('카페 정보를 불러오는 데 실패했습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto ml-1 my-8 px-8 py-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold text-[#4A3A2E] leading-snug mb-1">
        오늘의 카페, 어땠나요?
      </h1>
      <p className="mb-4 text-xs text-stone-400">
        방문한 카페를 검색하고, 솔직한 리뷰를 남겨보세요 :)
      </p>
      <CafeSearchSection onSelect={handleSelect} />

      <div className="flex items-center gap-2 mt-6 mb-5">
        <span className="text-sm font-semibold text-[#4A3A2E]">점수 평가</span>
        <span className="text-red-500 text-s">*</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>
      <RatingSliderList ratings={ratings} onChange={handleRatingChange} />

      <div className="mb-8">
        <TextInput placeholder="한 줄 리뷰를 작성해주세요" value={comment} onChange={setComment} />
      </div>
      <div className="mb-8">
        <ImageUploader onFilesSelect={(files) => setSelectedFiles(files)} />
      </div>
      <Button
        variant="brown4"
        size="full"
        onClick={() => submitReview({ cafeId, comment, ratings, images: selectedFiles })}
      >
        저장
      </Button>
    </div>
  );
};

export default AddReviewPage;
