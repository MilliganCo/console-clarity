import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { CategoryCard } from '@/components/budget/CategoryCard';
import { useBudget } from '@/contexts/BudgetContext';
import type { CategoryStatus } from '@/contexts/BudgetContext';

const filters: { label: string; value: CategoryStatus | 'all' }[] = [
  { label: 'ALL', value: 'all' },
  { label: 'ACTIVE', value: 'ok' },
  { label: 'LOW', value: 'low' },
  { label: 'EXTRA', value: 'extra' },
];

export default function Categories() {
  const { categories } = useBudget();
  const [filter, setFilter] = useState<CategoryStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = categories.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell>
      <ScreenHeader
        title="Категории"
        breadcrumb="CONSOLE > CATEGORIES"
        rightAction={
          <button className="p-2 text-primary hover:text-accent transition-colors">
            <Plus size={20} />
          </button>
        }
      />

      <div className="px-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories"
            className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors ${
                filter === f.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category List */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-3">
            {filtered.map(cat => (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <CategoryCard category={cat} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm font-mono text-muted-foreground">NO CATEGORIES FOUND</p>
          </div>
        )}

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
