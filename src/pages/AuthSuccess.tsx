// 경로: src/pages/AuthSuccess.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const run = async () => {
      // ✅ 토큰 먼저 저장
      const token = searchParams.get('access_token');
      if (token) {
        localStorage.setItem('accessToken', token);
        window.history.replaceState({}, '', window.location.pathname);
      }

      const isNewUser = searchParams.get('isNewUser');

      if (isNewUser === 'true') {
        navigate('/signup', { replace: true });
      } else if (isNewUser === 'false') {
        const user = await checkAuth();
        alert(`${user?.nickname ?? ''} 님 로그인 완료!`);
        navigate('/', { replace: true });
      } else {
        navigate('/loginpage', { replace: true });
      }
    };
    run();
  }, [searchParams, navigate, checkAuth]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <h2>로그인 처리 중입니다. 잠시만 기다려주세요...</h2>
    </div>
  );
}

export default AuthSuccess;
