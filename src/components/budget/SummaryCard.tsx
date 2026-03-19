import { cn } from '@/lib/utils';

export function SummaryCard({
  label,
  value,
  subtitle,
  className,
  valueClassName,
}: {
  label: string;
  value: string;
  subtitle?: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn('card-surface p-3.5 flex flex-col gap-1', className)}>
      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className={cn('text-xl font-mono font-semibold text-foreground', valueClassName)}>
        {value}
      </span>
      {subtitle && (
        <span className="text-[11px] font-mono text-muted-foreground">{subtitle}</span>
      )}
    </div>
  );
}
