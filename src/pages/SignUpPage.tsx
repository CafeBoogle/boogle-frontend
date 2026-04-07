import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '@/api/axios';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import sogangCat from '@/assets/images/SignUp/sogangCat.png';
import yonseiCat from '@/assets/images/SignUp/yonseiCat.png';
import hongikCat from '@/assets/images/SignUp/hongikCat.png';
import ewhaCat from '@/assets/images/SignUp/ewhaCat.png';

const cats = [
  { id: 'SG', src: sogangCat, alt: '서강대' },
  { id: 'Y', src: yonseiCat, alt: '연세대' },
  { id: 'H', src: hongikCat, alt: '홍익대' },
  { id: 'E', src: ewhaCat, alt: '이화여대' },
];

export default function SignUpPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [nickname, setNickname] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuth } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const provider = queryParams.get('provider');
  const providerUserId = queryParams.get('userId');

  const handleSignUp = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요!');
      return;
    }

    if (!provider || !providerUserId) {
      alert('인증 정보가 만료되었습니다. 다시 로그인해주세요.');
      navigate('/loginpage');
      return;
    }

    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('provider', provider);
    formData.append('providerUserId', providerUserId);
    if (selected) formData.append('catType', selected);

    try {
      await axiosInstance.post('/api/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await checkAuth();
      navigate('/');
    } catch (err) {
      console.error('회원가입 요청 실패:', err);
      alert('가입에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col  px-12 pt-10 ">
    
      {/* 캐릭터 선택 */}
      <div className="w-full max-w-sm mb-12">
        <h1 className="text-2xl font-bold text-brown-4 mb-2">추가 정보를<br/>입력해주세요</h1>
        <p className="text-sm text-[#8C7A6B] mb-8">
          선택하지 않으면 기본 캐릭터로 설정됩니다 !
        </p>

        <div className="grid grid-cols-2 gap-6 mt-6">
          {cats.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`cursor-pointer transition-all duration-200 ${
                selected === cat.id ? 'scale-120' : 'scale-100 hover:scale-105'
              }`}
            >
              <img
                src={cat.src}
                alt={cat.alt}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 닉네임 입력 */}
      <div className="w-full max-w-sm mb-12">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full bg-transparent border-b-2 border-[#8C7A6B] py-2 outline-none text-center text-sm text-[#4A3A2E]"
          placeholder="Boogle에서 사용할 닉네임을 입력해주세요 (필수)"
        />
      </div>

      <Button size="full" variant="brown4" onClick={handleSignUp}>
        회원가입하기
      </Button>
    </div>
  );
}
