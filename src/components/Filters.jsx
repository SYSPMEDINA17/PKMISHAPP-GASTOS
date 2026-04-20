import React from 'react';
import { Calendar, Filter, MousePointer2, Tag } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { id: 'all', label: 'Todos los Nodos', icon: '🌐' },
  { id: 'food', label: 'Nutrición y Diarios', icon: '🍲' },
  { id: 'transport', label: 'Movilidad y Logística', icon: '⚡' },
  { id: 'home', label: 'Residencial y Servicios', icon: '🏢' },
  { id: 'entertainment', label: 'Ocio y Digital', icon: '🎮' },
  { id: 'shopping', label: 'Adquisiciones', icon: '💎' },
  { id: 'health', label: 'Bio-Mantenimiento', icon: '💉' },
  { id: 'salary', label: 'Ingresos y Activos', icon: '💳' },
  { id: 'other', label: 'Otros y Varios', icon: '📦' },
];

export const Filters = () => {
  const { filters, setFilters } = useExpenses();

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row items-center gap-6 bg-slate-950/40 backdrop-blur-xl p-5 rounded-[28px] border border-white/5 shadow-xl relative overflow-hidden"
    >
      <div className="flex items-center gap-4 w-full md:w-auto group">
        <div className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-cyan-400 transition-all duration-300">
          <Calendar className="w-5 h-5 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
        </div>
        <div className="flex-1 md:flex-none">
          <p className="text-[11px] font-semibold text-slate-500 mb-0.5 flex items-center gap-2">
            Rango Temporal
          </p>
          <div className="relative">
            <input
              type="month"
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
              className="bg-transparent border-none p-0 text-base font-bold tracking-tight focus:ring-0 text-white cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="w-[1px] h-8 bg-white/5 hidden md:block" />

      <div className="flex items-center gap-4 w-full md:w-auto group">
        <div className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-indigo-400 transition-all duration-300">
          <Filter className="w-5 h-5 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
        </div>
        <div className="flex-1 md:flex-none">
          <p className="text-[11px] font-semibold text-slate-500 mb-0.5 flex items-center gap-2">
            Nodo de Categoría
          </p>
          <div className="relative group">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="bg-transparent border-none p-0 text-base font-bold tracking-tight focus:ring-0 text-white cursor-pointer appearance-none pr-8"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-slate-900 text-white font-medium">
                   {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
               <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-white rotate-45" />
            </div>
          </div>
        </div>
      </div>

      <div className="ml-auto hidden xl:flex items-center gap-3 pr-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500/80 tracking-wide uppercase">Stream Active</span>
        </div>
      </div>
    </motion.div>
  );
};
