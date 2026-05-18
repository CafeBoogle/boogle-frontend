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
    clamped >= 4
      ? '☕ 오늘도 여기서 집중해요'
      : clamped >= 3
        ? '🪑 전반적으로 작업하기 괜찮아요'
        : clamped >= 2
          ? '🤔 방문 전에 한번 더 고민해요'
          : '🚶 다른 곳도 찾아보는건 어떨까요 ?';

  const desc =
    clamped >= 4
      ? '리뷰어들이 입을 모아 추천한, 카공 맛집이에요!'
      : clamped >= 3
        ? '전반적으로 조용하고 머물기 좋은 분위기예요:)'
        : clamped >= 2
          ? '콘센트·소음 등 꼼꼼히 확인하고 방문하세요.'
          : '카공보다는 가볍게 커피 한 잔 즐기기 좋은 곳이에요.';

  return (
    <div className="flex flex-col items-center gap-2 py-4 px-1">
      <p className="text-s text-gray-600 tracking-wide">리뷰어들의 종합 점수</p>

      <div className="flex items-end gap-1 leading-none">
        <span className="font-extrabold leading-none" style={{ fontSize: '4rem', color }}>
          {clamped.toFixed(1)}
        </span>
        <span className="text-lg text-gray-300 font-normal mb-2">/ 5</span>
      </div>
      <span className="text-sm font-semibold" style={{ color }}>
        {label}
      </span>

      <p className="text-xs text-gray-400 text-center leading-relaxed">{desc}</p>

      <div className="w-full mt-2">
        <ProgressBar
          completed={pct}
          bgColor={color}
          baseBgColor="#e5e7eb"
          height="12px"
          borderRadius="999px"
          isLabelVisible={false}
          animateOnRender
        />
      </div>
    </div>
  );
}
