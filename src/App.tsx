import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AppLayout from '@/layouts/AppLayout';

import MainPage from '@/pages/MainPage';
import MyPage from '@/pages/MyPage';
import LoginPage from '@/pages/LoginPage';
import CategoryPage from './pages/CategoryPage';
import FilterPage from './pages/FilterPage';
import CafeListPage from './pages/CafeListPage';
import CafeInfoPage from './pages/CafeInfoPage';
import AddReviewPage from './pages/AddReviewPage';
import AuthSuccess from './pages/AuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import SignUpPage from './pages/SignUpPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
<Routes>
  {/* 누구나 볼 수 있는 페이지 */}
  <Route path="/" element={<MainPage />} />
  <Route path="/loginpage" element={<LoginPage />} />
  <Route path="/category" element={<CategoryPage />} />
  <Route path="/cafelist" element={<CafeListPage />} />
  <Route path="/cafeinfo" element={<CafeInfoPage />} />

  {/* 반드시 로그인이 필요한 페이지들 */}
  <Route path="/mypage" element={
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  } />
  
  <Route path="/addreview" element={
    <ProtectedRoute>
      <AddReviewPage />
    </ProtectedRoute>
  } />

  {/* 카카오 인증 직후 닉네임 설정하러 오는 곳 */}
  <Route path="/signup" element={<SignUpPage />} />
  
  <Route path="/auth/success" element={<AuthSuccess />} />
</Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
