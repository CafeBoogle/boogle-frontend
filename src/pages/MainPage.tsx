import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Logo from '@/assets/images/mainLogo.png';
import GuidelineModal from '@/components/modals/GuidelineModal';
import { useAuth } from '@/contexts/AuthContext';

export default function MainPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

useEffect(() => {
  const dismissed = localStorage.getItem('hide-guideline-date');
  const today = new Date().toISOString().slice(0, 10);
  if (dismissed !== today) {
    setOpen(true);
  }
}, []);

const handleDismissToday = () => {
  const today = new Date().toISOString().slice(0, 10);
  localStorage.setItem('hide-guideline-date', today);
  setOpen(false);
};


  const { user } = useAuth();


  return (
    <>
      {open && <GuidelineModal onClose={() => setOpen(false)} onDismissToday={handleDismissToday} />}
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-10 pb-10">
        <div className="mt-10 mb-8 transform transition-transform hover:rotate-3">
          <img src={Logo} alt="Boogle 로고" className="w-44 drop-shadow-md" />
        </div>

        <h1 className="text-5xl font-extrabold text-[#4A3A2E] tracking-tight mt-5 mb-6">Boogle</h1>

        <div className="text-center">
          <p className="text-lg text-[#6D5D50] font-medium leading-relaxed">
            신촌 및 홍대 지역 대학생을 위한 <br />
            <span className="text-[#3b3125] font-bold text-xl">맞춤형 카페 추천</span> 서비스
          </p>
        </div>

        <div className="w-full max-w-[320px] mt-15 flex flex-col gap-3">
          <Button
            variant="brown4"
            size="full"
            onClick={() => navigate(user ? '/category' : '/loginpage')}
            className="text-lg"
          >
            {user ? '오늘의 공간 찾기' : '로그인하기'}
          </Button>
          <Button
            variant="brown4"
            size="full"
            onClick={() => navigate('/mypage')}
            className="text-lg"
          >
            마이페이지
          </Button>
        </div>
      </div>
    </>
  );
}
