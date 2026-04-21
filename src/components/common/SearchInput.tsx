import { useState, useEffect } from 'react';

interface SearchInputProps {
  placeholder: string;
  onSearch: (value: string) => void;
  delay?: number;
}

export const SearchInput = ({ placeholder, onSearch, delay = 300 }: SearchInputProps) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        className="w-full p-4 bg-gray-200 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-stone-600"
        onChange={(e) => setValue(e.target.value)}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
    </div>
  );
};
