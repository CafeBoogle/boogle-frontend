interface SearchInputProps {
  placeholder: string;
  onSearch: (value: string) => void;
}

export const SearchInput = ({ placeholder, onSearch }: SearchInputProps) => (
  <div className="relative w-full">
    <input
      type="text"
      placeholder={placeholder}
      className="w-full p-4 bg-gray-200 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-stone-600"
      onChange={(e) => onSearch(e.target.value)}
    />
    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
  </div>
);
