const ITEMS = [
  {
    label: '콘센트',
    icon: '🔌',
    key: 'outletScoreAvg',
    desc: (s: number) =>
      s >= 4
        ? '모든 좌석마다 콘센트가 있어요.'
        : s >= 3
          ? '콘센트가 있지만 자리를 잘 골라야 해요.'
          : s >= 2
            ? '콘센트가 많지 않아요.'
            : '콘센트 이용이 어려울 수 있어요.',
  },
  {
    label: '와이파이',
    icon: '📶',
    key: 'wifiScoreAvg',
    desc: (s: number) =>
      s >= 4
        ? '빠르고 안정적인 와이파이를 제공해요.'
        : s >= 3
          ? '와이파이 연결이 가능해요.'
          : s >= 2
            ? '와이파이가 불안정할 수 있어요.'
            : '와이파이 이용이 어려울 수 있어요.',
  },
  {
    label: '넓은 좌석',
    icon: '🪑',
    key: 'seatScoreAvg',
    desc: (s: number) =>
      s >= 4
        ? '카페가 넓고 쾌적한 공간이 충분해요.'
        : s >= 3
          ? '좌석이 적당히 여유 있어요.'
          : s >= 2
            ? '좌석이 다소 좁거나 적을 수 있어요.'
            : '오래 머무르기에 적절하지 않을 수 있어요.',
  },

  {
    label: '소음',
    icon: '🤫',
    key: 'noiseScoreAvg',
    desc: (s: number) =>
      s >= 4
        ? '집중하기 좋은 조용한 분위기예요.'
        : s >= 3
          ? '비교적 조용한 편이에요.'
          : s >= 2
            ? '다소 소란스러울 수 있어요.'
            : '소음이 많아 집중하기 어려울 수 있어요.',
  },

  {
    label: '화장실',
    icon: '🚻',
    key: 'toiletScoreAvg',
    desc: (s: number) =>
      s >= 4
        ? '깨끗하고 쾌적한 화장실이 내부에 있어요.'
        : s >= 3
          ? '화장실이 잘 관리되고 있어요.'
          : s >= 2
            ? '화장실 상태가 평범한 편이에요.'
            : '화장실 이용 시 불편할 수 있어요.',
  },
] as const;

interface Props {
  scores: Record<string, number>;
}

export default function CafeScoreCards({ scores }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ITEMS.map(({ label, icon, key, desc }) => {
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
            <p className="text-xs text-gray-400 leading-snug">{desc(score)}</p>
          </div>
        );
      })}
    </div>
  );
}
