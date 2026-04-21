interface GuidelineModalProps {
  onClose: () => void;
  onDismissToday: () => void;
}

function GuidelineModal({ onClose, onDismissToday }: GuidelineModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="scrollbar-hide w-[90%] max-h-[80vh] overflow-y-auto rounded-2xl bg-white px-6 pt-10 pb-8 border shadow-xl">
        {/* Title */}
        <h2 className="mb-6 text-center text-xl font-semibold text-brown- leading-snug break-keep">
          행복한 카페 문화를 만들기 위한 <br />
          <span className="font-bold">Boogle 가이드라인</span>
        </h2>

        {/* Content */}
        <ol className="list-decimal pl-5 space-y-4 text-sm break-keep">
          <li>
            <p className="font-semibold text-gray-900">
              작업하기 좋은 카페를 발견하는 여정을 돕는 서비스예요.
            </p>
            <p className="mt-2 leading-relaxed text-gray-600">
              당신의 하루에 꼭 맞는 공간을 더 쉽게 찾을 수 있도록 만들었습니다.
            </p>
          </li>

          <li>
            <p className="font-semibold text-gray-900">
              카페에서의 예의 있는 작업 문화를 소중히 생각합니다.
            </p>
            <p className="mt-2 leading-relaxed text-gray-600">
              카공을 강요하거나 무례한 사용을 조장하지 않으며, 각 공간을 존중하는 마음으로 Boogle을
              이용해주세요.
            </p>
          </li>

          <li>
            <p className="font-semibold text-gray-900">
              카페가 자신의 정보를 숨기고 싶다면 언제든 존중합니다.
            </p>
            <p className="mt-2 leading-relaxed text-gray-600">
              노출을 원하지 않는 매장은 편하게 연락 주세요. 빠르게 조치하겠습니다.
            </p>
          </li>

          <li>
            <p className="font-semibold text-gray-900">
              잘못된 정보나 수정이 필요한 내용이 있다면 알려주세요.
            </p>
            <p className="mt-2 leading-relaxed text-gray-600">
              Boogle은 사용자와 함께 만드는 서비스이기에, 여러분의 제보는 큰 힘이 됩니다.
            </p>
          </li>

          <li>
            <p className="font-semibold text-gray-900">
              모두가 편안하게 머무를 수 있는 카페 문화를 만들고 싶어요.
            </p>
            <p className="mt-2 leading-relaxed text-gray-600">
              작은 배려와 정확한 정보 공유가 더 따뜻한 카페 찾기 경험을 완성합니다.
            </p>
          </li>
        </ol>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between text-xs text-gray-400">
          <button onClick={onDismissToday} className="hover:underline cursor-pointer">
            오늘 하루 보지 않음
          </button>
          <button onClick={onClose} className="text-lg text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuidelineModal;
