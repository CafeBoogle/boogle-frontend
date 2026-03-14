interface SliderProps {
  label: string;
  tip: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
}

export const Slider = ({ label, tip, min, max, value, onChange }: SliderProps) => {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full my-4">
      <div className="flex items-center mb-1">
        <span className="font-bold w-16">{label}</span>
        <div className="flex-1 flex justify-between relative px-2">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-black -translate-y-1/2 z-0" />
          {steps.map((num) => (
            <button
              key={num}
              onClick={() => onChange(num)}
              className={`relative z-10 w-6 h-6 rounded-full text-xs flex items-center justify-center border transition-colors ${
                value === num ? 'bg-stone-700 text-white' : 'bg-gray-200 border-gray-400'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-gray-500 text-center ml-16">{tip}</p>
    </div>
  );
};
