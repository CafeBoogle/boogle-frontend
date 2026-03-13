import kakaoLoginImg from '@/assets/images/login/kakao_login_medium_wide.png';

const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

const handleKakaoLogin = () => {
  window.location.href = KAKAO_AUTH_URL;

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
};

export default handleKakaoLogin;
