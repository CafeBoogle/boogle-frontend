import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { UNIVERSITY_COORDS } from '@/constants/regions';
import { CategoryCard, CATEGORIES, type CategoryId } from '@/components/category/CategoryCard';

export default function CategoryPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CategoryId | null>('sogang');
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
    <div className="mx-4 my-6 px-6 py-6 bg-white ">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#4A3A2E] leading-snug mb-1">
          공부하고 싶은 지역을
          <br />
          선택해주세요 ☕💻
        </h1>
        <p className="text-xs text-stone-400">선택한 지역 주변 500m 스터디 스팟을 보여드려요</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8 px-8 gap-4">
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

      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-semibold text-[#4A3A2E]">세부 선택</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>
      <section className="w-full mb-8 min-h-[72px]">
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
        onClick={() => navigate('/cafelist', { state: { region: selected, door: selectedDoor } })}
      >
        적용하기
      </Button>
    </div>
  );
}
