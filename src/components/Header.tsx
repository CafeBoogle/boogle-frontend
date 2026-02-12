import { useNavigate } from 'react-router-dom';
import mainLogo from '@/assets/images/mainLogo.png';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-14 px-4 flex items-center justify-between bg-[#EEE9E5]">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img src={mainLogo} alt="Boogle Logo" className="h-7" />
        <span className="text-lg font-bold tracking-tight">Boogle</span>
      </div>
      <div className="relative">
        {user ? (
          <div className="relative group">
            <span className="cursor-pointer text-sm font-medium">
              {user.name}님
            </span>

            <div
              className="
                absolute right-0 top-full
                pt-2
                w-32
                bg-white border rounded-md shadow-md
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
              "
            >
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => navigate('/mypage')}
              >
                마이페이지
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={logout}
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : (
          <button
            className="px-3 py-1 border border-gray-300 rounded-md bg-white text-sm"
            onClick={() => navigate('/loginpage')}
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
}
