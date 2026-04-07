import cafeImg from '@/assets/images/CafeList/cafeimg.png';
import type { KakaoCafe } from '@/types/cafe';

interface CafeCardProps {
  cafe: KakaoCafe;
}

export default function CafeCard({ cafe }: CafeCardProps) {
  return (
    <div className="flex items-center gap-6">
      {/* 카페 이미지 */}
      <img
        src={cafeImg}
        alt="cafe"
        className="w-16 h-16 rounded-xl object-cover shrink-0 ml-2"
      />

      {/* 카페 정보 */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{cafe.name}</p>
        <div className="flex gap-1 flex-wrap mt-1">
          {cafe.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-800 truncate">{cafe.address}</p>
      </div>
    </div>
  );
}
