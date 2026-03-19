import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { useBudget } from '@/contexts/BudgetContext';
import { ArrowDown, Check } from 'lucide-react';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU');
}

export default function Transfer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { categories, transfer } = useBudget();
  const [fromId, setFromId] = useState(searchParams.get('from') || '');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [success, setSuccess] = useState(false);

  const amountNum = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const fromCat = categories.find(c => c.id === fromId);
  const toCat = categories.find(c => c.id === toId);
  const isValid = fromId && toId && fromId !== toId && amountNum > 0 && fromCat && amountNum <= fromCat.balance;

  const handleConfirm = () => {
    if (!isValid) return;
    transfer(fromId, toId, amountNum, note);
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
            <h2 className="text-xl font-semibold text-foreground mb-2">Перевод выполнен!</h2>
            <p className="text-sm font-mono text-muted-foreground mb-6">{formatMoney(amountNum)} ₽ переведено</p>
            <button onClick={() => navigate(-1)} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-mono font-semibold">
              НАЗАД
            </button>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScreenHeader title="Перевод" breadcrumb="CONSOLE > TRANSFER" showBack />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4 space-y-4">
        <div className="card-surface p-4 space-y-4">
          {/* From */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">FROM</label>
            <select
              value={fromId}
              onChange={e => setFromId(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 appearance-none"
            >
              <option value="">Выберите категорию</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name} — {formatMoney(c.balance)} ₽</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <ArrowDown size={16} className="text-primary" />
            </div>
          </div>

          {/* To */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">TO</label>
            <select
              value={toId}
              onChange={e => setToId(e.target.value)}
              className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 appearance-none"
            >
              <option value="">Выберите категорию</option>
              {categories.filter(c => c.id !== fromId).map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name} — {formatMoney(c.balance)} ₽</option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">AMOUNT</label>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-lg font-mono text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1.5">NOTE</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Комментарий..."
              className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        {/* Live Preview */}
        {fromCat && toCat && amountNum > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface p-4 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">PREVIEW</span>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-foreground">{fromCat.icon} {fromCat.name}</span>
              <span className="text-sm font-mono">
                <span className="text-muted-foreground">{formatMoney(fromCat.balance)}</span>
                <span className="text-muted-foreground mx-1">→</span>
                <span className="text-destructive">{formatMoney(fromCat.balance - amountNum)}</span>
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-foreground">{toCat.icon} {toCat.name}</span>
              <span className="text-sm font-mono">
                <span className="text-muted-foreground">{formatMoney(toCat.balance)}</span>
                <span className="text-muted-foreground mx-1">→</span>
                <span className="text-primary">{formatMoney(toCat.balance + amountNum)}</span>
              </span>
            </div>
          </motion.div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!isValid}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-mono font-semibold tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Check size={16} />
          CONFIRM TRANSFER
        </button>

        <div className="h-4" />
      </motion.div>
    </AppShell>
  );
}
