export const TextInput = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <input
    type="text"
    value={value}
    placeholder={placeholder}
    className="w-full px-1 py-3 bg-white border-b-2 border-stone-300 focus:outline-none focus:border-[#4A3A2E] text-sm text-stone-800 placeholder:text-stone-400 transition-colors"
    onChange={(e) => onChange(e.target.value)}
  />
);
