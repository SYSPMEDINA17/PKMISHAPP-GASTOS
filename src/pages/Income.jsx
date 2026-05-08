import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpCircle, TrendingUp, Plus, Banknote, Calendar, Zap } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { PageTransactionList } from '../components/PageTransactionList';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { formatCurrency } from '../lib/utils';

const Income = () => {
  const { totalIncome } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleOpenModal = (data = null) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-4 md:pt-8 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ArrowUpCircle className="w-6 h-6 text-emerald-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Nodos de Entrada</h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-13">Monitoreo de flujo de capital entrante</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="w-full sm:w-auto group relative flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10 group-hover:text-white flex items-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              Inyectar Capital
            </span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <TrendingUp className="w-16 h-16 text-emerald-500" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Ingresos Totales (Mes)
            </div>
            <h3 className="text-4xl font-black text-white tracking-tighter">
              {formatCurrency(totalIncome)}
            </h3>
            <div className="mt-4 flex items-center gap-2">
               <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">Fase de Crecimiento</span>
            </div>
          </motion.div>

          {/* Placeholder cards for other stats */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-slate-600" />
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Mayor Inyección</p>
                  <p className="text-lg font-bold text-white leading-tight">Pendiente</p>
               </div>
            </div>
            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-slate-600" />
               </div>
               <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Próxima Fecha</p>
                  <p className="text-lg font-bold text-white leading-tight">---</p>
               </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 shadow-2xl relative">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-4 h-4 text-emerald-500" />
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white">Log de Entradas Recientes</h3>
          </div>
          <PageTransactionList type="income" onEdit={handleOpenModal} />
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

export default Income;
