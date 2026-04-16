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

  const sliderConfig = [
    { key: 'study', label: '카공 적합도', tip: '비추천 / 괜찮아요 / 최고예요' },
    { key: 'outlet', label: '콘센트', tip: '없어요 / 보통이에요 / 자리마다 있어요' },
    { key: 'seat',   label: '좌석 수', tip: '테이블이 3개 이하 / 보통이에요 / 대형 카페에요' },
    { key: 'toilet', label: '화장실',  tip: '불편해요 / 평범해요 / 깨끗해요' },
    { key: 'wifi',   label: '와이파이', tip: '없어요 / 끊겨요 / 빨라요' },
    { key: 'noise',  label: '소음',    tip: '시끄러워요 / 보통이에요 / 조용해요' },
  ];

  const [ratings, setRatings] = useState(
    Object.fromEntries(sliderConfig.map(({ key }) => [key, 3]))
  );

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    const reviewData = {
      cafeId: cafeId,
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
        {sliderConfig.map(({ key, label, tip }) => (
          <Slider
            key={key}
            label={label}
            tip={tip}
            min={1}
            max={5}
            value={ratings[key]}
            onChange={(v) => handleRatingChange(key, v)}
          />
        ))}
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
