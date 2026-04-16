// pages/MyPage.tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';

function MyPage() {
  const navigate = useNavigate();
  const user = true;
  //const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">마이페이지</h1>
      {/* <p>이름: {user?.nickname}</p> */}
      <Button
        onClick={() => navigate('/addreview')}
      >
        + 간편 리뷰 등록하기 +
      </Button>
    </div>
  );
}

export default MyPage;
