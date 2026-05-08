import React from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  Palette, 
  Database, 
  Bell, 
  Smartphone, 
  Globe,
  LogOut,
  ChevronRight,
  Zap,
  Terminal
} from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { cn } from '../lib/utils';

const SettingsCard = ({ icon: Icon, title, description, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center gap-6 text-left transition-all duration-300 group",
      active ? "bg-white/[0.05] border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.05)]" : "hover:bg-white/[0.04] hover:border-white/10"
    )}
  >
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
  const { user, signOut, theme, toggleTheme } = useExpenses();

  const sections = [
    { id: 'profile', icon: User, title: 'Identidad de Usuario', desc: 'Sincronización de perfil y bio-datos' },
    { id: 'security', icon: Shield, title: 'Protocolos de Seguridad', desc: 'Encriptación de punto a punto y accesos' },
    { id: 'appearance', icon: Palette, title: 'Interfaz Visual', desc: 'Personalización de la matriz estética' },
    { id: 'node', icon: Database, title: 'Configuración de Nodo', desc: 'Gestión de Household y redes' },
  ];

  return (
    <div className="pt-4 md:pt-8 pb-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center">
                <SettingsIcon className="w-6 h-6 text-slate-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">Configuración</h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] ml-13">Ajustes operacionales del núcleo del sistema</p>
          </div>
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center">
                   <User className="w-4 h-4 text-cyan-400" />
                </div>
             </div>
             <div>
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{user?.email}</p>
                <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1">
                   <div className="w-1 h-1 rounded-full bg-emerald-500" /> Autenticado
                </p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Columna de Navegación de Ajustes */}
          <div className="lg:col-span-1 space-y-4">
             {sections.map((sec, i) => (
               <motion.div
                 key={sec.id}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: i * 0.1 }}
               >
                 <SettingsCard {...sec} active={sec.id === 'appearance'} />
               </motion.div>
             ))}
          </div>

          {/* Columna de Detalle (Active: Appearance por defecto) */}
          <div className="lg:col-span-2 space-y-8">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="p-10 bg-slate-950/40 backdrop-blur-xl rounded-[40px] border border-white/5 relative overflow-hidden"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                
                <div className="flex items-center gap-4 mb-10">
                   <Palette className="w-5 h-5 text-cyan-400" />
                   <h2 className="text-xl font-black text-white uppercase tracking-[0.2em]">Interfaz Visual</h2>
                </div>

                <div className="space-y-10">
                   {/* Theme Toggle */}
                   <div className="flex items-center justify-between">
                      <div>
                         <h4 className="text-sm font-bold text-white uppercase tracking-widest">Modo de Energía</h4>
                         <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Alternar entre espectro claro y oscuro</p>
                      </div>
                      <button 
                        onClick={toggleTheme}
                        className="relative w-16 h-8 bg-white/[0.05] border border-white/10 rounded-full p-1 transition-all"
                      >
                         <motion.div 
                           animate={{ x: theme === 'dark' ? 32 : 0 }}
                           className="w-6 h-6 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] flex items-center justify-center text-white"
                         >
                            <Zap className="w-3 h-3" />
                         </motion.div>
                      </button>
                   </div>

                   <div className="h-px bg-white/5" />

                   {/* Language */}
                   <div className="flex items-center justify-between">
                      <div>
                         <h4 className="text-sm font-bold text-white uppercase tracking-widest">Idioma del Sistema</h4>
                         <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Localización de la terminal activa</p>
                      </div>
                      <select className="bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase outline-none">
                         <option>Español (ES)</option>
                         <option>English (US)</option>
                      </select>
                   </div>

                   <div className="h-px bg-white/5" />

                   {/* Notifications */}
                   <div className="flex items-center justify-between">
                      <div>
                         <h4 className="text-sm font-bold text-white uppercase tracking-widest">Notificaciones HUD</h4>
                         <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Alertas en tiempo real sobre transacciones</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Activado</span>
                      </div>
                   </div>
                </div>
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

        {/* Footer info */}
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
