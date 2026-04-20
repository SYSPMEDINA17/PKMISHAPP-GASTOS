import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { cn, formatCurrency } from '../lib/utils';

const SummaryCard = ({ title, amount, icon: Icon, trend, colorType }) => {
  const colorVariants = {
    primary: "from-cyan-500 to-indigo-600 shadow-cyan-500/20 text-cyan-400 border-cyan-500/30",
    success: "from-emerald-500 to-teal-600 shadow-emerald-500/20 text-emerald-400 border-emerald-500/30",
    danger: "from-rose-500 to-red-600 shadow-rose-500/20 text-rose-400 border-rose-500/30"
  };

  const bgGlow = {
    primary: "bg-cyan-500/5",
    success: "bg-emerald-500/5",
    danger: "bg-rose-500/5"
  };

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn(
        "relative overflow-hidden p-6 rounded-[32px] border border-white/5 bg-slate-950/40 backdrop-blur-xl transition-all group",
        bgGlow[colorType]
      )}
    >
      <div className={cn(
        "absolute -right-8 -top-8 w-24 h-24 rounded-full blur-[60px] opacity-20 transition-opacity group-hover:opacity-40",
        colorType === 'primary' ? 'bg-cyan-500' : colorType === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
      )} />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={cn(
          "p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all",
          colorVariants[colorType].split(' ')[2]
        )}>
          <Icon className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
        </div>
        
        {trend && (
          <div className="flex flex-col items-end">
            <span className={cn(
              "text-[10px] font-bold px-2 py-1 rounded-lg uppercase border transition-all",
              trend > 0 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            )}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-2">
          <Activity className="w-3 h-3 opacity-30" />
          {title}
        </p>
        <h3 className="text-3xl font-bold tracking-tight text-white tabular-nums drop-shadow-sm">
          {formatCurrency(amount)}
        </h3>
      </div>

      <div className="mt-6 flex items-end gap-1 h-1 relative z-10">
        <div className={cn("h-full w-full rounded-full bg-slate-800 overflow-hidden")}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "65%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn("h-full bg-gradient-to-r shadow-[0_0_10px_rgba(0,0,0,0.5)]", colorVariants[colorType].split(' ').slice(0, 2).join(' '))}
          />
        </div>
      </div>
    </motion.div>
  );
};

export const SummaryCards = () => {
  const { totalBalance, totalIncome, totalExpenses } = useExpenses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard 
        title="Balance Patrimonial" 
        amount={totalBalance} 
        icon={Wallet} 
        colorType="primary"
      />
      <SummaryCard 
        title="Flujo Entrante" 
        amount={totalIncome} 
        icon={ArrowUpRight} 
        trend={12}
        colorType="success"
      />
      <SummaryCard 
        title="Flujo Saliente" 
        amount={totalExpenses} 
        icon={ArrowDownRight} 
        trend={-5}
        colorType="danger"
      />
    </div>
  );
};
