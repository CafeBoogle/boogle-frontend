import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AppLayout from '@/layouts/AppLayout';

import MainPage from '@/pages/MainPage';
import MyPage from '@/pages/MyPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import CategoryPage from './pages/CategoryPage';
import FilterPage from './pages/FilterPage';
import CafeListPage from './pages/CafeListPage';
import CafeInfoPage from './pages/CafeInfoPage';
import AddReviewPage from './pages/AddReviewPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/filter" element={<FilterPage />} />
            <Route path="/cafelist" element={<CafeListPage />} />
            <Route path="/cafeinfo" element={<CafeInfoPage />} />
            <Route path="/addreview" element={<AddReviewPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
