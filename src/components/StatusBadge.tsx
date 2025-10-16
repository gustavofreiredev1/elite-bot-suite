import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error' | 'pending';
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Ativo',
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inativo',
    className: 'bg-muted text-muted-foreground border-border',
  },
  error: {
    label: 'Erro',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {config.label}
    </span>
  );
}
