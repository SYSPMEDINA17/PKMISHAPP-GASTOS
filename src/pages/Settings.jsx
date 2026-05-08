import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Palette, 
  Database, 
  LogOut,
  ChevronRight,
  Zap,
  Terminal,
  Cpu,
  Fingerprint,
  Layers,
  Activity
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { cn } from '../lib/utils';

const SettingsCard = ({ id, icon: Icon, title, description, active = false, onClick }) => (
  <button 
    onClick={() => onClick(id)}
    className={cn(
      "w-full p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center gap-6 text-left transition-all duration-300 group relative overflow-hidden",
      active ? "bg-white/[0.05] border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.05)]" : "hover:bg-white/[0.04] hover:border-white/10"
    )}
  >
    {active && (
      <motion.div 
        layoutId="activeGlow"
        className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"
      />
    )}
    <div className={cn(
      "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500",
      active 
        ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
        : "bg-white/[0.02] border-white/5 text-slate-500 group-hover:text-slate-300 group-hover:scale-110"
    )}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
        {description}
      </p>
    </div>
    <ChevronRight className={cn(
      "w-5 h-5 transition-all duration-300",
      active ? "text-cyan-400 translate-x-0" : "text-slate-700 -translate-x-2 group-hover:translate-x-0 group-hover:text-slate-400"
    )} />
  </button>
);

const Settings = () => {
  const { user, householdId, signOut, theme, toggleTheme, members } = useExpenses();
  const [activeTab, setActiveTab] = useState('appearance');

  const sections = [
    { id: 'profile', icon: User, title: 'Identidad de Usuario', desc: 'Sincronización de perfil y bio-datos' },
    { id: 'security', icon: Shield, title: 'Protocolos de Seguridad', desc: 'Encriptación de punto a punto y accesos' },
    { id: 'appearance', icon: Palette, title: 'Interfaz Visual', desc: 'Personalización de la matriz estética' },
    { id: 'node', icon: Database, title: 'Configuración de Nodo', desc: 'Gestión de Household y redes' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-10">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white dark:text-white text-slate-900 uppercase tracking-widest">Modo de Energía</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Alternar entre espectro claro y oscuro</p>
              </div>
              <button 
                onClick={toggleTheme}
                className="relative w-16 h-8 bg-black/5 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 rounded-full p-1 transition-all"
              >
                <motion.div 
                  animate={{ x: theme === 'dark' ? 32 : 0 }}
                  className="w-6 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center justify-center text-white"
                >
                  <Zap className="w-3 h-3" />
                </motion.div>
              </button>
            </div>
            
            <div className="h-px bg-black/5 dark:bg-white/5" />

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Densidad de la Matriz</h4>
              <div className="flex gap-2">
                 {['Compacto', 'Balanceado', 'Expandido'].map((mode) => (
                   <button 
                    key={mode}
                    className={cn(
                      "flex-1 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all",
                      mode === 'Balanceado' 
                        ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.1)]" 
                        : "bg-white/[0.02] border-white/5 text-slate-500 hover:border-white/10"
                    )}
                   >
                     {mode}
                   </button>
                 ))}
              </div>
            </div>

            <div className="h-px bg-black/5 dark:bg-white/5" />

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white dark:text-white text-slate-900 uppercase tracking-widest">Efecto Glass-Ice</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Transparencia avanzada en superficies</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-10 h-6 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center px-1">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)] ml-auto" />
                 </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px]">
                <div className="w-full h-full rounded-2xl bg-[#020617] flex items-center justify-center">
                  <Fingerprint className="w-10 h-10 text-cyan-400" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-black text-white uppercase tracking-tighter">{user?.email?.split('@')[0]}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                   <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded-md border border-emerald-500/20">Operador Senior</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Última Conexión</p>
                  <p className="text-[10px] font-mono text-white">{new Date().toLocaleString()}</p>
               </div>
               <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">ID Único de Nodo</p>
                  <p className="text-[10px] font-mono text-white">{user?.id?.split('-')[0]}</p>
               </div>
            </div>
          </div>
        );
      case 'node':
        return (
          <div className="space-y-8">
            <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-3xl">
               <div className="flex items-center gap-3 mb-4">
                  <Layers className="w-4 h-4 text-cyan-500" />
                  <h4 className="text-xs font-black text-white uppercase tracking-widest">Nodo de Hogar Activo</h4>
               </div>
               <p className="text-[11px] font-mono text-cyan-500/80 mb-2 break-all">{householdId || 'Buscando señal...'}</p>
               <div className="flex items-center gap-2">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Sincronización Estable</span>
               </div>
            </div>
            <div>
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 ml-2">Miembros Conectados</h4>
               <div className="space-y-2">
                  {members.map((m, i) => (
                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">UID: {m.user_id.split('-')[0]}</span>
                       </div>
                       <span className="text-[8px] font-black text-slate-600 uppercase">En Línea</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="py-20 text-center">
             <Cpu className="w-12 h-12 text-slate-800 mx-auto mb-4" />
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Subsistema encriptado o en mantenimiento</p>
          </div>
        );
    }
  };

  return (
    <div className="pt-4 md:pt-8 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-slate-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tighter uppercase">Configuración</h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-13">Ajustes operacionales del núcleo del sistema</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-4">
             {sections.map((sec, i) => (
               <motion.div
                 key={sec.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
               >
                 <SettingsCard {...sec} active={activeTab === sec.id} onClick={setActiveTab} />
               </motion.div>
             ))}
          </div>

          <div className="lg:col-span-2 space-y-8">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-10 bg-slate-950/40 backdrop-blur-xl rounded-[40px] border border-white/5 relative overflow-hidden min-h-[500px]"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                
                <div className="flex items-center gap-4 mb-10">
                   {React.createElement(sections.find(s => s.id === activeTab)?.icon || Palette, {
                     className: "w-5 h-5 text-cyan-400"
                   })}
                   <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">
                     {sections.find(s => s.id === activeTab)?.title}
                   </h2>
                </div>

                {renderContent()}
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[32px] flex items-center justify-between group"
             >
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                      <LogOut className="w-5 h-5" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-rose-500 uppercase tracking-widest">Desconectar Sistema</h4>
                      <p className="text-[10px] text-rose-500/60 font-bold uppercase mt-0.5">Terminar sesión segura en este nodo</p>
                   </div>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="px-6 py-3 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                >
                   Cerrar Sesión
                </button>
             </motion.div>
          </div>
        </div>

        <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-3">
              <Terminal className="w-4 h-4 text-slate-700" />
              <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em]">PKMISHAPP Kernel v3.4.1 (Stable Build)</p>
           </div>
           <div className="flex items-center gap-6">
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Uptime: 100%</span>
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Sync: Normal</span>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default Settings;
