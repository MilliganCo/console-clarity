import { useNavigate } from 'react-router-dom';
import { StatusPill } from './StatusPill';
import { BudgetProgressBar } from './BudgetProgressBar';
import type { Category } from '@/contexts/BudgetContext';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

function formatMoney(n: number) {
  return n.toLocaleString('ru-RU');
}

export function CategoryCard({ category, className }: { category: Category; className?: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/categories/${category.id}`)}
      className={cn(
        'card-surface p-4 w-full text-left flex flex-col gap-2.5 transition-colors hover:border-[hsl(var(--border-active))] active:scale-[0.98]',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{category.icon}</span>
          <div>
            <div className="text-sm font-medium text-foreground">{category.name}</div>
            <div className="text-[11px] font-mono text-muted-foreground">
              ЛИМИТ {formatMoney(category.limit)} ₽
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-base font-mono font-semibold text-foreground">
              {formatMoney(category.balance)} ₽
            </div>
            <StatusPill status={category.status} />
          </div>
          <ChevronRight size={16} className="text-muted-foreground" />
        </div>
      </div>
      <BudgetProgressBar
        value={category.balance}
        max={category.limit}
        status={category.status}
      />
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
        Распределено {formatMoney(category.allocated)} / {formatMoney(category.limit)}
      </div>
    </button>
  );
}
