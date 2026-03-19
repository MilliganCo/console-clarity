import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Grid3X3, Banknote, ArrowLeftRight, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/dashboard', icon: Home, label: 'Главная' },
  { path: '/categories', icon: Grid3X3, label: 'Категории' },
  { path: '/distribution', icon: Banknote, label: 'Зарплата' },
  { path: '/transfer', icon: ArrowLeftRight, label: 'Перевод' },
  { path: '/settings', icon: Settings, label: 'Настройки' },
];

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md safe-bottom z-50">
      <div className="bg-muted/80 backdrop-blur-xl border-t border-border">
        <nav className="flex justify-around items-center h-16 px-2">
          {tabs.map(tab => {
            const isActive = location.pathname.startsWith(tab.path);
            const Icon = tab.icon;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center gap-0.5 px-3 py-2 transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-px left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ duration: 0.15 }}
                  />
                )}
                <Icon
                  size={20}
                  className={isActive ? 'text-primary' : 'text-muted-foreground'}
                />
                <span className={`text-[10px] font-mono uppercase tracking-wider ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
