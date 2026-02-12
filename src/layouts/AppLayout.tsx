// 화면 프레임 / 모바일 폭 / 공통 UI 제공하는 역할 

import type { ReactNode } from 'react';
import Header from '../components/Header';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full flex justify-center bg-[#EEE9E5] ">
      <div className="w-full max-w-[500px] min-h-screen bg-[#EEE9E5]  overflow-x-hidden">
        <Header />
        {children}
      </div>
    </div>
  );
}
