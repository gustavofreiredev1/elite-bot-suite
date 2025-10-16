import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 lg:mb-8"
    >
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} className="mb-4" />}
      
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
              <div className="relative bg-gradient-primary rounded-xl p-3 shadow-glow">
                <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
              </div>
            </div>
          )}
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="text-sm lg:text-base text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </motion.div>
  );
}
