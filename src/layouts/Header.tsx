import { useNavigate } from 'react-router-dom';
import mainLogo from '@/assets/images/mainLogo.png';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-14 px-4 flex items-center justify-between bg-[#EEE9E5] mt-2">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src={mainLogo} alt="Boogle Logo" className="h-7 ml-3" />
        <span className="text-lg font-bold text-[#30251c]">Boogle</span>
      </div>
      <div className="relative">
        {user ? (
          <div className="relative group">
            <span className="cursor-pointer text-l mr-5 font-semibold text-[#30251c]">
              {user.nickname} 님
            </span>
            <div
              className=" absolute right-0 top-full mt-2 w-36 bg-[#FDFCFB]  border border-[#E5DED8] 
                rounded-xl shadow-xl shadow-brown-200/20 
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible /* Tailwind CSS의 group 기능 사용 - 부모에 hover시 자식 요소 나타나도록 (opacity 0에서 100)*/
                transition-all duration-200"
            >
              <button
                className="block w-full px-4 py-3 text-left text-sm text-[#4A3A2E] hover:bg-[#F2EDE9] rounded-t-xl transition-colors"
                onClick={() => navigate('/mypage')}
              >
                마이페이지
              </button>
              <button
                className="block w-full px-4 py-3 text-left text-sm text-[#A68966] hover:bg-[#F2EDE9] rounded-b-xl transition-colors font-medium"
                onClick={logout}
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <button
            className="px-5 py-2  text-black text-sm font-bold rounded-full hover:bg-[#8E7455] hover:text-white transition-all"
            onClick={() => navigate('/loginpage')}
          >
            로그인
          </button>
        )}
        </div>
    </header>
  );
}
