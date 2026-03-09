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
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Boogle 로그인</h2>

      <div style={{ marginBottom: '15px' }}>
        <KakaoLoginButton />
      </div>

      <NaverLoginButton />
    </div>
  );
}

export default LoginPage;
