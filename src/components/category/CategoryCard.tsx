import { REGION_LABELS, RegionId } from '@/constants/regions';
import sogangImg from '@/assets/images/Category/sogang.png';
import yonseiImg from '@/assets/images/Category/yonsei.png';
import hongikImg from '@/assets/images/Category/hongik.png';
import ewhaImg from '@/assets/images/Category/ewha.png';
import hapjeongImg from '@/assets/images/Category/hapjeong.svg';
import sinchonImg from '@/assets/images/Category/sinchon.png';
import allSpotImg from '@/assets/images/Category/allspot.png';

export type CategoryId = RegionId;

export const CATEGORIES: { id: CategoryId; imgSrc: string; alt: string }[] = [
  { id: 'sogang', imgSrc: sogangImg, alt: '서강대학교' },
  { id: 'yonsei', imgSrc: yonseiImg, alt: '연세대학교' },
  { id: 'hongik', imgSrc: hongikImg, alt: '홍익대학교' },
  { id: 'ewha', imgSrc: ewhaImg, alt: '이화여자대학교' },
  { id: 'sinchon', imgSrc: sinchonImg, alt: '신촌역 근처' },
  { id: 'hapjeong', imgSrc: hapjeongImg, alt: '합정역 근처' },
];

interface CategoryCardProps {
  id: CategoryId;
  selected: CategoryId | null;
  onSelect: (id: CategoryId) => void;
  imgSrc: string;
  alt: string;
}

export function CategoryCard({ id, selected, onSelect, imgSrc, alt }: CategoryCardProps) {
  const isActive = selected === id;

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`
        w-full h-32 rounded-2xl flex flex-col items-center justify-center gap-2
        border-0 outline-none transition-all duration-200
        ${
          isActive
            ? 'bg-[#F2EBE3] shadow-md ring-1 ring-[#C4A882]'
            : 'bg-white shadow-sm hover:bg-[#FAF7F4] hover:shadow-md'
        }
      `}
    >
      <img src={imgSrc} alt={alt} className="w-14 h-14 object-contain" />
      <span
        className={`text-xs ${isActive ? 'text-[#4A3A2E] font-bold' : 'text-stone-500 font-medium'}`}
      >
        {REGION_LABELS[id]}
      </span>
    </button>
  );
}
