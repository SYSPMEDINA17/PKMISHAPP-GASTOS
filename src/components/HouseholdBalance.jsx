import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { formatCurrency } from '../lib/utils';

export const HouseholdBalance = () => {
  const { filteredExpenses, members, user } = useExpenses();

  const balanceData = useMemo(() => {
    // 1. Solo contar gastos (no ingresos) para el balance compartido
    const expensesOnly = filteredExpenses.filter(e => e.type === 'expense');
    const totalSpent = expensesOnly.reduce((acc, curr) => acc + curr.amount, 0);
    const numMembers = members.length || 1;
    const fairShare = totalSpent / numMembers;

    // 2. Calcular cuánto aportó cada usuario
    const contributions = {};
    members.forEach(m => contributions[m.user_id] = 0);
    expensesOnly.forEach(e => {
      contributions[e.user_id] = (contributions[e.user_id] || 0) + e.amount;
    });

    // 3. Calcular balance final
    return Object.entries(contributions).map(([userId, spent]) => ({
      userId,
      spent,
      balance: spent - fairShare,
      isMe: userId === user?.id
    }));
  }, [filteredExpenses, members, user]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Balance del Nodo</h3>
        </div>
        <div className="p-2 bg-white/[0.03] rounded-xl">
          <Info className="w-3.5 h-3.5 text-slate-600" />
        </div>
      </div>

      <div className="space-y-4">
        {balanceData.map((data) => (
          <div 
            key={data.userId}
            className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border ${data.balance >= 0 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-rose-500/30 bg-rose-500/10 text-rose-400'}`}>
                {data.userId.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[11px] font-bold text-white uppercase tracking-wider">
                  {data.isMe ? 'Tú (Mí Nodo)' : `Usuario ${data.userId.split('-')[0]}`}
                </p>
                <p className="text-[9px] text-slate-500 uppercase tracking-tighter">Aportó: {formatCurrency(data.spent)}</p>
              </div>
            </div>

            <div className="text-right">
              <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${data.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {data.balance >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {data.balance >= 0 ? '+' : ''}{formatCurrency(data.balance)}
              </div>
              <p className="text-[8px] text-slate-600 uppercase font-black tracking-widest mt-1">
                {data.balance >= 0 ? 'A RECIBIR' : 'DEBE'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5">
        <p className="text-[9px] text-slate-600 uppercase text-center tracking-widest leading-relaxed">
          Basado en un gasto total de <span className="text-white font-bold">{formatCurrency(balanceData.reduce((a,b) => a + b.spent, 0))}</span> dividido entre <span className="text-white font-bold">{members.length}</span> miembros.
        </p>
      </div>
    </motion.div>
  );
};
