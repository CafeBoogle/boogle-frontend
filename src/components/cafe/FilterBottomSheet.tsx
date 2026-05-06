import Button from '@/components/common/Button';
import { SCORE_FILTERS, type ScoreFilterKey } from '@/constants/filterTags';

export { SCORE_FILTERS, type ScoreFilterKey };

export default function FilterBottomSheet({ selectedFilters, onToggle }: {
  selectedFilters: ScoreFilterKey[];
  onToggle: (key: ScoreFilterKey) => void;
}) {
  return (
    <><div>
        <div className="px-5 pt-4 pb-8">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

          <div className="flex flex-wrap gap-2 mb-6">
            {SCORE_FILTERS.map(({ key, label }) => {
              const selected = selectedFilters.includes(key);
              return (
                <Button
                  key={key}
                  onClick={() => onToggle(key)}
                  variant={selected ? 'brown4' : 'brown1'}
                  size="tag"
                  textColor={selected ? 'white' : 'brown'}
                >
                  {label}
                </Button>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}
