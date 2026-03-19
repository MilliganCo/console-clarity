import { ReactNode } from 'react';
import { TabBar } from './TabBar';

export function AppShell({ children, hideTabBar = false }: { children: ReactNode; hideTabBar?: boolean }) {
  return (
    <div className="flex justify-center min-h-screen bg-background">
      <div className="w-full max-w-md min-h-screen flex flex-col relative">
        <div className="flex-1 overflow-y-auto pb-20 safe-top">
          {children}
        </div>
        {!hideTabBar && <TabBar />}
      </div>
    </div>
  );
}
