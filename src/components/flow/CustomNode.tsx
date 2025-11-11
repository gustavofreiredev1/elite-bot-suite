import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import {
  MessageCircle,
  Clock,
  Filter,
  Send,
  Settings,
  Workflow,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, any> = {
  message: MessageCircle,
  delay: Clock,
  condition: Filter,
  action: Send,
  trigger: Workflow,
  settings: Settings,
  error: AlertCircle,
  success: CheckCircle2,
};

export const CustomNode = memo(({ data, selected }: NodeProps) => {
  const Icon = iconMap[data.type] || MessageCircle;

  return (
    <Card
      className={cn(
        'min-w-[200px] p-4 transition-all',
        selected ? 'ring-2 ring-primary shadow-lg' : 'shadow-md',
        'hover:shadow-xl cursor-pointer'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-primary !border-2 !border-background !w-3 !h-3"
      />

      <div className="flex items-start gap-3">
        <div
          className={cn(
            'p-2 rounded-lg shrink-0',
            data.type === 'trigger' && 'bg-green-500/20',
            data.type === 'message' && 'bg-primary/20',
            data.type === 'delay' && 'bg-amber-500/20',
            data.type === 'condition' && 'bg-purple-500/20',
            data.type === 'action' && 'bg-blue-500/20',
            !['trigger', 'message', 'delay', 'condition', 'action'].includes(data.type) &&
              'bg-muted'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 truncate">{data.label}</h3>
          {data.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{data.description}</p>
          )}
        </div>
      </div>

      {data.config && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground space-y-1">
            {Object.entries(data.config).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}:</span>
                <span className="font-medium text-foreground">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-primary !border-2 !border-background !w-3 !h-3"
      />
    </Card>
  );
});

CustomNode.displayName = 'CustomNode';
