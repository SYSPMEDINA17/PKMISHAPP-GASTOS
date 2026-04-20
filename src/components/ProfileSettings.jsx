import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Zap, Mail, Save, LogOut, ChevronLeft, Fingerprint, Activity, Home, Copy, Check, LogIn } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { supabase } from '../lib/supabase';

export const ProfileSettings = ({ onBack }) => {
  const { user, signOut, householdId, joinHousehold } = useExpenses();
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(null);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name }
      });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Identidad actualizada en el nodo central.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!householdId) return;
    navigator.clipboard.writeText(householdId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinHousehold = async () => {
    if (!joinCode.trim()) return;
    if (joinCode === householdId) {
      setMessage({ type: 'error', text: 'Ya te encuentras en este nodo.' });
      return;
    }
    setLoading(true);
    try {
      await joinHousehold(joinCode.trim());
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Cabecera de Perfil */}
      <div className="flex items-center justify-between gap-4 mb-12">
        <button 
          onClick={onBack}
          className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-500 hover:text-white hover:border-white/10 transition-all flex items-center gap-2 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Volver al Dashboard</span>
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <Fingerprint className="w-3 h-3 text-indigo-400" />
          <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Acceso Biométrico Activo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Identidad Visual */}
        <div className="space-y-8">
          <div className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-[32px] border border-white/5 text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30" />
            
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center border-2 border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.2)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.3)] transition-all duration-500 overflow-hidden">
                <User className="w-10 h-10 text-white/50 group-hover:text-cyan-400 transition-colors" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-slate-950 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>

            <h2 className="text-xl font-black text-white tracking-tight truncate">
              {name || user?.email?.split('@')[0]}
            </h2>
            <p className="text-[9px] uppercase tracking-[0.3em] text-cyan-500 font-bold mt-2">Administrador de Nodo</p>
            
            <div className="mt-8 pt-8 border-t border-white/5 flex justify-center gap-6">
              <div className="text-center">
                <p className="text-[10px] font-black text-white">v2.0.26</p>
                <p className="text-[8px] uppercase tracking-widest text-slate-600 font-bold">Protocolo</p>
              </div>
              <div className="w-[1px] h-8 bg-white/5" />
              <div className="text-center">
                <p className="text-[10px] font-black text-emerald-500">Activo</p>
                <p className="text-[8px] uppercase tracking-widest text-slate-600 font-bold">Estado</p>
              </div>
            </div>
          </div>

          {/* Gestión de Hogar (Invitaciones) */}
          <div className="bg-slate-950/40 backdrop-blur-xl p-6 rounded-[32px] border border-white/5 space-y-6">
            <div className="flex items-center gap-3">
              <Home className="w-4 h-4 text-indigo-400" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Mi Hogar</h3>
            </div>
            
            <div className="space-y-3">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Código de Invitación</p>
              <div className="flex gap-2">
                <div className="flex-1 bg-white/[0.02] border border-white/5 p-3 rounded-xl truncate text-[10px] font-mono text-slate-400">
                  {householdId || 'Cargando...'}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="p-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl text-white transition-all active:scale-90"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Unirse a otro Nodo</p>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="ID del Hogar..."
                  className="flex-1 bg-white/[0.02] border border-white/5 px-3 py-2 rounded-xl text-[10px] outline-none focus:border-indigo-500/50 text-white"
                />
                <button 
                  onClick={handleJoinHousehold}
                  disabled={loading || !joinCode}
                  className="px-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl transition-all active:scale-90"
                >
                  <LogIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="w-full p-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 rounded-2xl text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group"
          >
            <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            Desconectar Nodo
          </button>
        </div>

        {/* Columna Derecha: Configuración */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-950/40 backdrop-blur-xl p-8 md:p-10 rounded-[32px] border border-white/5 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-10">
              <Shield className="w-5 h-5 text-cyan-500" />
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white">Configuración de Credenciales</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-3 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-focus-within:text-cyan-400 transition-colors px-1">
                    Alias de Identidad (Nombre Completo)
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ingresa tu nombre..."
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.02] border border-white/5 rounded-2xl outline-none focus:border-cyan-500/30 focus:bg-white/[0.05] transition-all text-sm text-white font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3 opacity-50 cursor-not-allowed">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">
                    Dirección de Correo (Nodo Central)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="email" 
                      disabled
                      value={user?.email || ''}
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.01] border border-white/5 rounded-2xl text-sm text-slate-500 font-medium"
                    />
                  </div>
                </div>
              </div>

              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "p-4 rounded-2xl border text-xs font-bold tracking-wide flex items-center gap-3",
                    message.type === 'success' 
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
                      : "bg-rose-500/5 border-rose-500/20 text-rose-400"
                  )}
                >
                  <Zap className="w-4 h-4" />
                  {message.text}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-cyan-500 hover:text-white"
              >
                <div className="flex items-center justify-center gap-2">
                  {loading ? 'Actualizando Nodo...' : 'Sincronizar Cambios'}
                  <Save className="w-4 h-4" />
                </div>
              </button>
            </form>
          </div>

          {/* Estadísticas de Seguridad */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950/40 backdrop-blur-xl p-6 rounded-[28px] border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Último Acceso</p>
                <p className="text-xs font-bold text-white mt-1">
                  {user?.last_sign_in_at ? new Date(user?.last_sign_in_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                </p>
              </div>
            </div>
            <div className="bg-slate-950/40 backdrop-blur-xl p-6 rounded-[28px] border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Nivel de Seguridad</p>
                <p className="text-xs font-bold text-white mt-1">Encriptación 256-bit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const cn = (...classes) => classes.filter(Boolean).join(' ');
