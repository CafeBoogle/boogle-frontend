import { useRef, useState } from 'react';
import { SCORE_FILTERS, type ScoreFilterKey, type SortKey } from '@/constants/filterTags';

interface FilterBarProps {
  selectedFilters: ScoreFilterKey[];
  sortBy: SortKey | null;
  onToggleFilter: (key: ScoreFilterKey) => void;
  onSort: (key: SortKey) => void;
}

export function FilterBar({ selectedFilters, sortBy, onToggleFilter, onSort }: FilterBarProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 pb-2 shrink-0">
        <span className="text-sm font-semibold text-gray-800">카페 선택 기준</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-600 bg-white"
          >
            {sortBy ? SCORE_FILTERS.find((f) => f.scoreKey === sortBy)?.label + ' 순' : '정렬'}
            <span className="text-xs">{isDropdownOpen ? '▲' : '▼'}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg z-30 w-40 py-1">
              {SCORE_FILTERS.map(({ scoreKey, label }) => (
                <button
                  key={scoreKey}
                  onClick={() => {
                    onSort(scoreKey);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${sortBy === scoreKey ? 'text-[#8B7368] font-semibold' : 'text-gray-700'}`}
                >
                  {label} 순
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide shrink-0">
        {SCORE_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onToggleFilter(key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedFilters.includes(key) ? 'bg-[#8B7368] text-white border-[#8B7368]' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </>
  );
}
