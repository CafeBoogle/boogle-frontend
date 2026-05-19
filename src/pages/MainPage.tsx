import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/images/boogleLogo.png';
import GuidelineModal from '@/components/modals/GuidelineModal';
import Button from '@/components/common/Button';

const FEATURES = ['조용한 공간', '콘센트 완비', '넉넉한 좌석'];

export default function MainPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const user = true;

  useEffect(() => {
    const dismissed = localStorage.getItem('hide-guideline-date');
    const today = new Date().toISOString().slice(0, 10);
    if (dismissed !== today) setOpen(true);
    setTimeout(() => setVisible(true), 80);
  }, []);

  const handleDismissToday = () => {
    localStorage.setItem('hide-guideline-date', new Date().toISOString().slice(0, 10));
    setOpen(false);
  };

  return (
    <>
      {open && (
        <GuidelineModal onClose={() => setOpen(false)} onDismissToday={handleDismissToday} />
      )}

      {/* 배경 */}
      <div className="relative min-h-[calc(100vh-64px)] overflow-hidden">
        {/* 메인 콘텐츠 */}
        <div
          className="relative flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-8 pb-12 pt-6"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* 상단 레이블 */}
          <div className="mb-4 flex items-center gap-2">
            <div className="h-px w-6 bg-[#8B7368]" />
            <span className="text-[11px] tracking-[0.2em] text-[#8B7368] uppercase font-medium">
              Sinchon · Hongdae
            </span>
            <div className="h-px w-6 bg-[#8B7368]" />
          </div>

          {/* 로고 */}
          <div style={{ animation: 'float 4s ease-in-out infinite' }}>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#C4A882]/20 blur-xl scale-110" />
              <img src={Logo} alt="Boogle 로고" className="relative w-full drop-shadow-lg" />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#8B7368]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#8B7368]" />
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#8B7368]" />
          </div>

          <p className="text-center text-[15px] text-[#6B5A4E] leading-relaxed mb-2">
            신촌·홍대 대학생을 위한
          </p>
          <p className="text-center text-[18px] font-bold text-[#3B2F2F] mb-8">
            맞춤형 카페 큐레이션 서비스
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-[300px]">
            {FEATURES.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-[11px] font-medium text-[#7A6055] bg-white border border-[#D9C4B0] shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="w-full max-w-[300px] flex flex-col gap-3">
            <Button
              variant="brown4"
              size="full"
              onClick={() => navigate(user ? '/category' : '/loginpage')}
              className="text-[15px] font-bold tracking-wide shadow-lg"
            >
              {user ? '오늘의 공간 찾기' : '로그인하기'}
            </Button>

            <Button
              variant="brown1"
              size="full"
              textColor="brown"
              onClick={() => navigate('/addreview')}
              className="text-[15px]"
            >
              리뷰 등록하기
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
}
