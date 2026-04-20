import React from 'react';
import { Sun, Moon, Bell, Search, User, LogOut, Shield, Menu, X } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { motion } from 'framer-motion';

export const Navbar = ({ onProfileClick, toggleSidebar, isSidebarCollapsed }) => {
  const { theme, toggleTheme, signOut, user } = useExpenses();

  return (
    <nav className="fixed top-0 right-0 left-0 bg-[#020617]/40 backdrop-blur-2xl border-b border-white/5 h-20 flex items-center justify-between px-4 md:px-8 z-40 transition-all duration-500 ml-0 md:ml-20">

      {/* Botón Menú Móvil */}
      <button 
        onClick={toggleSidebar}
        className="p-3 mr-2 bg-white/[0.02] border border-white/5 rounded-2xl md:hidden text-slate-400 hover:text-white transition-all"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* HUD Central de Búsqueda - Oculto en móviles muy pequeños para ahorrar espacio */}
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <div className="absolute inset-0 bg-cyan-500/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl" />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Escanear..." 
            className="w-full pl-12 pr-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl focus:border-cyan-500/30 text-[10px] font-bold uppercase tracking-[0.2em] outline-none transition-all text-white placeholder:text-slate-700"
          />
        </div>
      </div>


      {/* Controles de Sistema y Usuario */}
      <div className="flex items-center gap-4">
        
        {/* Status Indicators */}
        <div className="hidden lg:flex items-center gap-6 mr-6 px-6 border-r border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">En Línea</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-3 h-3 text-cyan-500" />
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">SSL: OK</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all text-slate-500 hover:text-cyan-400 group relative"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button 
            onClick={() => signOut()}
            className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/20 hover:bg-rose-500/5 transition-all text-slate-500 hover:text-rose-500 group relative"
            title="Desconectar"
          >
            <LogOut className="w-4 h-4" />
            <div className="absolute inset-0 bg-rose-500/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Perfil de Usuario Premium */}
        <div className="flex items-center gap-4 ml-4 pl-6 border-l border-white/5">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black uppercase tracking-[0.15em] text-white leading-tight">
              {user?.email?.split('@')[0]}
            </p>
            <p className="text-[8px] text-cyan-500/70 font-bold uppercase tracking-[0.2em] mt-1">Terminal Activa</p>
          </div>
          <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border border-black/20">
              <User className="w-5 h-5 text-white/50" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full" />
          </div>
        </div>
      </div>
    </nav>
  );
};
