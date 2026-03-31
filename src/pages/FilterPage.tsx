import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "@/components/common/Button";
import Map from "../components/map/map";

interface LocationState {
  region: string | null;
}

// 1. 대학교별 중심 좌표 데이터
const regionCoordinates: Record<string, { lat: number; lng: number }> = {
  sogang: { lat: 37.5509, lng: 126.9411 }, // 서강대 정문
  yonsei: { lat: 37.5612, lng: 126.9368 }, // 연세대 정문
  hongik: { lat: 37.5507, lng: 126.9255 }, // 홍익대 정문
  ewha: { lat: 37.5591, lng: 126.9454 },   // 이화여대 정문
};

export default function FilterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || { region: null };

  const regionId = state.region;
  
  const [selectedDoor, setSelectedDoor] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const regionLabels: Record<string, string> = {
    sogang: '서강대학교',
    yonsei: '연세대학교',
    hongik: '홍익대학교',
    ewha: '이화여자대학교',
    hapjeong: '합정역 근처',
    all: '전체 모아보기',
  };

  const regionLabel = (regionId && regionLabels[regionId]) || '지역 정보 없음';

  // 2. 현재 선택된 지역 ID에 맞는 좌표 가져오기 (없으면 서강대 기본값)
  const currentCenter = (regionId && regionCoordinates[regionId]) || regionCoordinates.sogang;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleApply = () => {
    navigate('/cafelist', {
      state: {
        region: regionId,
        door: selectedDoor,
        tags: selectedTags,
      },
    });
  };

  return (
    <div className="px-8 mt-10 pb-10">
      {/* 지도 영역 - currentCenter를 props로 전달 */}
      <div className="w-full h-52 bg-white border border-gray-200 shadow-inner rounded-sm mb-10 overflow-hidden">
        <Map center={currentCenter} />
      </div>

      <section className="mb-8">
        <h2 className="text-lg font-semibold ml-2 mb-4 text-brown-4">선택 지역 : {regionLabel} </h2>
        <div className="flex gap-3">
          {['정문', '후문', '남문'].map((door) => {
            const isSelected = selectedDoor === door;
            return (
              <Button
                key={door}
                onClick={() => setSelectedDoor(door)}
                variant={isSelected ? 'brown4' : 'brown1'}
                size="tag"
                textColor={isSelected ? 'white' : 'brown'}
              >
                {door}
              </Button>
            );
          })}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-lg font-semibold ml-2 mb-4 flex items-center text-brown-4">
          저한테는 이게 특히 중요해요! 🔍
        </h2>
        <div className="flex flex-wrap gap-2">
          {['콘센트', '넓은 카페', '화장실', '와이파이', '24시 카페', '조용한 카페'].map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <Button
                key={tag}
                onClick={() => toggleTag(tag)}
                variant={isSelected ? 'brown4' : 'brown1'}
                size="tag"
                textColor={isSelected ? 'white' : 'brown'}
              >
                # {tag}
              </Button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-center mt-4">
        <Button
          variant="brown4"
          size="full"
          textColor="white"
          onClick={handleApply}
          className="text-lg"
        >
          적용하기
        </Button>
      </div>
    </div>
  );
}
