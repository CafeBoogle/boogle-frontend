// src/components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>;

  // 1. 아예 로그인 안 된 경우
  if (!user) {
    return <Navigate to="/loginpage" replace />;
  }

  // 2. 카카오 인증은 했지만 닉네임이 없는 경우 (추가 정보 입력 필요)
  if (user && !user.nickname) {
    // 현재 페이지가 이미 /signup이면 무한 루프 도니까 방지
    if (window.location.pathname !== '/signup') {
      return <Navigate to="/signup" replace />;
    }
  }

  return <>{children}</>;
}