const ITEMS = [
  { label: '콘센트', icon: '🔌', key: 'outletScoreAvg' },
  { label: '와이파이', icon: '📶', key: 'wifiScoreAvg' },
  { label: '넓은 좌석', icon: '🪑', key: 'seatScoreAvg' },
  { label: '조용한 카페', icon: '🤫', key: 'noiseScoreAvg' },
  { label: '화장실', icon: '🚻', key: 'toiletScoreAvg' },
] as const;

interface Props {
  scores: Record<string, number>;
}

export default function CafeScoreCards({ scores }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ITEMS.map(({ label, icon, key }) => {
        const score = scores[key] ?? 0;
        const pct = (score / 5) * 100;
        const color =
          score >= 4 ? '#22c55e' : score >= 3 ? '#f59e0b' : score >= 2 ? '#f97316' : '#ef4444';

        return (
          <div key={key} className="bg-gray-50 rounded-xl p-3.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-base">{icon}</span>
              <span className="text-xs text-gray-500 font-medium">{label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 leading-none">
              {score.toFixed(1)}
              <span className="text-xs font-normal text-gray-400"> / 5</span>
            </p>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
