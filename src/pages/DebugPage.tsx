import axiosInstance from '@/api/axios';
import { useState } from 'react';

export default function DebugPage() {
  const token = localStorage.getItem('accessToken');
  const cookie = document.cookie;
  const url = window.location.href;
  const [apiResult, setApiResult] = useState<string>('');

  // ✅ axios baseURL 확인
  const baseURL = axiosInstance.defaults.baseURL;

  const testApi = async () => {
    try {
      const res = await axiosInstance.get('/api/user/me');
      setApiResult('✅ 성공: ' + JSON.stringify(res.data));
    } catch (e: any) {
      setApiResult('❌ 실패: ' + (e.response?.status ?? '') + ' ' + JSON.stringify(e.response?.data ?? e.message));
    }
  };

  return (
    <div style={{ padding: '20px', wordBreak: 'break-all', fontSize: '14px' }}>
      <h2>🔍 Debug Info</h2>
      <hr />
      <p><b>accessToken:</b></p>
      <p style={{ color: token ? 'green' : 'red' }}>{token ?? 'null'}</p>
      <hr />
      {/* ✅ 추가 */}
      <p><b>API baseURL:</b></p>
      <p>{baseURL}</p>
      <hr />
      <p><b>cookie:</b></p>
      <p>{cookie || '없음'}</p>
      <hr />
      <p><b>현재 URL:</b></p>
      <p>{url}</p>
      <hr />
      <button
        onClick={testApi}
        style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}
      >
        /api/user/me 요청 테스트
      </button>
      <p><b>결과:</b></p>
      <p>{apiResult}</p>
    </div>
  );
}