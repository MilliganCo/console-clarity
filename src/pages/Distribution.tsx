import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { SummaryCard } from '@/components/budget/SummaryCard';
import { useBudget } from '@/contexts/BudgetContext';
import { Check, PartyPopper } from 'lucide-react';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU');
}

export default function Distribution() {
  const navigate = useNavigate();
  const { categories, distributeIncome } = useBudget();
  const [incomeAmount, setIncomeAmount] = useState(130000);
  const [allocations, setAllocations] = useState<Record<string, number>>(() =>
    Object.fromEntries(categories.map(c => {
      const recommended = Math.round(incomeAmount * (c.limit / categories.reduce((s, cc) => s + cc.limit, 0)));
      return [c.id, recommended];
    }))
  );
  const [confirmed, setConfirmed] = useState(false);

  const totalAssigned = useMemo(() => Object.values(allocations).reduce((s, v) => s + v, 0), [allocations]);
  const left = incomeAmount - totalAssigned;

  const updateAllocation = (id: string, value: string) => {
    const num = parseInt(value.replace(/\D/g, ''), 10) || 0;
    setAllocations(prev => ({ ...prev, [id]: num }));
  };

  const handleConfirm = () => {
    distributeIncome(allocations);
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <PartyPopper size={28} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Распределено!</h2>
            <p className="text-sm font-mono text-muted-foreground mb-6">
              {formatMoney(incomeAmount)} ₽ распределены по категориям
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-mono font-semibold"
            >
              DASHBOARD
            </button>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScreenHeader title="Зарплата" breadcrumb="CONSOLE > DISTRIBUTION" showBack />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="px-4 space-y-4 pb-28"
      >
        {/* Income Card */}
        <div className="card-surface p-4 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">INCOME</span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-muted-foreground block mb-1">ДАТА</label>
              <div className="bg-muted border border-border rounded-xl px-3 py-2 text-sm font-mono text-foreground">
                2026-04-01
              </div>
            </div>
            <div>
              <label className="text-[10px] font-mono text-muted-foreground block mb-1">СУММА</label>
              <input
                type="text"
                value={formatMoney(incomeAmount)}
                onChange={e => {
                  const v = parseInt(e.target.value.replace(/\D/g, ''), 10) || 0;
                  setIncomeAmount(v);
                }}
                className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-3 gap-2">
          <SummaryCard label="RECEIVED" value={`${formatMoney(incomeAmount)}`} className="p-2.5" />
          <SummaryCard label="ASSIGNED" value={`${formatMoney(totalAssigned)}`} className="p-2.5" />
          <SummaryCard
            label="LEFT"
            value={`${formatMoney(left)}`}
            className="p-2.5"
            valueClassName={left === 0 ? 'text-primary text-glow' : left < 0 ? 'text-destructive' : ''}
          />
        </div>

        {/* Allocation Rows */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-1">ALLOCATIONS</span>
          {categories.map(cat => {
            const alloc = allocations[cat.id] || 0;
            const after = cat.balance + alloc;
            return (
              <div key={cat.id} className="card-surface p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">REC: {formatMoney(Math.round(incomeAmount * (cat.limit / categories.reduce((s, c) => s + c.limit, 0))))}</span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formatMoney(alloc)}
                    onChange={e => updateAllocation(cat.id, e.target.value)}
                    className="flex-1 bg-muted border border-border rounded-lg px-3 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50"
                  />
                  <div className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
                    {formatMoney(cat.balance)} → <span className="text-foreground">{formatMoney(after)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Sticky Bottom */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-4 z-40">
        <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono text-muted-foreground">
              ASSIGNED: <span className="text-foreground">{formatMoney(totalAssigned)} ₽</span>
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              LEFT: <span className={left === 0 ? 'text-primary' : left < 0 ? 'text-destructive' : 'text-foreground'}>
                {formatMoney(left)} ₽
              </span>
            </div>
          </div>
          <button
            onClick={handleConfirm}
            disabled={left !== 0}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-mono font-semibold tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-opacity"
          >
            <Check size={16} />
            CONFIRM DISTRIBUTION
          </button>
        </div>
      </div>
    </AppShell>
  );
}
