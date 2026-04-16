import { useNavigate } from 'react-router-dom';
import mainLogo from '@/assets/images/mainLogo.png';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

const dropdownBtnBase =
  'block w-full px-4 py-3 text-left text-sm hover:bg-[#F2EDE9] transition-colors';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-14 px-4 flex items-center justify-between mt-2">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
        <img src={mainLogo} alt="Boogle Logo" className="h-7 ml-3" />
        <span className="text-lg font-bold text-[#30251c]">Boogle</span>
      </div>
      <div className="relative">
        {user ? (
          <div className="relative group">
            <span className="cursor-pointer text-base mr-5 font-semibold text-[#30251c]">
              {user.nickname} 님
            </span>
            <div className="absolute right-0 top-full mt-2 w-36 bg-[#FDFCFB] border border-[#E5DED8] rounded-xl shadow-xl shadow-brown-200/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
          </div>
        ) : (
          <button
            className="px-5 py-2 text-black text-base font-bold rounded-full hover:bg-[#8E7455] hover:text-white transition-all"
            onClick={() => navigate('/loginpage')}
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
}
