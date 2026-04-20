import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { SummaryCards } from '../components/SummaryCards';
import { ExpenseChart } from '../components/ExpenseChart';
import { TransactionList } from '../components/TransactionList';
import { HouseholdBalance } from '../components/HouseholdBalance';
import { SavingsGoals } from '../components/SavingsGoals';
import { ReportGenerator } from '../components/ReportGenerator';
import { AddExpenseModal } from '../components/AddExpenseModal';
import { Filters } from '../components/Filters';
import { BudgetManager } from '../components/BudgetManager';
import { motion } from 'framer-motion';

export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="pt-4 md:pt-8 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Panel Financiero</h1>
            <p className="text-sm text-slate-500 mt-1">Gestiona tus ingresos y gastos con tu equipo.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95 hover:bg-cyan-500 hover:text-white"
          >
            <Plus className="w-5 h-5" />
            Nueva Transacción
          </button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between"
        >
          <div className="flex-1 w-full">
            <Filters />
          </div>
          <ReportGenerator />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SummaryCards />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <motion.div 
            className="xl:col-span-2 space-y-6 md:space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ExpenseChart />
            <TransactionList />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6 md:space-y-8"
          >
            <HouseholdBalance />
            <SavingsGoals />
            <BudgetManager />
          </motion.div>
        </div>
      </div>

      <AddExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center lg:hidden z-30 hover:scale-110 active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
