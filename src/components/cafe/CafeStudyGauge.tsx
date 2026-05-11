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
    clamped >= 4 ? '매우 추천해요!' : clamped >= 3 ? '카공하기 좋은 곳 !' : clamped >= 2 ? '잘 알아보고 결정하세요!' : '카공을 위해서는 다른 카페를 ..';
  const desc =
    clamped >= 4 ? '카공러들이 즐겨 찾는 최적의 카페예요.' :
    clamped >= 3 ? '전반적으로 카공하기 좋은 환경이에요.' :
    clamped >= 2   ? '카공 환경을 꼼꼼히 확인하고 방문하세요.' :
                     '카공보다는 일반 이용에 적합한 카페예요.';

  return (
    <div className="flex flex-col items-center gap-2 py-3">
      <p className="text-4xl font-bold text-gray-800">
        {clamped.toFixed(1)}
        <span className="text-base font-normal text-gray-400"> / 5</span>
      </p>
      <span className="text-sm font-bold" style={{ color }}>
        {label}
      </span>
      <p className="text-xs text-gray-400 text-center">{desc}</p>
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
