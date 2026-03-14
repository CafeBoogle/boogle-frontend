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
    className="w-full p-4 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-600 text-sm"
    onChange={(e) => onChange(e.target.value)}
  />
);
