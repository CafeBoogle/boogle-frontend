import kakaoLoginImg from '@/assets/images/login/kakao_login_medium_wide.png';

const KAKAO_REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;

const KakaoLoginButton = () => {
  const onLogin = () => {
    const redirect = window.location.origin;
    const encodedState = btoa(redirect);

    // origin 체크 후 해당 origin으로 redirect
    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${KAKAO_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(KAKAO_REDIRECT_URI)}` +
      `&response_type=code` +
      `&state=${encodedState}`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <button
      type="button"
      onClick={onLogin}
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

export default KakaoLoginButton;
