import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary rounded-lg blur-lg opacity-50 animate-glow" />
        <div className="relative bg-primary rounded-lg p-2">
          <Bot className={`${sizes[size]} text-primary-foreground`} />
        </div>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent`}>
          BOT ELITE
        </span>
      )}
    </motion.div>
  );
}
