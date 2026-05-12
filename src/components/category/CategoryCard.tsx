import { REGION_LABELS, RegionId } from '@/constants/regions';
import sogangImg from '@/assets/images/Category/sogang.png';
import yonseiImg from '@/assets/images/Category/yonsei.png';
import hongikImg from '@/assets/images/Category/hongik.png';
import ewhaImg from '@/assets/images/Category/ewha.png';
import hapjeongImg from '@/assets/images/Category/hapjeong.png';
import allSpotImg from '@/assets/images/Category/allspot.png';

export type CategoryId = RegionId;

export const CATEGORIES: { id: CategoryId; imgSrc: string; alt: string }[] = [
  { id: 'sogang', imgSrc: sogangImg, alt: '서강대학교' },
  { id: 'yonsei', imgSrc: yonseiImg, alt: '연세대학교' },
  { id: 'hongik', imgSrc: hongikImg, alt: '홍익대학교' },
  { id: 'ewha', imgSrc: ewhaImg, alt: '이화여자대학교' },
  { id: 'hapjeong', imgSrc: hapjeongImg, alt: '합정역 근처' },
  { id: 'all', imgSrc: allSpotImg, alt: '전체 모아보기' },
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
        w-28 h-32 rounded-2xl flex flex-col items-center justify-center gap-2
        border-2 transition-all duration-200
        ${isActive
          ? 'border-brown-2 bg-brown-400 bg-opacity-10 shadow-md scale-105'
          : 'border-gray-200 bg-white shadow-sm hover:border-brown-2 hover:scale-105'}
      `}
    >
      <img src={imgSrc} alt={alt} className="w-16 h-16 object-contain" />
      <span className={`text-xs mt-2 font-semibold ${isActive ? 'text-brown-4' : 'text-gray-600'}`}>
        {REGION_LABELS[id]}
      </span>
    </button>
  );
}
