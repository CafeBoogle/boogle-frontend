import type { KakaoCafe } from '@/types/cafe';

interface CafeCardProps {
  cafe: KakaoCafe;
}

export default function CafeCard({ cafe }: CafeCardProps) {
  const reviewCount = cafe.score?.reviewCount ?? 0;
  const reviewLabel = reviewCount >= 10 ? '검증된 카페' : reviewCount > 0 ? `리뷰 ${reviewCount}개` : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold text-[#4A3A2E] text-sm truncate">{cafe.name}</p>
        {reviewLabel && (
          <span
            className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${
              reviewCount >= 10
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {reviewLabel}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-400 truncate">{cafe.address}</p>

      {cafe.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {cafe.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#F5F0EB] text-[#8B7368] text-[11px] px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
