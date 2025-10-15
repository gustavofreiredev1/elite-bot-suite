import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export default function GlassCard({ children, className, hover = false, glow = false }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : undefined}
      className={cn(
        'glass-strong rounded-2xl p-6',
        hover && 'cursor-pointer transition-smooth',
        glow && 'hover-glow',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
