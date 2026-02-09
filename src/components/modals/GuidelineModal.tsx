interface GuidelineModalProps {
  onClose: () => void;
}

function GuidelineModal({ onClose }: GuidelineModalProps) {
  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/30 "> 
      <div className="max-w-[60vh] max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-8 leading-relaxed border shadow-xl
">


        <h2 className="mt-2 mb-8 text-center text-2xl font-semibold text-brown-4 leading-relaxed">
          <strong>행복한 카페 문화</strong> 를 만들기 위한 <br />
          <strong>Boogle</strong> 가이드라인
        </h2>

        <ol className="list-decimal space-y-4 pl-5 text-sm leading-normal tracking-normal">
          <li>
            <strong>Boogle은 ‘작업하기 좋은 카페’를 발견하는 여정을 돕는 서비스예요.</strong> <br />
            당신의 하루에 꼭 맞는 공간을 더 쉽게 찾을 수 있도록 만들었습니다.
          </li>

          <li>
            <strong>우리는 카페에서의 ‘예의 있는 작업 문화’를 소중히 생각합니다.</strong>
            <br />
            카공을 강요하거나 무례한 사용을 조장하지 않으며, 각 공간을 존중하는 마음으로 Boogle을 이용해주세요. 
          </li>

          <li>
            <strong>카페가 자신의 정보를 숨기고 싶다면 Boogle은 언제든 존중합니다.</strong>
            <br />
            노출을 원치 않는 매장은 편하게 연락 주세요. 빠르게 조치하겠습니다.
          </li>

          <li>
            <strong>혹시 잘못된 정보나 수정이 필요한 내용이 발견되면 바로 알려주세요.</strong>
            <br />
            Boogle은 사용자와 함께 만드는 서비스이기에, 여러분의 제보는 큰 힘이 됩니다.
          </li>

          <li>
            <strong>모두가 편안하게 머무를 수 있는 카페 문화를 함께 만들어가고 싶어요.</strong>
            <br />
            작은 배려와 정확한 정보 공유가 더 따뜻한 '카페 찾기 경험'을 완성합니다.
          </li>
        </ol>

        <div className="mt-10 flex items-center justify-between text-xs text-gray-500">
          <button className="hover:underline cursor-pointer">
            오늘 하루 보지 않음
          </button>
          <button onClick={onClose} className="text-lg hover:underline cursor-pointer">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuidelineModal;
