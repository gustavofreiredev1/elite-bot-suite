import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md"
      >
        <Logo size="lg" />
        
        <div className="card-elegant p-8 space-y-4">
          <AlertTriangle className="h-16 w-16 text-warning mx-auto" />
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <p className="text-xl font-semibold">Página não encontrada</p>
          <p className="text-muted-foreground">
            A página que você está procurando não existe ou foi movida.
          </p>
          
          <Button asChild className="w-full hover-glow">
            <a href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao Dashboard
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
