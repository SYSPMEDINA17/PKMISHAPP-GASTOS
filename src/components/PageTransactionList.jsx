import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Edit3,
  Coffee, 
  Car, 
  Home, 
  Gamepad2, 
  ShoppingBag, 
  Stethoscope, 
  Banknote, 
  Box,
  Clock
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

export const PageTransactionList = ({ type, onEdit }) => {
  const { expenses, deleteExpense, user } = useExpenses();

  const filtered = expenses.filter(exp => exp.type === type);

  return (
    <div className="space-y-3">
      <AnimatePresence mode='popLayout'>
        {filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/[0.01] rounded-3xl border border-dashed border-white/5"
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">Sin registros tipo {type === 'income' ? 'entrada' : 'salida'}</p>
          </motion.div>
        ) : (
          filtered.map((expense, index) => (
            <motion.div 
              layout
              key={expense.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03 }}
              className="group relative flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-cyan-500/20 rounded-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center border",
                  CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.other
                )}>
                  {CATEGORY_ICONS[expense.category] || <Box className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-tight">
                    {expense.description}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">
                      {new Date(expense.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="w-1 h-1 bg-slate-800 rounded-full" />
                    <span className="text-[9px] font-bold text-cyan-500/60 uppercase">
                      {expense.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={cn(
                  "font-mono font-black text-sm tracking-tighter tabular-nums",
                  expense.type === 'income' ? "text-emerald-400" : "text-white"
                )}>
                  {expense.type === 'income' ? '+' : '-'}
                  {formatCurrency(expense.amount)}
                </span>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(expense)}
                    className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => deleteExpense(expense.id)}
                    className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};
