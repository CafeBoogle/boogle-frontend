import { useState, useEffect } from 'react';

interface SearchInputProps {
  placeholder: string;
  onSearch: (value: string) => void;
  delay?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export const SearchInput = ({
  placeholder,
  onSearch,
  delay = 300,
  value: externalValue,
  onChange,
}: SearchInputProps) => {
  const [value, setValue] = useState(externalValue ?? '');

  useEffect(() => {
    setValue(externalValue ?? '');
  }, [externalValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        className={`w-full px-4 py-3 pr-12 rounded-xl border-2 focus:outline-none text-sm transition-colors ${
          externalValue
            ? 'border-[#4A3A2E] bg-[#F7F3EF] text-stone-800 font-semibold'
            : 'border-stone-200 bg-white text-stone-800 focus:border-[#4A3A2E]'
        }`}
        onChange={handleChange}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
    </div>
  );
};
