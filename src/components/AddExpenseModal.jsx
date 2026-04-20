import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { cn } from '../lib/utils';

const CATEGORIES = [
  { id: 'food', label: 'Comida y Restaurantes', icon: '🍔' },
  { id: 'transport', label: 'Transporte', icon: '🚗' },
  { id: 'home', label: 'Hogar y Servicios', icon: '🏠' },
  { id: 'entertainment', label: 'Entretenimiento', icon: '🎮' },
  { id: 'shopping', label: 'Compras', icon: '🛍️' },
  { id: 'health', label: 'Salud', icon: '🏥' },
  { id: 'salary', label: 'Salario', icon: '💰' },
  { id: 'other', label: 'Otros', icon: '📦' },
];

export const AddExpenseModal = ({ isOpen, onClose }) => {
  const { addExpense } = useExpenses();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return;

    addExpense({
      type,
      amount: parseFloat(amount),
      category,
      description: description || CATEGORIES.find(c => c.id === category).label,
      date,
    });

    // Reset and close
    setAmount('');
    setDescription('');
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
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold dark:text-white">Añadir Transacción</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                    type === 'expense' 
                      ? "bg-white dark:bg-slate-700 shadow-sm text-red-500 font-semibold" 
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  <Minus className="w-4 h-4" /> Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all",
                    type === 'income' 
                      ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-500 font-semibold" 
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  <Plus className="w-4 h-4" /> Ingreso
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">Monto</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 rounded-2xl outline-none text-2xl font-bold transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">Categoría</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 rounded-xl outline-none transition-all dark:text-white appearance-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">Fecha</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 rounded-xl outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">Descripción</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="¿En qué consistió?"
                    rows="2"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-primary-500 rounded-xl outline-none transition-all dark:text-white resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
              >
                Guardar Transacción
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
