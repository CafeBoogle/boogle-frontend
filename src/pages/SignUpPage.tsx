import React, { useState, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가
import axiosInstance from '@/api/axios';
import { useAuth } from '@/contexts/AuthContext';

const SignUpPage: React.FC = () => {
  const [nickname, setNickname] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation(); // URL 정보를 가져옴
  const { checkAuth } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const provider = queryParams.get('provider'); // NAVER 또는 KAKAO
  const providerUserId = queryParams.get('userId');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        alert('파일이 너무 커요! 10MB 이하로 올려주세요.');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignUpSubmit = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    // provider 정보가 없으면 비정상적인 접근
    if (!provider || !providerUserId) {
      alert('인증 정보가 만료되었습니다. 다시 로그인해주세요.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('nickname', nickname);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    // 2. 동적으로 읽어온 정보 전달
    formData.append('provider', provider);
    formData.append('providerUserId', providerUserId);

    try {
      await axiosInstance.post('/api/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('가입이 완료되었습니다!');
      await checkAuth(); // 로그인 상태 갱신
      navigate('/');
    } catch (err) {
      console.error('회원가입 요청 실패:', err);
      alert('가입에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>추가 정보 입력</h2>
      <p>서비스 이용을 위해 정보를 입력해주세요.</p>

      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#eee',
            margin: '0 auto',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '12px', color: '#999' }}>이미지 없음</span>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="사용할 닉네임 입력"
          style={{ padding: '8px', width: '200px' }}
        />
      </div>

      <button onClick={handleSignUpSubmit} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        가입 완료
      </button>
    </div>
  );
};

export default SignUpPage;
