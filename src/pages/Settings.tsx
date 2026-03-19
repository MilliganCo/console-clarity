import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { ScreenHeader } from '@/components/budget/ScreenHeader';
import { ChevronRight } from 'lucide-react';

interface SettingRow {
  label: string;
  value: string;
  path?: string;
}

const sections: { title: string; rows: SettingRow[] }[] = [
  {
    title: 'GENERAL',
    rows: [
      { label: 'Валюта', value: 'RUB ₽' },
      { label: 'Язык', value: 'Русский' },
      { label: 'Тема', value: 'Dark Terminal' },
    ],
  },
  {
    title: 'INCOME SCHEDULE',
    rows: [
      { label: 'Зарплата 1', value: '1 числа' },
      { label: 'Зарплата 2', value: '15 числа' },
      { label: 'Ожидаемая сумма', value: '130 000 ₽' },
    ],
  },
  {
    title: 'CATEGORIES',
    rows: [
      { label: 'Всего категорий', value: '8', path: '/categories' },
      { label: 'Правила распределения', value: 'Custom' },
    ],
  },
  {
    title: 'BUDGET RULES',
    rows: [
      { label: 'Модель переноса', value: 'Carryover' },
      { label: 'Режим корректировки', value: 'Manual' },
    ],
  },
  {
    title: 'DATA',
    rows: [
      { label: 'История операций', value: '→', path: '/history' },
      { label: 'Экспорт данных', value: 'CSV' },
      { label: 'Последняя синхр.', value: '12:42' },
    ],
  },
  {
    title: 'ACCOUNT',
    rows: [
      { label: 'Email', value: 'user@console.dev' },
      { label: 'Выйти', value: '' },
    ],
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <AppShell>
      <ScreenHeader title="Настройки" breadcrumb="CONSOLE > SETTINGS" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 space-y-5">
        {sections.map(section => (
          <div key={section.title} className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground px-1 pb-1">
              {section.title}
            </div>
            <div className="card-surface overflow-hidden divide-y divide-border">
              {section.rows.map(row => (
                <button
                  key={row.label}
                  onClick={() => row.path && navigate(row.path)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <span className="text-sm text-foreground">{row.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-muted-foreground">{row.value}</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="h-4" />
      </motion.div>
    </AppShell>
  );
}
