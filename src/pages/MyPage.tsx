// pages/MyPage.tsx
import { useAuth } from '@/contexts/AuthContext';

function MyPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">마이페이지</h1>
      <p>이름: {user?.nickname}</p>
    </div>
  );
}

export default MyPage;
