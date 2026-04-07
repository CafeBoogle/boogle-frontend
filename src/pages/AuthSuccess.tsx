// 경로: src/pages/AuthSuccess.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const isNewUser = searchParams.get('isNewUser');

    if (isNewUser === 'true') {
      alert('회원가입이 완료되었습니다! 추가 정보를 입력해주세요.');
      navigate('/signup', { replace: true });
    } else if (isNewUser === 'false') {
      alert('로그인 되었습니다.');
      navigate('/category', { replace: true });
    } else {
      navigate('/loginpage', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <h2>로그인 처리 중입니다. 잠시만 기다려주세요...</h2>
    </div>
  );
}

export default AuthSuccess;
