import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/api/axios';
import { resolveProfileImage } from '@/constants/catImages';

interface User {
  id: number;
  nickname: string | null;
  role: string;
  provider: 'kakao' | 'naver';
  profileImageName: string | null;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<User | null>;
  profileImageUrl: string;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const login = async () => {
    await checkAuth();
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/user/logout'); // ✅ refresh 쿠키 삭제
    } catch (e) {
      console.error('로그아웃 API 실패', e);
    } finally {
      localStorage.removeItem('accessToken'); // ✅ 핵심

      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkAuth,
        profileImageUrl: resolveProfileImage(user?.profileImageName ?? null),
      }}
    >
      {!loading ? children : <div>인증 확인 중...</div>}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
