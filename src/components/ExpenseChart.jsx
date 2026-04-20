import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { Activity, BarChart3, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Día {label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: entry.color }}>
                {entry.name === 'income' ? 'Ingreso' : 'Gasto'}
              </span>
              <span className="text-sm font-mono font-bold text-white tracking-tighter">
                ${entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ExpenseChart = () => {
  const { filteredExpenses, filters, loading } = useExpenses();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [year, month] = filters.month.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  
  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${filters.month}-${day.toString().padStart(2, '0')}`;
    const dayExpenses = filteredExpenses
      .filter(e => e.date === dateStr && e.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const dayIncome = filteredExpenses
      .filter(e => e.date === dateStr && e.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    return {
      name: day.toString(),
      expense: dayExpenses,
      income: dayIncome,
    };
  });

  const monthName = new Date(year, month - 1).toLocaleDateString('es-ES', { month: 'long' });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 shadow-2xl min-h-[440px] flex flex-col relative overflow-hidden group"
    >
      {/* Luz de fondo sutil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px]" />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-cyan-500 animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Monitoreo de Flujos</h3>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-6">
            Ciclo Operativo: {monthName} {year}
          </p>
        </div>
        
        <div className="flex items-center gap-6 p-2 bg-white/[0.02] border border-white/5 rounded-2xl px-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ingresos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gastos</span>
          </div>
        </div>
      </div>

      <div className="w-full relative mt-2">
        {loading ? (
          <div className="h-[320px] flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.3)]"></div>
          </div>
        ) : mounted ? (
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height={320} minWidth={0}>
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#ffffff" opacity={0.03} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 9, fontWeight: 'bold' }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#475569', fontSize: 9, fontWeight: 'bold' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#34d399" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  animationDuration={1500}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#fb7185" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorExpense)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex justify-between items-center text-[9px] font-bold text-slate-700 uppercase tracking-[0.3em]">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-cyan-500" />
          Actualización en Tiempo Real
        </div>
        <span>Protocolo de Datos v2.0.26</span>
      </div>
    </motion.div>
  );
};
