import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';

interface User {
  id: number;
  nickname: string | null; // 닉네임이 없으면 null (추가정보 입력 대상)
  role: string;
  provider: 'kakao' | 'naver';
  profileImageUrl: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean; // 🚨 로딩 상태 추가 (인증 확인 전까지 화면 렌더링 방지)
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<User | null>; // 필요 시 수동 업데이트용
  profileImageUrl: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 처음엔 로딩 중

  // 서버에 내 정보 물어보기
  const checkAuth = async (): Promise<User | null> => {
    try {
      const res = await axiosInstance.get('/api/user/me');
      setUser(res.data);
      return res.data;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (user: User) => setUser(user);

  const logout = async () => {
    if (!user) return;
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://www.api.moonsunpower.com/boogle';

    const provider = user.provider.toLowerCase();
    const logoutUrl = `${baseUrl}/api/oauth/${provider}/logout?redirect=${encodeURIComponent(window.location.origin)}`;

    window.location.href = logoutUrl;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth, profileImageUrl: user?.profileImageUrl ?? null }}>
      {!loading ? children : <div>인증 확인 중...</div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
