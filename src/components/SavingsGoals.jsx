import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Edit2, TrendingUp, Wallet, Save } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../lib/utils';

export const SavingsGoals = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useExpenses();
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target_amount: '', icon: '🎯' });
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target_amount) return;
    await addGoal({
      name: newGoal.name,
      target_amount: parseFloat(newGoal.target_amount),
      current_amount: 0,
      icon: newGoal.icon
    });
    setNewGoal({ name: '', target_amount: '', icon: '🎯' });
    setIsAdding(false);
  };

  const handleUpdateAmount = async (id, current, delta) => {
    await updateGoal(id, { current_amount: Math.max(0, current + delta) });
  };

  return (
    <div className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Metas de Ahorro</h3>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-white/[0.03] hover:bg-white/[0.1] rounded-xl transition-all"
        >
          <Plus className={`w-4 h-4 text-slate-400 transition-transform ${isAdding ? 'rotate-45' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAdd}
            className="space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text"
                placeholder="Nombre (ej: Viaje)"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-xs text-white outline-none focus:border-cyan-500/50"
              />
              <input 
                type="number"
                placeholder="Objetivo ($)"
                value={newGoal.target_amount}
                onChange={(e) => setNewGoal({...newGoal, target_amount: e.target.value})}
                className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-xs text-white outline-none focus:border-cyan-500/50"
              />
            </div>
            <button className="w-full py-3 bg-cyan-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-600 transition-all">
              Crear Meta
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {goals.length === 0 && !isAdding && (
          <p className="text-[10px] text-slate-600 uppercase text-center py-8 font-bold tracking-widest">No hay metas activas</p>
        )}
        {goals.map((goal) => {
          const progress = (goal.current_amount / goal.target_amount) * 100;
          return (
            <motion.div 
              layout
              key={goal.id}
              className="space-y-3 p-4 bg-white/[0.01] border border-white/5 rounded-2xl group"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{goal.icon}</span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">{goal.name}</h4>
                    <p className="text-[9px] text-slate-500 uppercase tracking-tighter">
                      {formatCurrency(goal.current_amount)} de {formatCurrency(goal.target_amount)}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => deleteGoal(goal.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 text-rose-500/50 hover:text-rose-500 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Barra de Progreso */}
              <div className="relative h-2 bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, progress)}%` }}
                  className={`absolute top-0 left-0 h-full rounded-full ${progress >= 100 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-cyan-500'}`}
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex gap-1">
                  {[50, 100, 500].map(amount => (
                    <button
                      key={amount}
                      onClick={() => handleUpdateAmount(goal.id, goal.current_amount, amount)}
                      className="px-2 py-1 bg-white/[0.03] hover:bg-white/[0.08] rounded-lg text-[8px] font-black text-slate-400 hover:text-white transition-all border border-white/5"
                    >
                      +{amount}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] font-mono font-bold text-cyan-400">
                  {Math.round(progress)}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
