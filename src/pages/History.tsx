import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { useBudget } from '@/contexts/BudgetContext';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU');
}

const typeLabels: Record<string, string> = {
  income: 'INCOME',
  expense: 'EXPENSE',
  transfer: 'TRANSFER',
  adjustment: 'ADJUST',
  distribution: 'DISTRIB',
};

export default function History() {
  const { transactions, categories } = useBudget();
  const [filterCat, setFilterCat] = useState('');
  const [filterType, setFilterType] = useState('');

  const filtered = transactions.filter(t => {
    if (filterCat && t.categoryId !== filterCat) return false;
    if (filterType && t.type !== filterType) return false;
    return true;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, t) => {
    (acc[t.date] ??= []).push(t);
    return acc;
  }, {});

  const getCatName = (id: string) => categories.find(c => c.id === id)?.name || '—';
  const getCatIcon = (id: string) => categories.find(c => c.id === id)?.icon || '📁';

  return (
    <AppShell>
      <ScreenHeader title="История" breadcrumb="CONSOLE > HISTORY" showBack />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 space-y-3">
        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="flex-1 bg-muted border border-border rounded-lg px-2 py-1.5 text-[11px] font-mono text-foreground focus:outline-none focus:border-primary/50 appearance-none"
          >
            <option value="">ВСЕ КАТЕГОРИИ</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="flex-1 bg-muted border border-border rounded-lg px-2 py-1.5 text-[11px] font-mono text-foreground focus:outline-none focus:border-primary/50 appearance-none"
          >
            <option value="">ВСЕ ТИПЫ</option>
            <option value="income">INCOME</option>
            <option value="expense">EXPENSE</option>
            <option value="transfer">TRANSFER</option>
            <option value="adjustment">ADJUST</option>
            <option value="distribution">DISTRIB</option>
          </select>
        </div>

        {/* Grouped List */}
        {Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a)).map(([date, txns]) => (
          <div key={date} className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-1 pt-2">
              {date}
            </div>
            {txns.map(txn => (
              <div key={txn.id} className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-sm flex-shrink-0">{getCatIcon(txn.categoryId)}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">{txn.note}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      {getCatName(txn.categoryId)} · {typeLabels[txn.type] || txn.type}
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-mono font-semibold flex-shrink-0 ml-2 ${txn.amount >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {txn.amount >= 0 ? '+' : ''}{formatMoney(txn.amount)} ₽
                </span>
              </div>
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm font-mono text-muted-foreground">NO TRANSACTIONS</div>
        )}

        <div className="h-4" />
      </motion.div>
    </AppShell>
  );
}
