import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

declare global {
  interface Window {
    naver: any;
  }
}

// 1. 카카오 설정 (보내주신 값 적용)
const KAKAO_CLIENT_ID = 'b6638b255ebf5d503bd755eb7d27aac3';
const KAKAO_REDIRECT_URI = 'http://localhost:8080/api/oauth/kakao/callback';
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

function LoginPage() {
  const { user } = useAuth();

  useEffect(() => {
    // 2. 네이버 SDK 초기화 (보내주신 Hp3w... ID 적용)
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: 'Hp3wT4d6Ecem36NtFuCc', // 👈 여기 정확히 들어갔는지 확인!
        callbackUrl: 'http://localhost:8080/api/oauth/naver/callback',
        isPopup: false,
        loginButton: { color: 'green', type: 3, height: 50 },
      });
      naverLogin.init();
    }
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h2>Boogle 로그인</h2>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={handleKakaoLogin}
          style={{
            backgroundColor: '#FEE500',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '222px',
            fontWeight: 'bold',
          }}
        >
          카카오로 로그인하기
        </button>
      </div>

      {/* 네이버 버튼이 생성되는 곳 */}
      <div id="naverIdLogin" style={{ display: 'inline-block' }}></div>
    </div>
  );
}

export default LoginPage;
