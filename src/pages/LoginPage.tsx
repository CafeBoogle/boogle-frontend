import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import KakaoLoginButton from '@/components/auth/KakaoLoginButton';
import NaverLoginButton from '@/components/auth/NaverLoginButton';

function LoginPage() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-6">
      <h2 className="text-2xl font-bold mb-8 text-brown-4">Boogle 로그인</h2>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <KakaoLoginButton />
        <NaverLoginButton />
      </div>
    </div>
  );
}

export default LoginPage;
