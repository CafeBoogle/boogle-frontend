import { useEffect } from 'react';

declare global {
  interface Window {
    naver: any;
  }
}
<<<<<<< HEAD
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function NaverLoginButton() {
  useEffect(() => {
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: import.meta.env.VITE_NAVER_CLIENT_ID,
        callbackUrl: `${API_BASE_URL}/api/oauth/naver/callback`, // 하드코딩 제거!
        isPopup: false,
        loginButton: { color: 'green', type: 3, height: 50 },
      });

      naverLogin.init();
    }
  }, []);

=======

const NAVER_AUTH_URL = 'http://localhost:8080/api/oauth/naver'

function NaverLoginButton() {
  // 이거 백엔드에서 code랑 status를 받고 쿠키에 저장해야해서 리다이렉트형식으로 변경함.
>>>>>>> 3938ecc (지도추가, 카페 리스트, 찜하기 api 연결 (#39))
  const handleNaverLogin = () => {
    window.location.href = NAVER_AUTH_URL;
  };
  
  return (
    <>
      <button
        type="button"
        onClick={handleNaverLogin}
        style={{
          width: '100%',
          height: 50,
          backgroundColor: '#03A94D', // 네이버 지정 녹색
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
            fontWeight: 800,
            fontSize: 20,
            color: '#FFFFFF',
          }}
        >
          N
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          네이버 로그인
        </span>
      </button>

      <div id="naverIdLogin" style={{ display: 'none' }}></div>
    </>
  );
}

export default NaverLoginButton;
