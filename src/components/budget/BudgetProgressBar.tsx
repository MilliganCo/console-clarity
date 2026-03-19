import { cn } from '@/lib/utils';
import type { CategoryStatus } from '@/contexts/BudgetContext';

const barColors: Record<CategoryStatus, string> = {
  ok: 'bg-primary',
  low: 'bg-warning',
  over: 'bg-destructive',
  extra: 'bg-info',
};

export function BudgetProgressBar({
  value,
  max,
  status = 'ok',
  className,
}: {
  value: number;
  max: number;
  status?: CategoryStatus;
  className?: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('w-full h-1.5 rounded-full bg-border overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-300', barColors[status])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
