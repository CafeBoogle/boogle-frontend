import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';

interface User {
  id: number;
  nickname: string | null; // 닉네임이 없으면 null (추가정보 입력 대상)
  role: string;
  provider: 'kakao' |'naver';
}

interface AuthContextValue {
  user: User | null;
  loading: boolean; // 🚨 로딩 상태 추가 (인증 확인 전까지 화면 렌더링 방지)
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>; // 필요 시 수동 업데이트용
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 처음엔 로딩 중

  // 서버에 내 정보 물어보기
  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get('/api/user/me');
      setUser(res.data); // 로그인 성공 시 유저 정보 세팅
    } catch (err) {
      setUser(null); // 실패(401 등) 시 비로그인 처리
    } finally {
      setLoading(false); // 확인 끝났으니 로딩 해제
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (user: User) => setUser(user);

  const logout = async () => {
    if (!user) return; // 로그인 안 되어 있으면 ㄴㄴ
  try {
    // 1. (선택사항) 우리 서버에 로그아웃 알림 (쿠키 삭제는 백엔드 redirect 시 수행되므로 생략 가능하나 안전상 호출)
    // await axiosInstance.post('/api/user/logout'); 

    // 2. 백엔드에 새로 만들 카카오 로그아웃 엔드포인트로 브라우저 이동
    // 이렇게 하면 [백엔드 로직] -> [카카오 로그아웃 주소] -> [카카오 세션 종료] -> [우리 서비스 복귀]가 한 번에 일어납니다.
    const logoutUrl = user.provider === 'kakao' 
      ? "http://43.200.174.78:8080/api/oauth/kakao/logout" 
      : "http://localhost:8080/api/oauth/naver/logout";
      window.location.href = logoutUrl;
    
    // 상태 초기화
    setUser(null);
  } catch (err) {
    console.error("로그아웃 과정 중 오류 발생", err);
  }
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {/* 🚨 로딩 중에는 앱을 보여주지 않거나 스피너를 보여줌 */}
      {!loading ? children : <div>인증 확인 중...</div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
