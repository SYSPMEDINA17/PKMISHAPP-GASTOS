import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { Activity, PieChart as PieChartIcon, TrendingUp, BarChart3, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, formatCurrency } from '../lib/utils';

const CATEGORY_COLORS_MAP = {
  food: "#fb923c",
  transport: "#60a5fa",
  home: "#818cf8",
  entertainment: "#a78bfa",
  shopping: "#f472b6",
  health: "#fb7185",
  salary: "#34d399",
  other: "#94a3b8",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: entry.color }}>
                {entry.name === 'income' ? 'Ingreso' : entry.name === 'expense' ? 'Gasto' : entry.name}
              </span>
              <span className="text-sm font-mono font-bold text-white tracking-tighter">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const { filteredExpenses, filters, totalIncome, totalExpenses, totalBalance } = useExpenses();
  
  // Data for Area Chart (Trend)
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

  // Data for Pie Chart (Categories)
  const categoryData = filteredExpenses
    .filter(exp => exp.type === 'expense')
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  return (
    <div className="pt-4 md:pt-8 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <PieChartIcon className="w-6 h-6 text-cyan-500" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Inteligencia Analítica</h1>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-13">Procesamiento de métricas financieras de alto nivel</p>
        </header>

        {/* Resumen de KPI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Balance Neto', value: totalBalance, color: totalBalance >= 0 ? 'text-cyan-400' : 'text-rose-400', icon: TrendingUp },
            { label: 'Entradas Totales', value: totalIncome, color: 'text-emerald-400', icon: ArrowUpRight },
            { label: 'Salidas Totales', value: totalExpenses, color: 'text-rose-400', icon: ArrowDownRight },
          ].map((kpi, i) => (
            <motion.div 
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <kpi.icon className="w-12 h-12 text-white" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{kpi.label}</p>
              <h3 className={cn("text-3xl font-black tracking-tighter", kpi.color)}>
                {formatCurrency(kpi.value)}
              </h3>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Tendencia Mensual */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-cyan-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white">Flujo Operativo</h3>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fb7185" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.05} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" stroke="#34d399" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                  <Area type="monotone" dataKey="expense" stroke="#fb7185" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Gráfico de Distribución por Categorías */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <PieChartIcon className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white">Distribución de Recursos</h3>
              </div>
            </div>
            <div className="h-[300px] w-full flex items-center justify-center">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CATEGORY_COLORS_MAP[entry.name] || "#94a3b8"} stroke="rgba(255,255,255,0.05)" />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-700">Sin datos de gastos</p>
                </div>
              )}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
               {categoryData.map((entry) => (
                 <div key={entry.name} className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS_MAP[entry.name] }} />
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{entry.name}: {formatCurrency(entry.value)}</span>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>

        {/* Sección de Resumen Operativo */}
        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[40px]">
           <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-4 h-4 text-cyan-500" />
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white">Eficiencia de Capital</h3>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Ratio Ahorro', value: totalIncome > 0 ? `${((totalBalance / totalIncome) * 100).toFixed(1)}%` : '0%' },
                { label: 'Gasto Diario Prom.', value: formatCurrency(totalExpenses / 30) },
                { label: 'Confianza de Red', value: '99.9%' },
                { label: 'Estado', value: totalBalance >= 0 ? 'Surplus' : 'Déficit' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-white">{stat.stat || stat.value}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
