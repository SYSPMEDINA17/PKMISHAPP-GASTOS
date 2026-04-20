import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Search, 
  Filter, 
  Coffee, 
  Car, 
  Home, 
  Gamepad2, 
  ShoppingBag, 
  Stethoscope, 
  Banknote, 
  Box,
  Clock,
  Database
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { cn, formatCurrency } from '../lib/utils';

const CATEGORY_ICONS = {
  food: <Coffee className="w-4 h-4" />,
  transport: <Car className="w-4 h-4" />,
  home: <Home className="w-4 h-4" />,
  entertainment: <Gamepad2 className="w-4 h-4" />,
  shopping: <ShoppingBag className="w-4 h-4" />,
  health: <Stethoscope className="w-4 h-4" />,
  salary: <Banknote className="w-4 h-4" />,
  other: <Box className="w-4 h-4" />,
};

const CATEGORY_COLORS = {
  food: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  transport: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  home: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  entertainment: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  shopping: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  health: "text-red-400 bg-red-400/10 border-red-400/20",
  salary: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  other: "text-slate-400 bg-slate-400/10 border-slate-400/20",
};

export const TransactionList = () => {
  const { filteredExpenses, deleteExpense, user } = useExpenses();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl overflow-hidden relative"
    >
      {/* Indicador visual de base de datos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <Database className="w-4 h-4 text-cyan-500" />
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Log de Operaciones</h3>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Filtrar registros..." 
              className="w-full sm:w-56 pl-10 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-cyan-500/30 focus:bg-white/[0.06] transition-all text-white placeholder:text-slate-700"
            />
          </div>
          <button className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-500 hover:text-white hover:border-white/10 transition-all group">
            <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <AnimatePresence mode='popLayout'>
          {filteredExpenses.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/5"
            >
              <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-6 h-6 text-slate-700" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">Base de datos vacía</p>
              <p className="text-[9px] text-slate-700 mt-2 uppercase tracking-widest">Sin registros detectados en este nodo</p>
            </motion.div>
          ) : (
            filteredExpenses.map((expense, index) => (
              <motion.div 
                layout
                key={expense.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-5 relative z-10">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border shadow-lg",
                    CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.other
                  )}>
                    {CATEGORY_ICONS[expense.category] || <Box className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight mb-1">
                      {expense.description}
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <Clock className="w-3 h-3 opacity-50" />
                        {new Date(expense.date).toLocaleDateString('es-ES', { 
                          day: '2-digit',
                          month: 'short'
                        })}
                      </div>
                      <span className="w-1 h-1 bg-slate-800 rounded-full" />
                      <span className="text-[10px] font-semibold text-cyan-500/80 capitalize">
                        {expense.category}
                      </span>
                    </div>
                    {/* Nueva etiqueta de autor */}
                    <p className="text-[9px] font-bold text-slate-600 mt-1 uppercase tracking-tighter">
                      Hecho por: <span className="text-slate-400">{expense.user_id === user.id ? 'Tí (Mí Nodo)' : expense.user_id.split('-')[0]}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 relative z-10">
                  <span className={cn(
                    "font-mono font-bold text-base tracking-tighter tabular-nums transition-all group-hover:scale-110",
                    expense.type === 'income' 
                      ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
                      : "text-white"
                  )}>
                    {expense.type === 'income' ? '+' : '-'}
                    {formatCurrency(expense.amount)}
                  </span>
                  
                  <button 
                    onClick={() => deleteExpense(expense.id)}
                    className="p-2.5 text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Resplandor lateral de hover */}
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">
        <span>Sincronización de Nodos: OK</span>
        <span className="text-cyan-500/20">Data Stream Active</span>
      </div>
    </motion.div>
  );
};
