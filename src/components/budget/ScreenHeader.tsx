import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ScreenHeader({
  title,
  breadcrumb,
  showBack = false,
  rightAction,
}: {
  title: string;
  breadcrumb?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-4 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1">
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          {breadcrumb && (
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">
              {breadcrumb}
            </div>
          )}
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
      </div>
      {rightAction}
    </div>
  );
}
