import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { UNIVERSITY_COORDS } from '@/constants/regions';
import { CategoryCard, CATEGORIES, type CategoryId } from '@/components/category/CategoryCard';

export default function CategoryPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CategoryId | null>("sogang");
  const [selectedDoor, setSelectedDoor] = useState<string | null>(null);

  const doorOptions = selected ? Object.keys(UNIVERSITY_COORDS[selected] ?? {}) : [];

  useEffect(() => {
    if (doorOptions.length === 0) {
      setSelectedDoor(null);
      return;
    }
    setSelectedDoor((prev) => (prev && doorOptions.includes(prev) ? prev : doorOptions[0]));
  }, [selected]);

  return (
    <div className="flex flex-col items-center justify-center mt-10 px-10">
      <div className="w-full max-w-xs flex flex-col items-center">
      <div className="mb-8 text-left w-full">
        <h1 className="text-lg font-bold text-[#4A3A2E] leading-snug mb-2">
          오늘 공부하고 싶은 지역을
          <br />
          선택해주세요 :)
        </h1>
        <p className="text-xs text-[#6D5D50]">선택한 지역 주변 500m 스터디 스팟을 보여드려요</p>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-8 mb-10">
        {CATEGORIES.map(({ id, imgSrc, alt }) => (
          <CategoryCard
            key={id}
            id={id}
            selected={selected}
            onSelect={setSelected}
            imgSrc={imgSrc}
            alt={alt}
          />
        ))}
      </div>

      <section className="w-full mb-8 min-h-[72px]">
        <h2 className="text-sm font-semibold mb-3 text-gray-700">세부 선택</h2>
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
        variant="brown4"
        size="full"
        className="text-[15px] font-bold tracking-wide shadow-lg pb-3 mb-10"
        onClick={() => navigate('/cafelist', { state: { region: selected, door: selectedDoor } })}
      >
        적용하기
      </Button>
      </div>
    </div>
  );
}
