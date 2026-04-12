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
    <div className="flex flex-col items-center justify-center mt-20 px-10">
      <div className="mb-12 text-left w-full max-w-xs">
        <h1 className="text-2xl font-bold text-[#4A3A2E] leading-snug mb-2">
          더 나은 경험을 위해
          <br />
          먼저 로그인해주세요 :)
        </h1>
        <p className="text-sm text-[#6D5D50]">지금은 카카오·네이버로 빠르게 시작할 수 있어요.</p>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <KakaoLoginButton />
        <NaverLoginButton />
      </div>
    </div>
  );
}

export default LoginPage;
