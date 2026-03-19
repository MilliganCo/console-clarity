import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/dashboard', { replace: true }), 1800);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
          <span className="text-primary font-mono font-bold text-2xl">₽</span>
        </div>

        <div className="text-center">
          <h1 className="font-mono font-bold text-xl tracking-widest text-foreground text-glow">
            BUDGET CONSOLE
          </h1>
          <p className="text-[11px] font-mono text-muted-foreground mt-2 tracking-wider">
            PERSONAL FINANCE TERMINAL
          </p>
        </div>

        <div className="flex items-center gap-1 mt-8">
          <span className="text-xs font-mono text-muted-foreground">INITIALIZING</span>
          <span className="text-primary font-mono animate-blink">▌</span>
        </div>
      </motion.div>
    </div>
  );
}
