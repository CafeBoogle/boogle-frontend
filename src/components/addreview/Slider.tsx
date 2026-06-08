interface SliderProps {
  label: string;
  tip: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
  unknown?: boolean;
  onToggleUnknown?: () => void;
}

export const Slider = ({
  label,
  tip,
  min,
  max,
  value,
  onChange,
  unknown = false,
  onToggleUnknown,
}: SliderProps) => {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full">
      <div className="flex items-start">
        <div className="w-20 mr-3 shrink-0">
          <span className="text-sm font-semibold text-[#433633] whitespace-nowrap pt-1.5 block">
            {label}
          </span>
          <label className="flex items-center gap-1 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={unknown}
              onChange={onToggleUnknown}
              className="w-3 h-3 accent-stone-200"
            />
            <span className="text-[10px] text-stone-400">모르겠어요</span>
          </label>
        </div>

        <div
          className={`flex-1 flex flex-col transition-opacity ${unknown ? 'opacity-30 pointer-events-none' : ''}`}
        >
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
