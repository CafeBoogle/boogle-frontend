// src/components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>로딩 중...</div>;

  // 1. 아예 로그인 안 된 경우
  if (!user || !user.id) {
    return <Navigate to="/loginpage" replace state={{ from: location }} />;
  }

  // 2. 닉네임이 없는 경우 (추가 정보 입력 필요)
  // ProtectedRoute로 감싸진 페이지(마이페이지 등)에 접근할 때만 작동함
  if (!user.nickname) {
    return <Navigate to="/signup" replace />;
  }

  return <>{children}</>;
}
