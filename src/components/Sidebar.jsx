import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  History, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  PieChart,
  Zap,
  ShieldCheck,
  TrendingUp,
  User
} from 'lucide-react';
import { cn } from '../lib/utils';

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={cn(
      "relative flex items-center w-full p-3.5 my-1.5 rounded-2xl transition-all duration-300 group overflow-hidden",
      active 
        ? "text-white bg-white/5 shadow-[0_0_20px_rgba(34,211,238,0.1)]" 
        : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
    )}
  >
    {active && (
      <motion.div 
        layoutId="activeGlow"
        className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
      />
    )}

    <div className={cn(
      "flex items-center justify-center transition-transform group-active:scale-90",
      collapsed ? "w-full" : "w-8"
    )}>
      <Icon className={cn(
        "w-5 h-5 transition-colors duration-300",
        active ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" : "group-hover:text-slate-200"
      )} />
    </div>

    {!collapsed && (
      <motion.span 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "ml-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors",
          active ? "text-white" : "text-slate-500 group-hover:text-slate-200"
        )}
      >
        {label}
      </motion.span>
    )}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  </button>
);

export const Sidebar = ({ collapsed, setCollapsed, currentView, setCurrentView }) => {
  return (
    <>
      {/* Overlay para móviles */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-[#020617]/90 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 z-50 flex flex-col",
          collapsed ? "-translate-x-full md:translate-x-0 md:w-20" : "translate-x-0 w-72 shadow-2xl shadow-black/50"
        )}
      >
        {/* Botón de Colapso - Solo Desktop/Tablet */}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-900 border border-white/10 rounded-full hidden md:flex items-center justify-center text-slate-500 hover:text-white hover:border-cyan-500/50 transition-all z-40 group"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>

        <div className="flex flex-col h-full p-5 overflow-hidden">
          {/* Header Identidad PKMISHAPP */}
          <div className={cn(
            "flex items-center mb-12 px-2 transition-all duration-300",
            collapsed ? "justify-center" : "gap-4"
          )}>
            <div className="relative flex items-end gap-[2px] h-8 shrink-0">
              <div className="w-[3px] bg-slate-700 h-3" />
              <div className="w-[3px] bg-slate-500 h-5" />
              <div className="w-[3px] bg-white h-7 shadow-[0_0_10px_white]" />
              <TrendingUp className="absolute -top-1 -right-1.5 w-4 h-4 text-cyan-400" />
            </div>

            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-xl font-black tracking-tighter leading-none text-white">PKMISHAPP</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[8px] uppercase tracking-[0.3em] text-cyan-500 font-extrabold">Fin-Intelligence</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Navegación Principal */}
          <nav className="flex-1 space-y-1">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              active={currentView === 'dashboard'} 
              onClick={() => { setCurrentView('dashboard'); if (window.innerWidth < 768) setCollapsed(true); }}
              collapsed={collapsed} 
            />
            <SidebarItem 
              icon={User} 
              label="Mí Perfil" 
              active={currentView === 'profile'} 
              onClick={() => { setCurrentView('profile'); if (window.innerWidth < 768) setCollapsed(true); }}
              collapsed={collapsed} 
            />
            <SidebarItem icon={ArrowUpCircle} label="Entradas" collapsed={collapsed} />
            <SidebarItem icon={ArrowDownCircle} label="Salidas" collapsed={collapsed} />
            <SidebarItem icon={PieChart} label="Analytics" collapsed={collapsed} />
            <SidebarItem icon={History} label="Registros" collapsed={collapsed} />
          </nav>

          {/* Sección de Seguridad / Footer */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            {!collapsed && (
              <div className="px-3 mb-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span className="text-[8px] uppercase tracking-widest text-slate-400 font-bold">Modo Seguro</span>
                  </div>
                  <div className="w-full bg-slate-800 h-[2px] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                    />
                  </div>
                </div>
              </div>
            )}
            <SidebarItem icon={Settings} label="Ajustes" collapsed={collapsed} />
          </div>
        </div>
      </aside>
    </>
  );
};
