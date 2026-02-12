import { Home, Bot, BarChart3, Workflow, MessageSquare, Settings, HelpCircle, X, Crown, TrendingUp, Package, Wallet, Ticket } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlanStore } from '@/store/planStore';
import { useState } from 'react';
import PlansModal from './PlansModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'Painel', path: '/dashboard' },
  { icon: Bot, label: 'Meus Bots', path: '/my-bots' },
  { icon: Workflow, label: 'Automações', path: '/automations' },
  { icon: MessageSquare, label: 'Chat', path: '/messages' },
  { icon: Package, label: 'Produtos', path: '/products' },
  { icon: Wallet, label: 'Carteira', path: '/wallet' },
  { icon: Ticket, label: 'Cupons', path: '/coupons' },
  { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
  { icon: BarChart3, label: 'Estatísticas', path: '/stats' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
  { icon: HelpCircle, label: 'Ajuda', path: '/support' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [showPlans, setShowPlans] = useState(false);
  const { hasActiveSubscription, isTrialActive } = usePlanStore();
  const showUpgrade = !hasActiveSubscription();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Always visible on desktop */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar',
          'transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'custom-scrollbar overflow-y-auto'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Close button for mobile */}
          <div className="flex items-center justify-end p-4 lg:hidden">
            <Button variant="ghost" size="icon" onClick={onClose} className="hover-glow">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-glow'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn('h-5 w-5', isActive && 'animate-pulse-slow')} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Upgrade / Connect Bot */}
          <div className="border-t border-sidebar-border p-4 space-y-2">
            {showUpgrade && (
              <Button 
                variant="outline" 
                className="w-full border-primary/50 text-primary hover:bg-primary/10" 
                onClick={() => { setShowPlans(true); onClose(); }}
              >
                <Crown className="mr-2 h-4 w-4" />
                Fazer Upgrade
              </Button>
            )}
            <NavLink to="/create-bot">
              <Button className="w-full hover-glow" onClick={onClose}>
                <Bot className="mr-2 h-4 w-4" />
                Conectar Telegram
              </Button>
            </NavLink>
          </div>
        </div>
      </aside>

      <PlansModal open={showPlans} onOpenChange={setShowPlans} />
    </>
  );
}
