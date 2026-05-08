import React, { useState } from 'react';
import { Target, Edit2, Check, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, cn } from '../lib/utils';
import { CATEGORIES } from '../lib/constants.jsx';

const BudgetCard = ({ category, spent, budget, onEdit }) => {
  const percent = budget > 0 ? (spent / budget) * 100 : 0;
  
  const getProgressColor = () => {
    if (percent >= 100) return 'bg-rose-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-cyan-500';
  };

  return (
    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl hover:border-cyan-500/20 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.emoji}</span>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-tight">{category.label}</h4>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">
              {formatCurrency(spent)} / {formatCurrency(budget)}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onEdit(category)}
          className="p-2 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-cyan-400 transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={cn("absolute left-0 top-0 h-full transition-all duration-500", getProgressColor())}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        <span className={cn(
          "text-[8px] font-black uppercase tracking-widest",
          percent >= 100 ? "text-rose-500" : percent >= 80 ? "text-amber-500" : "text-slate-500"
        )}>
          {percent.toFixed(0)}% Capacidad
        </span>
        {budget > 0 && spent > budget && (
          <span className="text-[8px] font-black text-rose-500 animate-pulse uppercase tracking-widest">
            Fuga Detectada
          </span>
        )}
      </div>
    </div>
  );
};

export const BudgetManager = () => {
  const { filters, budgets, updateBudget, expensesByCategory } = useExpenses();
  const [editingCategory, setEditingCategory] = useState(null);
  const [tempAmount, setTempAmount] = useState('');

  const handleStartEdit = (cat) => {
    setEditingCategory(cat.id);
    setTempAmount(budgets[`${filters.month}-${cat.id}`] || '');
  };

  const handleSave = () => {
    updateBudget(filters.month, editingCategory, tempAmount);
    setEditingCategory(null);
  };

  return (
    <div className="bg-slate-950/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/5 shadow-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Presupuestos de Nodo</h3>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Control de límites operativos</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {CATEGORIES.map(cat => {
          const budget = budgets[`${filters.month}-${cat.id}`] || 0;
          const spent = expensesByCategory[cat.id] || 0;

          if (editingCategory === cat.id) {
            return (
              <div key={cat.id} className="bg-cyan-500/5 p-4 rounded-2xl border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-xs font-black text-white uppercase tracking-widest">{cat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50 text-xs font-bold">$</span>
                    <input
                      autoFocus
                      type="number"
                      value={tempAmount}
                      onChange={(e) => setTempAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-4 py-2.5 bg-[#020617] border border-white/10 rounded-xl text-sm outline-none focus:border-cyan-500/50 text-white font-mono"
                    />
                  </div>
                  <button onClick={handleSave} className="p-2.5 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 transition-all shadow-lg">
                    <Check className="w-4 h-4 font-black" />
                  </button>
                  <button onClick={() => setEditingCategory(null)} className="p-2.5 bg-white/[0.05] text-slate-400 rounded-xl hover:text-white transition-all border border-white/5">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          }

          return (
            <BudgetCard
              key={cat.id}
              category={cat}
              spent={spent}
              budget={budget}
              onEdit={handleStartEdit}
            />
          );
        })}
      </div>
    </div>
  );
};
