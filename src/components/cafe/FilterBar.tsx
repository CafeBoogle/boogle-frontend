import { useRef, useState } from 'react';
import { SCORE_FILTERS, type ScoreFilterKey, type SortKey } from '@/constants/filterTags';

interface FilterBarProps {
  selectedFilters: ScoreFilterKey[];
  sortBy: SortKey | null;
  onToggleFilter: (key: ScoreFilterKey) => void;
  onSort: (key: SortKey | null) => void;
}

export function FilterBar({ selectedFilters, sortBy, onToggleFilter, onSort }: FilterBarProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-6 pt-4 pb-2 shrink-0 border-t border-stone-100">
        <span className="text-sm font-medium text-stone-500">
          여러분에게 중요한 요소를 선택해주세요 !
        </span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 px-3 py-1 rounded-full border border-stone-200 text-xs text-stone-800 bg-white"
          >
            {sortBy ? SCORE_FILTERS.find((f) => f.scoreKey === sortBy)?.label + ' 순' : '거리순'}
            <span>{isDropdownOpen ? '▲' : '▼'}</span>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-8 bg-white border border-stone-200 rounded-xl shadow-lg z-30 w-40 py-1">
              <button
                onClick={() => {
                  onSort(null);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${!sortBy ? 'text-[#4A3A2E] font-semibold' : 'text-stone-500'}`}
              >
                거리순
              </button>

              {SCORE_FILTERS.map(({ scoreKey, label }) => (
                <button
                  key={scoreKey}
                  onClick={() => {
                    onSort(scoreKey);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${sortBy === scoreKey ? 'text-[#4A3A2E] font-semibold' : 'text-stone-500'}`}
                >
                  {label} 순
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-6 pb-4 shrink-0">
        {SCORE_FILTERS.map(({ key, label }) => {
          const active = selectedFilters.includes(key);
          return (
            <button
              key={key}
              onClick={() => onToggleFilter(key)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                active
                  ? 'bg-[#4A3A2E] text-white border-[#4A3A2E] shadow-sm'
                  : 'bg-white text-stone-500 border-stone-200'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center text-[10px] ${
                  active ? 'bg-white border-white text-[#4A3A2E]' : 'border-stone-300'
                }`}
              >
                {active && '✓'}
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}
