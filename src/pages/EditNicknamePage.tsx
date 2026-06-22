import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/api/axios';
import { useAuth } from '@/contexts/AuthContext';
import { TextInput } from '@/components/common/TextInput';
import Button from '@/components/common/Button';

export default function EditNicknamePage() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuth();
  const [nickname, setNickname] = useState(user?.nickname ?? '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (nickname.trim() === user?.nickname) {
      navigate('/mypage');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/user/setup-nickname', {
        userId: user!.id,
        nickname: nickname.trim(),
      });
      await checkAuth();
      navigate('/mypage');
    } catch (e) {
      console.error('닉네임 변경 실패:', e);
      alert('닉네임 변경에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="px-5 pt-6 pb-2 flex items-center gap-3">
        <button
          onClick={() => navigate('/mypage')}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B4F3A] text-2xl font-bold hover:bg-[#F1E7E1] transition"
        >
          ←
        </button>

        <h1 className="text-lg font-semibold text-gray-900">닉네임 변경하기</h1>
      </div>

      <div className="px-6 pt-5">
        <div className="rounded-3xl bg-white px-5 py-6 shadow-sm border border-[#EFE7E2]">
          <p className="text-sm font-semibold text-[#6B4F3A] mb-2">새 닉네임</p>

          <TextInput
            placeholder="변경할 닉네임을 입력해주세요"
            value={nickname}
            onChange={setNickname}
          />

          <p className="mt-3 text-xs text-gray-400">다른 사용자에게 보여질 이름이에요.</p>
        </div>

        <Button
          variant="brown4"
          size="full"
          onClick={handleSubmit}
          disabled={loading || !nickname.trim()}
          className="mt-8 h-14 rounded-2xl text-base font-bold shadow-md"
        >
          {loading ? '변경 중...' : '닉네임 변경하기'}
        </Button>
      </div>
    </div>
  );
}
