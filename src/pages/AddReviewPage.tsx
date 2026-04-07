import { useState } from 'react';
import api from '@/api/axios';
import { SearchInput } from '@/components/common/SearchInput';
import { ImageUploader } from '@/components/common/ImageUploader';
import { Slider } from '@/components/common/Slider';
import { TextInput } from '@/components/common/TextInput';

const AddReviewPage = () => {
  const [cafeId] = useState(1);
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [ratings, setRatings] = useState({
    outlet: 3,
    seat: 3,
    noise: 3,
    toilet: 3,
    wifi: 3,
  });

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    const reviewData = {
      cafeId: cafeId,
      shortReview: comment,
      outletScore: ratings.outlet,
      seatScore: ratings.seat,
      noiseScore: ratings.noise,
      toiletScore: ratings.toilet,
      wifiScore: ratings.wifi,
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
    <div className="max-w-md mx-auto p-4 bg-white min-h-screen pb-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 italic text-[#433633]">Boogle</h2>
        <SearchInput placeholder="카페를 검색하세요" onSearch={(v) => console.log(v)} />
        <p className="mt-4 text-sm font-bold text-stone-800">📍 스타벅스 서강대점</p>
      </div>

      <div className="flex justify-center mb-6">
        <ImageUploader onFileSelect={(file) => setSelectedFile(file)} />
      </div>

      {/* 평가 항목 리스트 */}
      <div className="space-y-4 mb-8">
        <Slider
          label="콘센트"
          tip="거의 없어요 / 보통이에요 / 넉넉해요"
          min={1}
          max={5}
          value={ratings.outlet}
          onChange={(v) => handleRatingChange('outlet', v)}
        />
        <Slider
          label="좌석 수"
          tip="거의 없어요 / 보통이에요 / 넉넉해요"
          min={1}
          max={5}
          value={ratings.seat}
          onChange={(v) => handleRatingChange('seat', v)}
        />
        <Slider
          label="소음"
          tip="조용해요 / 보통이에요 / 북적거려요"
          min={1}
          max={5}
          value={ratings.noise}
          onChange={(v) => handleRatingChange('noise', v)}
        />
        {/* 추가된 항목 */}
        <Slider
          label="화장실"
          tip="불편해요 / 평범해요 / 깨끗해요"
          min={1}
          max={5}
          value={ratings.toilet}
          onChange={(v) => handleRatingChange('toilet', v)}
        />
        <Slider
          label="와이파이"
          tip="끊겨요 / 보통이에요 / 빨라요"
          min={1}
          max={5}
          value={ratings.wifi}
          onChange={(v) => handleRatingChange('wifi', v)}
        />
      </div>

      <div className="mb-8">
        <TextInput placeholder="한 줄 리뷰를 작성해주세요" value={comment} onChange={setComment} />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-4 bg-[#433633] text-white rounded-lg font-bold text-lg hover:bg-[#2d2422] transition-colors"
      >
        저장
      </button>
    </div>
  );
};

export default AddReviewPage;
