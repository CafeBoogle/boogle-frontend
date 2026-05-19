import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import AppLayout from '@/layouts/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

import MainPage from '@/pages/MainPage';
import MyPage from '@/pages/MyPage';
import LoginPage from '@/pages/LoginPage';
import SignUpPage from '@/pages/SignUpPage';
import CategoryPage from '@/pages/CategoryPage';
import CafeListPage from '@/pages/CafeListPage';
import CafeInfoPage from '@/pages/CafeInfoPage';
import AddReviewPage from '@/pages/AddReviewPage';
import EditReviewPage from '@/pages/EditReviewPage';
import AuthSuccess from '@/pages/AuthSuccess';
import DebugPage from '@/pages/DebugPage';

const publicRoutes = [
  { path: '/', element: <MainPage /> },
  { path: '/loginpage', element: <LoginPage /> },
  { path: '/category', element: <CategoryPage /> },
  { path: '/cafelist', element: <CafeListPage /> },
  { path: '/cafes/:cafeId', element: <CafeInfoPage /> },
  { path: '/reviews/edit/:reviewId', element: <EditReviewPage /> },
  { path: '/signup', element: <SignUpPage /> },
  { path: '/auth/success', element: <AuthSuccess /> },
  { path: '/debug', element: <DebugPage /> },
];

const protectedRoutes = [
  { path: '/mypage', element: <MyPage /> },
  { path: '/addreview', element: <AddReviewPage /> },
  { path: '/addreview/:cafeId', element: <AddReviewPage /> },
];

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {publicRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            {protectedRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
            ))}
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
