import React, { useState } from 'react';
import { Target, Edit2, Check, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency, cn } from '../lib/utils';

const CATEGORIES = [
  { id: 'food', label: 'Comida y Restaurantes', icon: '🍔' },
  { id: 'transport', label: 'Transporte', icon: '🚗' },
  { id: 'home', label: 'Hogar y Servicios', icon: '🏠' },
  { id: 'entertainment', label: 'Entretenimiento', icon: '🎮' },
  { id: 'shopping', label: 'Compras', icon: '🛍️' },
  { id: 'health', label: 'Salud', icon: '🏥' },
  { id: 'other', label: 'Otros', icon: '📦' },
];

const BudgetCard = ({ category, spent, budget, onEdit }) => {
  const percent = budget > 0 ? (spent / budget) * 100 : 0;
  
  const getProgressColor = () => {
    if (percent >= 100) return 'bg-rose-500';
    if (percent >= 80) return 'bg-amber-500';
    return 'bg-primary-500';
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.icon}</span>
          <div>
            <h4 className="text-sm font-bold dark:text-white">{category.label}</h4>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              {formatCurrency(spent)} de {formatCurrency(budget)}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onEdit(category)}
          className="p-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-primary-500 transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={cn("absolute left-0 top-0 h-full transition-all duration-500", getProgressColor())}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        <span className={cn(
          "text-[10px] font-bold",
          percent >= 100 ? "text-rose-500" : percent >= 80 ? "text-amber-500" : "text-slate-400"
        )}>
          {percent.toFixed(0)}% utilizado
        </span>
        {budget > 0 && spent > budget && (
          <span className="text-[10px] font-bold text-rose-500 animate-pulse">
            ¡Excedido!
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
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-xl text-primary-500">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold dark:text-white">Presupuestos Mensuales</h3>
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {CATEGORIES.map(cat => {
          const budget = budgets[`${filters.month}-${cat.id}`] || 0;
          const spent = expensesByCategory[cat.id] || 0;

          if (editingCategory === cat.id) {
            return (
              <div key={cat.id} className="bg-primary-50/50 dark:bg-primary-500/5 p-4 rounded-2xl border-2 border-primary-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-sm font-bold dark:text-white">{cat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">S/</span>
                    <input
                      autoFocus
                      type="number"
                      value={tempAmount}
                      onChange={(e) => setTempAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                    />
                  </div>
                  <button onClick={handleSave} className="p-2 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingCategory(null)} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
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

        {Object.values(budgets).every(v => v === 0) && (
          <div className="text-center py-8 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
            <p className="text-sm text-slate-500 dark:text-slate-400">No hay presupuestos definidos.</p>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Haz clic en editar para empezar</p>
          </div>
        )}
      </div>
    </div>
  );
};
