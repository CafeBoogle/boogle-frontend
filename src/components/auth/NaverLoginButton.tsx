
declare global {
  interface Window {
    naver: any;
  }
}

const redirectUrl = window.location.origin;
const NAVER_AUTH_URL = `https://www.api.moonsunpower.com/boogle/api/oauth/naver?redirect=${redirectUrl}`
//const NAVER_AUTH_URL = `http://localhost:8080/boogle/api/oauth/naver?redirect=${redirectUrl}`
function NaverLoginButton() {
  // 이거 백엔드에서 code랑 status를 받고 쿠키에 저장해야해서 리다이렉트형식으로 변경함.
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
