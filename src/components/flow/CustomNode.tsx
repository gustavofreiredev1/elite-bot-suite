import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import {
  MessageCircle, Clock, Filter, Send, Workflow, Settings, AlertCircle, CheckCircle2,
  Image, Volume2, Video, MousePointer, DollarSign, Tag, Variable, Webhook,
  ListOrdered, Plug, RotateCw,
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
  image: Image,
  audio: Volume2,
  video: Video,
  button: MousePointer,
  payment: DollarSign,
  webhook: Webhook,
  tag: Tag,
  variable: Variable,
  list: ListOrdered,
  api: Plug,
  sequence: RotateCw,
};

const colorMap: Record<string, string> = {
  trigger: 'bg-emerald-500/20',
  message: 'bg-primary/20',
  delay: 'bg-amber-500/20',
  condition: 'bg-purple-500/20',
  action: 'bg-blue-500/20',
  image: 'bg-sky-500/20',
  audio: 'bg-orange-500/20',
  video: 'bg-pink-500/20',
  button: 'bg-cyan-500/20',
  payment: 'bg-emerald-500/20',
  webhook: 'bg-rose-500/20',
  tag: 'bg-indigo-500/20',
  variable: 'bg-teal-500/20',
  list: 'bg-lime-500/20',
  api: 'bg-violet-500/20',
  sequence: 'bg-fuchsia-500/20',
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
        <div className={cn('p-2 rounded-lg shrink-0', colorMap[data.type] || 'bg-muted')}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 truncate">{data.label}</h3>
          {data.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{data.description}</p>
          )}
        </div>
      </div>

      {data.config && Object.keys(data.config).length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground space-y-1">
            {Object.entries(data.config).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}:</span>
                <span className="font-medium text-foreground truncate ml-2 max-w-[100px]">{String(value)}</span>
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
