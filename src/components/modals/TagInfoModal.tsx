interface TagInfoModalProps {
  onClose: () => void;
}

const TAG_DESCRIPTIONS = [
  {
    label: '카공 적합도',
    emoji: '⭐',
    desc: '카페에서 공부하기 얼마나 적합한지 종합적으로 평가한 점수예요. 콘센트, 와이파이, 소음, 좌석 등을 모두 고려해요.',
  },
  {
    label: '콘센트',
    emoji: '🔌',
    desc: '좌석마다 콘센트가 얼마나 잘 갖춰져 있는지를 나타내요. 노트북 작업이 많다면 꼭 확인하세요.',
  },
  {
    label: '와이파이',
    emoji: '📶',
    desc: '와이파이 속도와 안정성에 대한 평가예요. 빠르고 끊기지 않는 와이파이가 있는 카페를 찾을 수 있어요.',
  },
  {
    label: '넓은 카페',
    emoji: '🪑',
    desc: '좌석이 넉넉하고 공간이 넓어 오래 앉아 있기 좋은 카페예요.',
  },
  {
    label: '조용한 카페',
    emoji: '🤫',
    desc: '음악 소리나 대화 소리가 적어 집중하기 좋은 카페예요. 공부나 작업에 집중이 필요할 때 추천해요.',
  },
  {
    label: '쾌적한 화장실',
    emoji: '🚿',
    desc: '화장실이 깨끗하고 관리가 잘 되어 있는 카페예요. 장시간 머물 때 중요한 요소예요.',
  },
];

export default function TagInfoModal({ onClose }: TagInfoModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[88%] max-h-[80vh] overflow-y-auto rounded-2xl bg-white px-7 pt-8 pb-6 shadow-xl scrollbar-hide">
        <div className="text-center mb-5">
          <p className="text-[10px] tracking-widest text-[#8B7368] uppercase mb-2">Filter Guide</p>
          <h2 className="text-sm font-bold text-gray-900 leading-snug">필터 태그 설명</h2>
        </div>

        <div className="w-8 h-px bg-[#8B7368] mx-auto mb-5" />

        <div className="bg-[#F7F2ED] rounded-xl px-4 py-3 mb-5 flex flex-col gap-1.5">
          <p className="text-[11px] text-[#8B7368] leading-relaxed break-keep">
            📍 기본 정렬은 <span className="font-semibold">거리순</span>이에요.
          </p>
          <p className="text-[11px] text-[#8B7368] leading-relaxed break-keep">
            ✅ 태그를 선택하면 해당 항목 <span className="font-semibold">3.5점 이상</span>인 카페만
            보여요.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {TAG_DESCRIPTIONS.map(({ label, emoji, desc }) => (
            <div key={label} className="flex gap-3 items-start">
              <span className="text-base shrink-0">{emoji}</span>
              <div>
                <p className="text-xs font-semibold text-gray-800">{label}</p>
                <p className="text-[11px] leading-relaxed text-gray-400 mt-1 break-keep">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[11px] text-gray-400 break-keep">
            잘못된 정보가 있다면 인스타그램{' '}
            <span className="font-semibold text-[#8B7368]">@cafe_boogle</span>로 알려주세요
          </p>
          <button
            onClick={onClose}
            className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors shrink-0 ml-3"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
