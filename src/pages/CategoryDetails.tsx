import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { StatusPill } from '@/components/budget/StatusPill';
import { BudgetProgressBar } from '@/components/budget/BudgetProgressBar';
import { SummaryCard } from '@/components/budget/SummaryCard';
import { useBudget } from '@/contexts/BudgetContext';
import { SlidersHorizontal, ArrowLeftRight, Pencil } from 'lucide-react';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU');
}

export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCategoryById, transactions } = useBudget();

  const category = getCategoryById(id || '');
  if (!category) return <AppShell><div className="p-8 text-center text-muted-foreground font-mono">CATEGORY NOT FOUND</div></AppShell>;

  const catTransactions = transactions.filter(t => t.categoryId === category.id).slice(0, 8);
  const leftToPayday = Math.max(0, category.limit - category.allocated + category.balance);

  return (
    <AppShell>
      <ScreenHeader
        title={category.name}
        breadcrumb={`CATEGORIES > ${category.name.toUpperCase()}`}
        showBack
      />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="px-4 space-y-4"
      >
        {/* Hero Balance */}
        <div className="card-surface p-5 border-primary/20">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{category.icon}</span>
                <span className="text-sm font-medium text-foreground">{category.name}</span>
              </div>
              <div className="text-3xl font-mono font-bold text-foreground text-glow">
                {formatMoney(category.balance)} ₽
              </div>
            </div>
            <StatusPill status={category.status} />
          </div>
          <BudgetProgressBar value={category.balance} max={category.limit} status={category.status} className="mb-2" />
          <div className="text-[11px] font-mono text-muted-foreground">
            МЕСЯЧНЫЙ ЛИМИТ: {formatMoney(category.limit)} ₽
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-3">
          <SummaryCard label="LIMIT" value={`${formatMoney(category.limit)} ₽`} />
          <SummaryCard label="ALLOCATED" value={`${formatMoney(category.allocated)} ₽`} />
          <SummaryCard label="CARRYOVER" value={`${formatMoney(category.carryover)} ₽`} />
          <SummaryCard label="LEFT TO PAYDAY" value={`${formatMoney(leftToPayday)} ₽`} />
        </div>

        {/* Allocation Rule */}
        <div className="card-surface p-4">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">ALLOCATION RULE</span>
          <div className="text-sm font-mono font-medium text-primary mt-1">{category.allocationRule}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {[
            { icon: SlidersHorizontal, label: 'ADJUST', path: `/adjust?cat=${category.id}` },
            { icon: ArrowLeftRight, label: 'TRANSFER', path: `/transfer?from=${category.id}` },
            { icon: Pencil, label: 'EDIT', path: '#' },
          ].map(action => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="flex-1 card-surface p-3 flex flex-col items-center gap-1.5 hover:border-[hsl(var(--border-active))] transition-colors active:scale-[0.97]"
            >
              <action.icon size={16} className="text-primary" />
              <span className="text-[10px] font-mono font-medium text-foreground">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Transactions Timeline */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-1">TRANSACTIONS</span>
          {catTransactions.map(txn => (
            <div key={txn.id} className="flex items-center justify-between py-2.5 px-3 bg-muted/30 rounded-lg">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground">{txn.note}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{txn.date} · {txn.type.toUpperCase()}</span>
              </div>
              <span className={`text-sm font-mono font-semibold ${txn.amount >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {txn.amount >= 0 ? '+' : ''}{formatMoney(txn.amount)} ₽
              </span>
            </div>
          ))}
          {catTransactions.length === 0 && (
            <div className="text-center py-6 text-xs font-mono text-muted-foreground">NO TRANSACTIONS</div>
          )}
        </div>

        <div className="h-4" />
      </motion.div>
    </AppShell>
  );
}
