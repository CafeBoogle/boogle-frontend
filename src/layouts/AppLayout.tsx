// 화면 프레임 / 모바일 폭 / 공통 UI 제공하는 역할

import type { ReactNode } from 'react';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-200">
      <div className="w-full max-w-[430px] min-h-screen bg-white overflow-x-hidden shadow-xl">
        <Header />
        <main>{children}</main>
      </div>
    </div>
  );
}
