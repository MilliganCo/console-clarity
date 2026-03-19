import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { SummaryCard } from '@/components/budget/SummaryCard';
import { AlertRow } from '@/components/budget/AlertRow';
import { CategoryCard } from '@/components/budget/CategoryCard';
import { useBudget } from '@/contexts/BudgetContext';
import { CalendarDays, User, Plus, SlidersHorizontal, ArrowLeftRight, FolderPlus } from 'lucide-react';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU');
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { categories, totalFunds, currentMonth, syncStatus, syncTime, nextPayday, nextPaydayAmount } = useBudget();

  const unallocated = totalFunds - categories.reduce((s, c) => s + c.limit, 0);
  const daysToPayday = Math.max(0, Math.ceil((new Date(nextPayday).getTime() - Date.now()) / 86400000));
  const adjusted = categories.reduce((s, c) => s + c.carryover, 0);
  const lowCategories = categories.filter(c => c.status === 'low');
  const topCategories = categories.slice(0, 5);

  const quickActions = [
    { icon: Plus, label: '+ INCOME', onClick: () => navigate('/distribution') },
    { icon: SlidersHorizontal, label: 'ADJUST', onClick: () => navigate('/adjust') },
    { icon: ArrowLeftRight, label: 'TRANSFER', onClick: () => navigate('/transfer') },
    { icon: FolderPlus, label: 'NEW CAT', onClick: () => {} },
  ];

  return (
    <AppShell>
      <ScreenHeader
        title={currentMonth}
        breadcrumb="CONSOLE > DASHBOARD"
        rightAction={
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <CalendarDays size={18} />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <User size={18} />
            </button>
          </div>
        }
      />
      <div className="px-4 mb-1">
        <span className="text-[10px] font-mono text-primary tracking-wider">
          {syncStatus} · {syncTime}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 space-y-3"
      >
        {/* Summary Grid */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard label="IN FUNDS" value={`${formatMoney(totalFunds)} ₽`} subtitle="всего на счетах" valueClassName="text-glow" />
          <SummaryCard label="UNALLOCATED" value={`${formatMoney(Math.max(0, unallocated))} ₽`} subtitle="свободные" />
          <SummaryCard label="ADJUSTED" value={`${formatMoney(adjusted)} ₽`} subtitle="корректировки" />
          <SummaryCard label="DAYS TO PAYDAY" value={`${daysToPayday}`} subtitle={nextPayday} />
        </div>

        {/* Next Payday Hero */}
        <button
          onClick={() => navigate('/distribution')}
          className="card-surface w-full p-4 text-left border-primary/30 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">NEXT PAYDAY</span>
              <div className="text-2xl font-mono font-bold text-foreground text-glow mt-1">
                {formatMoney(nextPaydayAmount)} ₽
              </div>
              <div className="text-xs font-mono text-muted-foreground mt-0.5">{nextPayday}</div>
            </div>
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider">
              DISTRIBUTE
            </div>
          </div>
        </button>

        {/* Alerts */}
        {lowCategories.length > 0 && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-1">ALERTS</span>
            {lowCategories.map(c => (
              <AlertRow key={c.id} type="warning" message={`${c.name.toUpperCase()} BALANCE LOW — ${formatMoney(c.balance)} ₽`} />
            ))}
            <AlertRow type="action" message="UPDATE ACTUAL BALANCES" />
          </div>
        )}

        {/* Top Categories */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">TOP CATEGORIES</span>
            <button onClick={() => navigate('/categories')} className="text-[10px] font-mono text-primary">VIEW ALL</button>
          </div>
          {topCategories.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-1">QUICK ACTIONS</span>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="card-surface p-3.5 flex items-center gap-2.5 hover:border-[hsl(var(--border-active))] transition-colors active:scale-[0.97]"
              >
                <action.icon size={16} className="text-primary" />
                <span className="text-xs font-mono font-medium text-foreground">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-4" />
      </motion.div>
    </AppShell>
  );
}
