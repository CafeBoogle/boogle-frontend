// pages/LoginPage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import kakaoLogin from "@/assets/images/Login/kakaoLogin.svg";
import naverLogin from "@/assets/images/Login/naverLogin.svg";
import Button from '@/components/common/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ name: '최환' });
    navigate('/mainpage');
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-32">
      <h1 className="text-4xl font-bold mb-20">로그인 하기</h1>
  
      <div className="flex flex-col gap-4">
        <button onClick={handleLogin}>
          <img src={kakaoLogin} alt="카카오 로그인" className="w-[320px]" />
        </button>
  
        <button onClick={handleLogin}>
          <img src={naverLogin} alt="네이버 로그인" className="w-[320px]" />
        </button>
      </div>
    </div>
  );
  
}
