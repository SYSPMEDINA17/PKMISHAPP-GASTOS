import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, DollarSign, Calendar, Tag, FileText, Zap } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { cn } from '../lib/utils';
import { CATEGORIES } from '../lib/constants.jsx';

export const AddExpenseModal = ({ isOpen, onClose, editData = null }) => {
  const { addExpense, updateExpense, householdId } = useExpenses();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const isInitializing = !householdId;

  useEffect(() => {
    if (editData) {
      setType(editData.type);
      setAmount(editData.amount.toString());
      setCategory(editData.category);
      setDescription(editData.description);
      setDate(editData.date);
    } else {
      setType('expense');
      setAmount('');
      setCategory(CATEGORIES[0].id);
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || isInitializing) return;

    const transactionData = {
      type,
      amount: parseFloat(amount),
      category,
      description: description || CATEGORIES.find(c => c.id === category).label,
      date,
    };

    if (editData) {
      updateExpense(editData.id, transactionData);
    } else {
      addExpense(transactionData);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#020617] border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[70] overflow-hidden"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                  {editData ? 'Editar Transacción' : 'Nueva Operación'}
                </h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">
                  {isInitializing ? 'Sincronizando nodo central...' : 'Conexión segura establecida'}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-2xl transition-all text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="flex bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest",
                    type === 'expense' 
                      ? "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <Minus className="w-4 h-4" /> Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest",
                    type === 'income' 
                      ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                      : "text-slate-500 hover:text-slate-300"
                  )}
                >
                  <Plus className="w-4 h-4" /> Ingreso
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Monto de Operación</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-14 pr-6 py-5 bg-white/[0.03] border border-white/5 focus:border-cyan-500/30 rounded-2xl outline-none text-3xl font-black transition-all text-white placeholder:text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Clasificación</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 focus:border-cyan-500/30 rounded-2xl outline-none transition-all text-white text-[11px] font-bold uppercase tracking-widest appearance-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#020617] text-white">{cat.emoji} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Timestamp</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 focus:border-cyan-500/30 rounded-2xl outline-none transition-all text-white text-[11px] font-bold uppercase tracking-widest"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Detalle de Operación</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-5 w-4 h-4 text-slate-600" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descripción del flujo de datos..."
                    rows="2"
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 focus:border-cyan-500/30 rounded-2xl outline-none transition-all text-white text-[11px] font-bold uppercase tracking-widest resize-none placeholder:text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isInitializing}
                className={cn(
                  "w-full group relative py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] shadow-xl transition-all overflow-hidden",
                  isInitializing 
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50" 
                    : "bg-white text-black hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {!isInitializing && <div className="absolute inset-0 bg-cyan-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />}
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center justify-center gap-3">
                  <Zap className={cn("w-4 h-4", isInitializing ? "animate-pulse" : "")} />
                  {isInitializing ? 'Inicializando hogar...' : (editData ? 'Actualizar Registro' : 'Confirmar Operación')}
                </span>
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
