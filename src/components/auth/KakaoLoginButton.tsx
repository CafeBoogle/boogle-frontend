import kakaoLoginImg from '@/assets/images/login/kakao_login_medium_wide.png';

const KAKAO_CLIENT_ID = 'b6638b255ebf5d503bd755eb7d27aac3';
const KAKAO_REDIRECT_URI = 'http://localhost:8080/api/oauth/kakao/callback';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <button
      type="button"
      onClick={handleKakaoLogin}
      style={{
        padding: 0,
        border: 'none',
        borderRadius: 12,
        cursor: 'pointer',
        width: '100%',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <img
        src={kakaoLoginImg}
        alt="카카오 로그인"
        style={{ display: 'block', width: '100%', height: 'auto', verticalAlign: 'middle' }}
      />
    </button>
  );
}

export default KakaoLoginButton;
