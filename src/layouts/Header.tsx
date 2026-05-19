import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mainLogo from '@/assets/images/boogleLogosm.png';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

const dropdownBtnBase =
  'block w-full px-4 py-3 text-left text-sm hover:bg-[#F2EDE9] transition-colors';

export default function Header() {
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  return (
    <header className="h-14 px-6 flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EDE5DC]">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <img src={mainLogo} alt="Boogle Logo" className="h-8 block" />
        <span className="text-base font-bold mt-2 tracking-widest text-[#30251c] uppercase leading-none">
          Boogle
        </span>
      </div>

      <div className="relative">
        {user ? (
          <div ref={dropdownRef} className="relative">
            <span
              onClick={() => setOpen((p) => !p)}
              className="cursor-pointer text-sm font-semibold text-[#5C4A3A] px-3 py-1.5 rounded-full border border-transparent hover:border-[#D9C4B0] hover:bg-[#F7F2ED] transition-all duration-200"
            >
              {user.nickname} 님
            </span>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-[#FDFCFB] border border-[#E5DED8] rounded-xl shadow-lg z-50">
                <button
                  className={cn(dropdownBtnBase, 'rounded-t-xl text-[#4A3A2E]')}
                  onClick={() => navigate('/mypage')}
                >
                  마이페이지
                </button>

                <button
                  className={cn(dropdownBtnBase, 'rounded-b-xl text-[#A68966] font-medium')}
                  onClick={logout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="px-4 py-1.5 text-sm font-bold text-[#30251c] rounded-full border border-[#C4A882]"
            onClick={() => navigate('/loginpage')}
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
}
