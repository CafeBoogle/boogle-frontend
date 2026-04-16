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
    <div className="w-full">
      <div className="flex items-start">
        <span className="text-sm font-semibold text-[#433633] w-20 whitespace-nowrap mr-3 pt-1.5">{label}</span>
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between relative px-1">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-stone-300 -translate-y-1/2 z-0" />
            {steps.map((num) => (
              <button
                key={num}
                onClick={() => onChange(num)}
                className={`relative z-10 w-7 h-7 rounded-full text-xs flex items-center justify-center transition-colors ${
                  value === num
                    ? 'bg-[#433633] text-white shadow-sm'
                    : 'bg-white border border-stone-300 text-stone-400 hover:border-[#433633]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-stone-500 text-center mt-1">{tip}</p>
        </div>
      </div>
    </div>
  );
};
