import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import sogangImg from '@/assets/images/Category/sogang.png';
import yonseiImg from '@/assets/images/Category/yonsei.png';
import hongikImg from '@/assets/images/Category/hongik.png';
import ewhaImg from '@/assets/images/Category/ewha.png';
import hapjeongImg from '@/assets/images/Category/hapjeong.png';
import allSpotImg from '@/assets/images/Category/allspot.png';
import { REGION_LABELS, RegionId, UNIVERSITY_COORDS } from '@/constants/regions';

type CategoryId = RegionId;

interface CategoryCardProps {
  id: CategoryId;
  selected: CategoryId | null;
  onSelect: (id: CategoryId) => void;
  imgSrc: string;
  alt: string;
}

function CategoryCard({ id, selected, onSelect, imgSrc, alt }: CategoryCardProps) {
  const isActive = selected === id;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`
        w-36 h-40 rounded-2xl flex flex-col items-center justify-center gap-3
        border-2 transition-all duration-200
        ${isActive
          ? 'border-brown-2 bg-brown-400 bg-opacity-10 shadow-md scale-105'
          : 'border-gray-200 bg-white shadow-sm hover:border-brown-2 hover:scale-105'}
      `}
    >
      <img src={imgSrc} alt={alt} className="w-20 h-20 object-contain" />
      <span className={`text-sm font-semibold ${isActive ? 'text-brown-4' : 'text-gray-600'}`}>
        {REGION_LABELS[id]}
      </span>
    </button>
  );
}

export default function CategoryPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CategoryId | null>(null);
  const [selectedDoor, setSelectedDoor] = useState<string | null>(null);

  const doorOptions = selected ? Object.keys(UNIVERSITY_COORDS[selected] ?? {}) : [];

  useEffect(() => {
    if (doorOptions.length === 0) {
      setSelectedDoor(null);
      return;
    }
    setSelectedDoor((prev) => (prev && doorOptions.includes(prev) ? prev : doorOptions[0]));
  }, [selected]);

  const handleSelect = (value: CategoryId) => {
    setSelected(value);
  };

  return (
        <div className="flex flex-col items-center justify-center mt-20 px-10">
      <div className="mb-12 text-left w-full max-w-xs">
        <h1 className="text-2xl font-bold text-[#4A3A2E] leading-snug mb-2">
          오늘 공부하고 싶은 지역을
          <br />
          선택해주세요 :)
        </h1>
        <p className="text-sm text-[#6D5D50]">지역은 선택한 지역 기반 xm까지~</p>
      </div>
      <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">
        <CategoryCard
          id="sogang"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={sogangImg}
          alt="서강대학교"
        />
        <CategoryCard
          id="yonsei"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={yonseiImg}
          alt="연세대학교"
        />
        <CategoryCard
          id="hongik"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={hongikImg}
          alt="홍익대학교"
        />
        <CategoryCard
          id="ewha"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={ewhaImg}
          alt="이화여자대학교"
        />

        <CategoryCard
          id="hapjeong"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={hapjeongImg}
          alt="합정역 근처"
        />
        <CategoryCard
          id="all"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={allSpotImg}
          alt="전체 모아보기"
        />
      </div>
      
      <section className="w-full max-w-xs mb-8 min-h-[72px]">
        <h2 className="text-sm font-semibold mb-3 text-gray-700">출입구 선택</h2>
        <div className="flex flex-wrap gap-2">
          {doorOptions.map((door) => (
            <Button
              key={door}
              onClick={() => setSelectedDoor(door)}
              variant={selectedDoor === door ? 'brown4' : 'brown1'}
              size="tag"
              textColor={selectedDoor === door ? 'white' : 'brown'}
            >
              {door}
            </Button>
          ))}
        </div>
      </section>

      <Button
        size="full"
        textColor="white"
        className="w-full max-w-xs mt-auto text-base"
        onClick={() => navigate('/cafelist', { state: { region: selected, door: selectedDoor } })}
      >
        적용하기
      </Button>
      <div className="flex flex-col gap-4 w-full max-w-xs">

      </div>
    </div>

  );
}
