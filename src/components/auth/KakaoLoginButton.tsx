const KAKAO_CLIENT_ID = 'b6638b255ebf5d503bd755eb7d27aac3';
const KAKAO_REDIRECT_URI = 'http://localhost:8080/api/oauth/kakao/callback';

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

function KakaoLoginButton() {
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <button
      onClick={handleKakaoLogin}
      style={{
        backgroundColor: '#FEE500',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
        fontWeight: 'bold',
      }}
    >
      카카오로 로그인하기
    </button>
  );
}

export default KakaoLoginButton;
