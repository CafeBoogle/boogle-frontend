import { SearchInput } from '@/components/common/SearchInput';

interface CafeSearchSectionProps {
  cafeName: string;
  onSearch: (value: string) => void;
}

const CafeSearchSection = ({ cafeName, onSearch }: CafeSearchSectionProps) => {
  return (
    <div className="mb-6">
      <SearchInput placeholder="카페를 검색하세요" onSearch={onSearch} />
      {cafeName && (
        <p className="mt-4 text-sm font-bold text-stone-800">📍 {cafeName}</p>
      )}
    </div>
  );
};

export default CafeSearchSection;
