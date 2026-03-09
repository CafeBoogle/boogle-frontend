import { useEffect } from 'react';

declare global {
  interface Window {
    naver: any;
  }
}

function NaverLoginButton() {
  useEffect(() => {
    if (window.naver) {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: 'Hp3wT4d6Ecem36NtFuCc',
        callbackUrl: 'http://localhost:8080/api/oauth/naver/callback',
        isPopup: false,
        loginButton: { color: 'green', type: 3, height: 50 },
      });

      naverLogin.init();
    }
  }, []);

  return <div id="naverIdLogin"></div>;
}

export default NaverLoginButton;
