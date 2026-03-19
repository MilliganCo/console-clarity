import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { useBudget } from '@/contexts/BudgetContext';
import { Check } from 'lucide-react';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU');
}

export default function AdjustBalance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories, adjustBalance } = useBudget();
  const [catId, setCatId] = useState(searchParams.get('cat') || '');
  const [newBalance, setNewBalance] = useState('');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState(false);

  const category = categories.find(c => c.id === catId);
  const newNum = parseInt(newBalance.replace(/\D/g, ''), 10) || 0;
  const delta = category ? newNum - category.balance : 0;

  const handleConfirm = () => {
    if (!category || !newBalance) return;
    adjustBalance(catId, newNum, note);
    setSuccess(true);
  };

  if (success) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Check size={28} className="text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Баланс обновлён!</h2>
            <button onClick={() => navigate(-1)} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-mono font-semibold mt-4">
              НАЗАД
            </button>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScreenHeader title="Корректировка" breadcrumb="CONSOLE > ADJUST" showBack />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4 space-y-4">
        {/* Category Selector */}
        <div className="card-surface p-4 space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">CATEGORY</label>
            <select
              value={catId}
              onChange={e => setCatId(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 appearance-none"
            >
              <option value="">Выберите категорию</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          {category && (
            <>
              {/* Current Value */}
              <div className="card-surface p-3 bg-muted/50">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">CURRENT</span>
                <div className="text-2xl font-mono font-bold text-foreground mt-1">{formatMoney(category.balance)} ₽</div>
              </div>

              {/* New Balance */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">NEW BALANCE</label>
                <input
                  type="text"
                  value={newBalance}
                  onChange={e => setNewBalance(e.target.value)}
                  placeholder="0"
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-lg font-mono text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {/* Delta Preview */}
              {newBalance && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface p-3 bg-muted/50">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">DELTA</span>
                  <div className={`text-2xl font-mono font-bold mt-1 ${delta >= 0 ? 'text-primary' : 'text-destructive'}`}>
                    {delta >= 0 ? '+' : ''}{formatMoney(delta)} ₽
                  </div>
                </motion.div>
              )}

              {/* Note */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">NOTE</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Причина корректировки..."
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleConfirm}
          disabled={!category || !newBalance}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-mono font-semibold tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Check size={16} />
          CONFIRM ADJUSTMENT
        </button>

        <div className="h-4" />
      </motion.div>
    </AppShell>
  );
}
