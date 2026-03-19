import { cn } from '@/lib/utils';
import type { CategoryStatus } from '@/contexts/BudgetContext';

const statusConfig: Record<CategoryStatus, { label: string; className: string }> = {
  ok: { label: 'OK', className: 'bg-primary/15 text-primary border-primary/30' },
  low: { label: 'LOW', className: 'bg-warning/15 text-warning border-warning/30' },
  over: { label: 'OVER', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  extra: { label: 'EXTRA', className: 'bg-info/15 text-info border-info/30' },
};

export function StatusPill({ status, className }: { status: CategoryStatus; className?: string }) {
  const config = statusConfig[status];
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  );
}
