import { AlertTriangle, Info, ArrowUpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type AlertType = 'warning' | 'info' | 'action';

const alertConfig: Record<AlertType, { icon: typeof AlertTriangle; className: string }> = {
  warning: { icon: AlertTriangle, className: 'text-warning' },
  info: { icon: Info, className: 'text-info' },
  action: { icon: ArrowUpCircle, className: 'text-primary' },
};

export function AlertRow({
  type,
  message,
  className,
}: {
  type: AlertType;
  message: string;
  className?: string;
}) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-3 py-2.5 px-4 rounded-lg bg-muted/50', className)}>
      <Icon size={16} className={config.className} />
      <span className="text-xs font-mono text-foreground">{message}</span>
    </div>
  );
}
