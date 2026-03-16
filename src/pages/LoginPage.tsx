import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import NaverLoginButton from '@/components/auth/NaverLoginButton';
import KakaoLoginButton from '@/components/auth/KakaoLoginButton';

function LoginPage() {
  const { user, loading } = useAuth();

  console.log('현재 로그인 상태 체크 중:', { user, loading });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>인증 확인 중...</p>
      </div>
    );
  }

  if (user && user.id) {
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
