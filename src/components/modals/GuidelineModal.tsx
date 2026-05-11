interface GuidelineModalProps {
  onClose: () => void;
  onDismissToday: () => void;
}

function GuidelineModal({ onClose, onDismissToday }: GuidelineModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="scrollbar-hide w-[88%] max-h-[80vh] overflow-y-auto rounded-2xl bg-white px-7 pt-8 pb-6 shadow-xl">

        {/* Title */}
        <div className="text-center mb-5">
          <p className="text-[10px] tracking-widest text-[#8B7368] uppercase mb-2">Guidelines</p>
          <h2 className="text-sm font-bold text-gray-900 leading-snug break-keep">
            더 따뜻한 카페 문화를 위한<br />Boogle 가이드라인
          </h2>
        </div>

        {/* 구분선 */}
        <div className="w-8 h-px bg-[#8B7368] mx-auto mb-5" />

        {/* 인트로 */}
        <p className="text-xs leading-relaxed text-gray-500 break-keep text-center mb-6">

          좋은 공간은 서로의 배려에서 시작되기에,<br />
          각 카페를 존중하는 마음으로 함께해주세요.
        </p>

        {/* 항목 */}
        <div className="flex flex-col gap-4">
          {[
            {
              num: '01',
              title: '모든 카페의 운영 방식과 공간의 가치를 존중합니다.',
              desc: '노출을 원하지 않는 매장은 편하게 연락주세요. 빠르게 조치하겠습니다.',
            },
            {
              num: '02',
              title: '더 정확한 정보를 위해 여러분의 목소리가 필요합니다.',
              desc: '잘못된 정보나 수정이 필요한 내용이 있다면 알려주세요.',
            },
          ].map(({ num, title, desc }) => (
            <div key={num} className="flex gap-3 items-start">
              <span className="text-[10px] font-bold text-[#8B7368] mt-0.5 shrink-0">{num}</span>
              <div>
                <p className="text-xs font-semibold text-gray-800 break-keep">{title}</p>
                <p className="text-[11px] leading-relaxed text-gray-400 mt-1 break-keep">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-7 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
          <button onClick={onDismissToday} className="hover:text-gray-600 transition-colors cursor-pointer">
            오늘 하루 보지 않음
          </button>
          <button onClick={onClose} className="hover:text-gray-600 transition-colors">
            닫기
          </button>
        </div>

      </div>
    </div>
  );
}

export default GuidelineModal;
