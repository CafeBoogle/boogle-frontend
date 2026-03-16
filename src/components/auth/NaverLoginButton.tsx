import { useEffect } from 'react';

declare global {
  interface Window {
    naver: any;
  }
}
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

  const handleNaverLogin = () => {
    const hiddenButton = document.getElementById('naverIdLogin')
      ?.firstElementChild as HTMLElement | null;

    hiddenButton?.click();
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
