import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type CategoryStatus = 'ok' | 'low' | 'over' | 'extra';

export interface Category {
  id: string;
  name: string;
  icon: string;
  limit: number;
  allocated: number;
  balance: number;
  carryover: number;
  allocationRule: string;
  status: CategoryStatus;
}

export interface Transaction {
  id: string;
  categoryId: string;
  type: 'income' | 'expense' | 'transfer' | 'adjustment' | 'distribution';
  amount: number;
  date: string;
  note: string;
}

interface BudgetState {
  categories: Category[];
  transactions: Transaction[];
  totalFunds: number;
  nextPayday: string;
  nextPaydayAmount: number;
  currentMonth: string;
  syncStatus: string;
  syncTime: string;
}

interface BudgetContextType extends BudgetState {
  distributeIncome: (allocations: Record<string, number>) => void;
  transfer: (fromId: string, toId: string, amount: number, note: string) => void;
  adjustBalance: (categoryId: string, newBalance: number, note: string) => void;
  getCategoryById: (id: string) => Category | undefined;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Аренда', icon: '🏠', limit: 45000, allocated: 45000, balance: 45000, carryover: 0, allocationRule: 'FIRST PAYDAY ONLY', status: 'ok' },
  { id: '2', name: 'Еда', icon: '🍽', limit: 20000, allocated: 12000, balance: 3200, carryover: 0, allocationRule: '50/50', status: 'low' },
  { id: '3', name: 'Аптека', icon: '💊', limit: 5000, allocated: 5000, balance: 4800, carryover: 1200, allocationRule: '50/50', status: 'extra' },
  { id: '4', name: 'Ребёнок', icon: '👶', limit: 15000, allocated: 15000, balance: 8900, carryover: 0, allocationRule: '50/50', status: 'ok' },
  { id: '5', name: 'Кредиты', icon: '🏦', limit: 25000, allocated: 25000, balance: 25000, carryover: 0, allocationRule: 'FIRST PAYDAY ONLY', status: 'ok' },
  { id: '6', name: 'Транспорт', icon: '🚗', limit: 8000, allocated: 8000, balance: 450, carryover: 0, allocationRule: '50/50', status: 'low' },
  { id: '7', name: 'Интернет', icon: '📡', limit: 3000, allocated: 3000, balance: 2100, carryover: 0, allocationRule: 'FIRST PAYDAY ONLY', status: 'ok' },
  { id: '8', name: 'Другое', icon: '📦', limit: 10000, allocated: 10000, balance: 12500, carryover: 2500, allocationRule: '50/50', status: 'over' },
];

const initialTransactions: Transaction[] = [
  { id: 't1', categoryId: '2', type: 'expense', amount: -3400, date: '2026-03-18', note: 'Продукты' },
  { id: 't2', categoryId: '6', type: 'expense', amount: -2100, date: '2026-03-18', note: 'Бензин' },
  { id: 't3', categoryId: '2', type: 'expense', amount: -1800, date: '2026-03-17', note: 'Ресторан' },
  { id: 't4', categoryId: '4', type: 'expense', amount: -3500, date: '2026-03-17', note: 'Секция' },
  { id: 't5', categoryId: '3', type: 'adjustment', amount: 1200, date: '2026-03-16', note: 'Возврат' },
  { id: 't6', categoryId: '8', type: 'expense', amount: -4200, date: '2026-03-16', note: 'Непредвиденное' },
  { id: 't7', categoryId: '1', type: 'distribution', amount: 45000, date: '2026-03-01', note: 'Зарплата март' },
  { id: 't8', categoryId: '2', type: 'distribution', amount: 12000, date: '2026-03-01', note: 'Зарплата март' },
  { id: 't9', categoryId: '5', type: 'distribution', amount: 25000, date: '2026-03-01', note: 'Зарплата март' },
  { id: 't10', categoryId: '6', type: 'transfer', amount: -1500, date: '2026-03-15', note: 'Из Аптеки' },
];

function getStatus(balance: number, limit: number, carryover: number): CategoryStatus {
  if (balance > limit + carryover) return 'over';
  if (balance < limit * 0.2) return 'low';
  if (carryover > 0 && balance > limit) return 'extra';
  return 'ok';
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const totalFunds = categories.reduce((s, c) => s + c.balance, 0);

  const distributeIncome = useCallback((allocations: Record<string, number>) => {
    setCategories(prev => prev.map(cat => {
      const add = allocations[cat.id] || 0;
      const newBalance = cat.balance + add;
      const newAllocated = cat.allocated + add;
      return { ...cat, balance: newBalance, allocated: newAllocated, status: getStatus(newBalance, cat.limit, cat.carryover) };
    }));
    const newTxns = Object.entries(allocations)
      .filter(([, v]) => v > 0)
      .map(([catId, amount]) => ({
        id: `t${Date.now()}-${catId}`,
        categoryId: catId,
        type: 'distribution' as const,
        amount,
        date: new Date().toISOString().slice(0, 10),
        note: 'Распределение зарплаты',
      }));
    setTransactions(prev => [...newTxns, ...prev]);
  }, []);

  const transfer = useCallback((fromId: string, toId: string, amount: number, note: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === fromId) {
        const nb = cat.balance - amount;
        return { ...cat, balance: nb, status: getStatus(nb, cat.limit, cat.carryover) };
      }
      if (cat.id === toId) {
        const nb = cat.balance + amount;
        return { ...cat, balance: nb, status: getStatus(nb, cat.limit, cat.carryover) };
      }
      return cat;
    }));
    const date = new Date().toISOString().slice(0, 10);
    setTransactions(prev => [
      { id: `t${Date.now()}-from`, categoryId: fromId, type: 'transfer', amount: -amount, date, note },
      { id: `t${Date.now()}-to`, categoryId: toId, type: 'transfer', amount, date, note },
      ...prev,
    ]);
  }, []);

  const adjustBalance = useCallback((categoryId: string, newBalance: number, note: string) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      const delta = newBalance - cat.balance;
      return { ...cat, balance: newBalance, status: getStatus(newBalance, cat.limit, cat.carryover) };
    }));
    setTransactions(prev => [{
      id: `t${Date.now()}-adj`,
      categoryId,
      type: 'adjustment',
      amount: newBalance,
      date: new Date().toISOString().slice(0, 10),
      note,
    }, ...prev]);
  }, []);

  const getCategoryById = useCallback((id: string) => categories.find(c => c.id === id), [categories]);

  return (
    <BudgetContext.Provider value={{
      categories,
      transactions,
      totalFunds,
      nextPayday: '2026-04-01',
      nextPaydayAmount: 130000,
      currentMonth: 'MARCH 2026',
      syncStatus: 'SYNC OK',
      syncTime: '12:42',
      distributeIncome,
      transfer,
      adjustBalance,
      getCategoryById,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be inside BudgetProvider');
  return ctx;
}
