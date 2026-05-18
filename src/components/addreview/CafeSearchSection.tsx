import { useRef, useState } from 'react';
import { SearchInput } from '@/components/common/SearchInput';
import { useKakaoSearch, KakaoPlace } from '@/hooks/useKakaoSearch';

interface CafeSearchSectionProps {
  onSelect: (place: KakaoPlace) => void;
}

const CafeSearchSection = ({ onSelect }: CafeSearchSectionProps) => {
  const { results, search } = useKakaoSearch();
  const [selectedName, setSelectedName] = useState('');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (keyword: string) => {
    search(keyword);
    setOpen(true);
  };

  const handleSelect = (place: KakaoPlace) => {
    setSelectedName(place.place_name);
    setOpen(false);
    onSelect(place);
  };

  return (
    <div className="mb-6 relative" ref={dropdownRef}>
      <p className="mb-3 text-sm text-stone-400">
        방문한 카페를 검색하고, 솔직한 리뷰를 남겨보세요 :){' '}
      </p>
      <SearchInput placeholder="카페를 검색하세요" onSearch={handleSearch} />
      {open && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-md mt-1 max-h-48 overflow-y-auto">
          {results.map((place) => (
            <li
              key={place.id}
              onClick={() => handleSelect(place)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100"
            >
              <p className="text-sm font-semibold text-stone-800">{place.place_name}</p>
              <p className="text-xs text-gray-400">{place.address_name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CafeSearchSection;
