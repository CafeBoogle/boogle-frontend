import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/common/Button";
import Logo from "@/assets/images/mainLogo.png";
import GuidelineModal from "@/components/modals/GuidelineModal";

export default function MainPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  return (
    <>
      {open && <GuidelineModal onClose={() => setOpen(false)} />}

      <div className="min-h-screen bg-[#EEE9E5] flex flex-col items-center justify-center px-6 py-12">
        <img src={Logo} alt="Boogle 로고" className="w-40 mb-6" />

        <h1 className="text-4xl font-bold text-center mb-6">Boogle</h1>

        <p className="text-m text-center leading-relaxed mb-10">
          신촌 및 홍대 지역 대학생을 위한 <br />
          맞춤형 카페 추천 서비스
        </p>
        <Button size = "large" onClick={() => navigate("/category")}>
         로그인하기
        </Button>
      </div>
    </>
  );
}
