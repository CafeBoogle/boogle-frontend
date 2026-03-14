import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import NaverLoginButton from '@/components/auth/NaverLoginButton';
import KakaoLoginButton from '@/components/auth/KakaoLoginButton';
declare global {
  interface Window {
    naver: any;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const NAVER_CLIENT_ID = import.meta.env.VITE_NAVER_CLIENT_ID;

const KAKAO_REDIRECT_URI = `${API_BASE_URL}/api/oauth/kakao/callback`;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

function LoginPage() {
  const { user } = useAuth();

  useEffect(() => {
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: NAVER_CLIENT_ID,
        callbackUrl: `${API_BASE_URL}/api/oauth/naver/callback`,
        isPopup: false,
        loginButton: { color: 'green', type: 3, height: 50 },
      });
      naverLogin.init();
    }
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex flex-col items-center justify-center mt-30 px-6">
      <h2 className="text-3xl font-bold mb-10 text-brown-4">로그인하기</h2>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <KakaoLoginButton />
        <NaverLoginButton />
      </div>
    </div>
  );
}

export default LoginPage;
