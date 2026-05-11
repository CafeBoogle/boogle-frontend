import ProgressBar from '@ramonak/react-progress-bar';

interface Props {
  score: number;
}

export default function CafeStudyGauge({ score }: Props) {
  const clamped = Math.min(Math.max(score, 0), 5);
  const pct = Math.round((clamped / 5) * 100);

  const color =
    clamped >= 4 ? '#22c55e' : clamped >= 3 ? '#f59e0b' : clamped >= 2 ? '#f97316' : '#ef4444';
  const label =
    clamped >= 4 ? '매우 적합' : clamped >= 3 ? '적합' : clamped >= 2 ? '보통' : '부적합';

  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <p className="text-4xl font-bold text-gray-800">
        {clamped.toFixed(1)}
        <span className="text-base font-normal text-gray-400"> / 5</span>
      </p>
      <span className="text-sm font-bold" style={{ color }}>
        {label}
      </span>
      <div className="w-full mt-1">
        <ProgressBar
          completed={pct}
          bgColor={color}
          baseBgColor="#e5e7eb"
          height="14px"
          borderRadius="8px"
          isLabelVisible={false}
          animateOnRender
        />
      </div>
    </div>
  );
}
