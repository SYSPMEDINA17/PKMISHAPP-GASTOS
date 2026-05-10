import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Search, 
  Filter, 
  Clock,
  Database
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { cn, formatCurrency } from '../lib/utils';
import { CATEGORY_MAP } from '../lib/constants.jsx';

export const TransactionList = () => {
  const { filteredExpenses, deleteExpense, user } = useExpenses();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-950/40 backdrop-blur-xl p-5 md:p-8 rounded-[24px] md:rounded-[32px] border border-white/5 shadow-2xl overflow-hidden relative"
    >
      {/* Indicador visual de base de datos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 md:mb-10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 shrink-0 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <Database className="w-4 h-4 text-cyan-500" />
          </div>
          <div>
            <h3 className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-white">Log de Operaciones</h3>
            <p className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Stream de datos en tiempo real</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full sm:w-56 pl-10 pr-4 py-3 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-cyan-500/30 focus:bg-white/[0.06] transition-all text-white placeholder:text-slate-700"
            />
          </div>
          <button className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-500 hover:text-white hover:border-white/10 transition-all group">
            <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4 max-h-[500px] overflow-y-auto pr-1 md:pr-3 custom-scrollbar">
        <AnimatePresence mode='popLayout'>
          {filteredExpenses.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 bg-white/[0.01] rounded-3xl border border-dashed border-white/5"
            >
              <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                <Search className="w-6 h-6 text-slate-800" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-black">Sin registros</p>
            </motion.div>
          ) : (
            filteredExpenses.map((expense, index) => {
              const categoryInfo = CATEGORY_MAP[expense.category] || CATEGORY_MAP.other;
              return (
                <motion.div 
                  layout
                  key={expense.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group relative flex items-center justify-between p-3 md:p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300"
                >
                  <div className="flex items-center gap-3 md:gap-5 relative z-10 flex-1 min-w-0">
                    <div className={cn(
                      "w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 border text-lg md:text-xl",
                      categoryInfo.bgColor,
                      categoryInfo.borderColor
                    )}>
                      {categoryInfo.emoji}
                    </div>
                    <div className="min-w-0 truncate">
                      <h4 className="text-[11px] md:text-sm font-bold text-white leading-tight mb-1 tracking-tight truncate">
                        {expense.description}
                      </h4>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-1 text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0">
                          <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 opacity-30" />
                          {new Date(expense.date).toLocaleDateString('es-ES', { 
                            day: '2-digit',
                            month: 'short'
                          })}
                        </div>
                        <span className="w-1 h-1 bg-slate-800 rounded-full shrink-0" />
                        <span className={cn("text-[8px] md:text-[10px] font-black uppercase tracking-widest truncate", categoryInfo.color)}>
                          {categoryInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 md:gap-6 relative z-10 ml-2">
                    <span className={cn(
                      "font-mono font-black text-sm md:text-base tracking-tighter tabular-nums transition-all group-hover:scale-110",
                      expense.type === 'income' 
                        ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]" 
                        : "text-white"
                    )}>
                      {expense.type === 'income' ? '+' : '-'}
                      {formatCurrency(expense.amount)}
                    </span>
                    
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="p-2 md:p-2.5 text-slate-800 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 md:opacity-0 group-hover:opacity-100 group-active:opacity-100 translate-x-2 group-hover:translate-x-0"
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                  </div>

                  {/* Resplandor lateral de hover */}
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 md:mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[7px] md:text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">
        <span>Sync: OK</span>
        <span className="text-cyan-500/20">Data Active</span>
      </div>
    </motion.div>
  );
};
