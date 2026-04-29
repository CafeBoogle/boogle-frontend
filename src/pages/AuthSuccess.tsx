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
      const isNewUser = searchParams.get('isNewUser');

      if (isNewUser === 'true') {
        alert('회원가입이 완료되었습니다! 추가 정보를 입력해주세요.');
        navigate('/signup', { replace: true });
      } else if (isNewUser === 'false') {
        const user = await checkAuth();
        alert(`${user?.nickname ?? ''} 님 로그인 완료!`);
        navigate('/category', { replace: true });
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
