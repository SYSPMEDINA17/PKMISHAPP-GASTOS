import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Database,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { cn, formatCurrency } from '../lib/utils';
import { AddExpenseModal } from '../components/AddExpenseModal';

const Records = () => {
  const { expenses, deleteExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleEdit = (expense) => {
    setEditData(expense);
    setIsModalOpen(true);
  };

  const filteredRecords = useMemo(() => {
    return expenses.filter(record => {
      const matchesSearch = record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || record.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [expenses, searchTerm, filterType]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="pt-4 md:pt-8 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <History className="w-6 h-6 text-indigo-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Libro de Registros</h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-13">Historial completo de operaciones en la red</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/[0.05] text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/[0.1] transition-all border border-white/5">
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </header>

        <div className="bg-slate-950/40 backdrop-blur-xl rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
          {/* Barra de Herramientas */}
          <div className="p-8 border-b border-white/5 flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:max-w-md group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input 
                  type="text" 
                  placeholder="Escanear descripción o categoría..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[11px] font-bold uppercase tracking-widest outline-none text-white focus:border-cyan-500/30 transition-all placeholder:text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
               <div className="flex bg-white/[0.02] border border-white/5 p-1 rounded-2xl shrink-0">
                  {['all', 'income', 'expense'].map((type) => (
                    <button
                      key={type}
                      onClick={() => { setFilterType(type); setCurrentPage(1); }}
                      className={cn(
                        "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        filterType === type 
                          ? "bg-white text-black shadow-lg" 
                          : "text-slate-500 hover:text-slate-300"
                      )}
                    >
                      {type === 'all' ? 'Todo' : type === 'income' ? 'Entradas' : 'Salidas'}
                    </button>
                  ))}
               </div>
               <div className="h-8 w-px bg-white/5 hidden lg:block" />
               <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-2xl shrink-0">
                  <Database className="w-3.5 h-3.5 text-cyan-500" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registros: {filteredRecords.length}</span>
               </div>
            </div>
          </div>

          {/* Tabla Desktop / Cards Mobile */}
          <div className="w-full">
            {/* Vista Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operación</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Tipo</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Categoría</th>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Timestamp</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Monto</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  <AnimatePresence mode="popLayout">
                    {currentRecords.map((record, index) => (
                      <motion.tr 
                        key={record.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="group hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white tracking-tight">{record.description}</span>
                            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">ID: {record.id.split('-')[0]}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border",
                            record.type === 'income' 
                              ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500" 
                              : "bg-rose-500/5 border-rose-500/10 text-rose-500"
                          )}>
                            {record.type === 'income' ? <ArrowUpCircle className="w-3 h-3" /> : <ArrowDownCircle className="w-3 h-3" />}
                            <span className="text-[9px] font-black uppercase tracking-widest">
                              {record.type === 'income' ? 'Inyección' : 'Fuga'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">{record.category}</td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                            <Clock className="w-3 h-3 opacity-30" />
                            {record.date}
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={cn(
                            "text-base font-black tracking-tighter tabular-nums",
                            record.type === 'income' ? "text-emerald-400" : "text-white"
                          )}>
                            {record.type === 'income' ? '+' : '-'} {formatCurrency(record.amount)}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(record)}
                              className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteExpense(record.id)}
                              className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Vista Mobile */}
            <div className="md:hidden divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {currentRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className="p-6 flex flex-col gap-4 active:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest mb-1",
                          record.type === 'income' 
                            ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500" 
                            : "bg-rose-500/5 border-rose-500/10 text-rose-500"
                        )}>
                          {record.type === 'income' ? 'Inyección' : 'Fuga'}
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-tight">{record.description}</h4>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          <span className="text-cyan-500/50">{record.category}</span>
                          <span className="w-1 h-1 bg-slate-800 rounded-full" />
                          <span className="flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 opacity-30" />
                            {record.date}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={cn(
                          "text-lg font-black tracking-tighter tabular-nums",
                          record.type === 'income' ? "text-emerald-400" : "text-white"
                        )}>
                          {record.type === 'income' ? '+' : '-'} {formatCurrency(record.amount)}
                        </div>
                        <p className="text-[8px] text-slate-700 font-bold uppercase tracking-tighter mt-1">ID: {record.id.split('-')[0]}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <button 
                        onClick={() => handleEdit(record)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 active:text-cyan-400 active:bg-cyan-500/5 active:border-cyan-500/20 transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Editar
                      </button>
                      <button 
                        onClick={() => deleteExpense(record.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 active:text-rose-500 active:bg-rose-500/5 active:border-rose-500/20 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Eliminar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {currentRecords.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center">
                 <div className="w-16 h-16 bg-white/[0.02] rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                    <Search className="w-8 h-8 text-slate-800" />
                 </div>
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Sin coincidencias detectadas</p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="p-8 border-t border-white/5 flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
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

export default Records;
