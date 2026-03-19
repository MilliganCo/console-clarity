import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm flex flex-col gap-8"
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
            <span className="text-primary font-mono font-bold text-lg">₽</span>
          </div>
          <h1 className="font-mono font-bold text-lg tracking-widest text-foreground">BUDGET CONSOLE</h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">AUTHENTICATE TO CONTINUE</p>
        </div>

        <form onSubmit={handleLogin} className="card-surface p-5 flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
              EMAIL
            </label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@console.dev"
              className="bg-muted border-border font-mono text-sm focus:border-primary focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1.5 block">
              PASSWORD
            </label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-muted border-border font-mono text-sm focus:border-primary focus:ring-primary/30"
            />
          </div>
          <Button type="submit" className="w-full mt-2 font-mono font-semibold tracking-wider rounded-xl">
            LOG IN
          </Button>
        </form>

        <div className="flex justify-center gap-6">
          <button className="text-xs font-mono text-primary hover:underline">SIGN UP</button>
          <button className="text-xs font-mono text-muted-foreground hover:text-foreground">RESET PASSWORD</button>
        </div>
      </motion.div>
    </div>
  );
}
