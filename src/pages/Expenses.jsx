import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownCircle, TrendingDown, Plus, ShoppingCart, Zap, AlertCircle } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { PageTransactionList } from '../components/PageTransactionList';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { cn, formatCurrency } from '../lib/utils';

const Expenses = () => {
  const { totalExpenses, householdId } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const isInitializing = !householdId;

  const handleOpenModal = (data = null) => {
    if (isInitializing && !data) return;
    setEditData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-4 md:pt-8 pb-12 px-3 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 px-1">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <ArrowDownCircle className="w-5 h-5 md:w-6 md:h-6 text-rose-500" />
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase">Nodos de Salida</h1>
            </div>
            <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-13">Control de fugas de capital</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            disabled={isInitializing}
            className={cn(
              "w-full sm:w-auto group relative flex items-center justify-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all overflow-hidden",
              isInitializing 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-white text-black hover:scale-105 active:scale-95"
            )}
          >
            {!isInitializing && <div className="absolute inset-0 bg-rose-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />}
            <span className="relative z-10 group-hover:text-white flex items-center gap-2 transition-colors">
              <Plus className={cn("w-4 h-4 md:w-5 md:h-5", isInitializing ? "animate-pulse" : "")} />
              {isInitializing ? 'Inicializando hogar...' : 'Registrar Gasto'}
            </span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-[24px] md:rounded-[32px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingDown className="w-12 h-12 md:w-16 md:h-16 text-rose-500" />
            </div>
            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 md:mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Gastos Totales (Mes)
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
              {formatCurrency(totalExpenses)}
            </h3>
          </motion.div>

          {/* Placeholder cards for other stats */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-[24px] md:rounded-3xl flex items-center gap-4">
               <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
               </div>
               <div>
                  <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Categoría Dominante</p>
                  <p className="text-base md:text-lg font-bold text-white leading-tight">Pendiente</p>
               </div>
            </div>
            <div className="p-5 md:p-6 bg-white/[0.01] border border-white/5 rounded-[24px] md:rounded-3xl flex items-center gap-4">
               <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-slate-600" />
               </div>
               <div>
                  <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest">Alertas</p>
                  <p className="text-base md:text-lg font-bold text-white leading-tight">Sin Alertas</p>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/40 backdrop-blur-xl p-5 md:p-8 rounded-[32px] md:rounded-[40px] border border-white/5 shadow-2xl relative">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <Zap className="w-4 h-4 text-rose-500" />
            <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white">Log de Salidas Recientes</h3>
          </div>
          <PageTransactionList type="expense" onEdit={handleOpenModal} />
        </div>
      </div>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editData={editData}
      />
    </div>
  );
};

export default Expenses;
