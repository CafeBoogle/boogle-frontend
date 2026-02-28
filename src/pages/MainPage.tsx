import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Logo from "@/assets/images/mainLogo.png";
import GuidelineModal from "@/components/modals/GuidelineModal";

export default function MainPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  
   {/* 로직 추가필요 */}
  const isLoggedIn = true;

  return (
    <>
      {open && <GuidelineModal onClose={() => setOpen(false)} />}
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-10 pb-10">
        <div className="mt-50 mb-8 transform transition-transform hover:rotate-3">
          <img src={Logo} alt="Boogle 로고"  className="w-44 drop-shadow-md"  />
        </div>

        <h1 className="text-5xl font-extrabold text-[#4A3A2E] tracking-tight mt-5 mb-6">
          Boogle
        </h1>

        <div className="text-center">
          <p className="text-lg text-[#6D5D50] font-medium leading-relaxed">
            신촌 및 홍대 지역 대학생을 위한 <br />
            <span className="text-[#3b3125] font-bold text-xl">맞춤형 카페 추천</span> 서비스
          </p>
        </div>

        {/* 4. 버튼 섹션: 아래쪽에 배치하여 시각적 여유 제공 */}
        <div className="w-full max-w-[320px] mt-15">
          <Button 
            size="large" 
            onClick={() => navigate(isLoggedIn ? "/category" : "/loginpage")}
            className="w-full text-xl shadow-lg shadow-brown-200/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {isLoggedIn ? "오늘의 공간 찾기" : "로그인하기"}
          </Button>
        </div>
      </div>
    </>
  );
}