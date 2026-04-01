import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import sogangImg from '@/assets/images/Category/sogang.png';
import yonseiImg from '@/assets/images/Category/yonsei.png';
import hongikImg from '@/assets/images/Category/hongik.png';
import ewhaImg from '@/assets/images/Category/ewha.png';
import hapjeongImg from '@/assets/images/Category/hapjeong.png';
import allSpotImg from '@/assets/images/Category/allspot.png';
import { REGION_LABELS, RegionId } from '@/constants/regions';

type CategoryId = RegionId;

interface CircleImageButtonProps {
  id: CategoryId;
  selected: CategoryId | null;
  onSelect: (id: CategoryId) => void;
  imgSrc: string;
  alt: string;
}

function CircleImageButton({ id, selected, onSelect, imgSrc, alt }: CircleImageButtonProps) {
  const isActive = selected === id;

  return (
    <button
  type="button"
  onClick={() => onSelect(id)}
  className={`
    w-36 h-36 rounded-full flex items-center justify-center
    transition-transform duration-300 ease-out
    hover:scale-110
    ${isActive ? 'scale-110' : 'scale-90'}
  `}
>
      <img src={imgSrc} alt={alt} className="w-full h-full" />
    </button>
  );
}

export default function CategoryPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CategoryId | null>(null);

  const handleSelect = (value: CategoryId) => {
    setSelected(value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-8">
      <h1 className="text-2xl text-center mt-8 mb-8 text-gray-800">
        오늘은 <span className="text-brown-2 font-bold">어디서</span> 공부하고 싶으신가요?
      </h1>
      

      <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-6">
        <CircleImageButton
          id="sogang"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={sogangImg}
          alt="서강대학교"
        />
        <CircleImageButton
          id="yonsei"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={yonseiImg}
          alt="연세대학교"
        />
        <CircleImageButton
          id="hongik"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={hongikImg}
          alt="홍익대학교"
        />
        <CircleImageButton
          id="ewha"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={ewhaImg}
          alt="이화여자대학교"
        />

        <CircleImageButton
          id="hapjeong"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={hapjeongImg}
          alt="합정역 근처"
        />
        <CircleImageButton
          id="all"
          selected={selected}
          onSelect={handleSelect}
          imgSrc={allSpotImg}
          alt="전체 모아보기"
        />
      </div>
      
      <div>
        {selected && <p className="text-center text-lg mb-4 text-gray-700">선택한 지역: {REGION_LABELS[selected]}</p>}
      </div>

      <Button
        size="full"
        textColor="white"
        className="mt-5 text-xl"
        onClick={() => navigate('/filter', { state: { region: selected } })}
      >
        Next
      </Button>
    </div>
  );
}
