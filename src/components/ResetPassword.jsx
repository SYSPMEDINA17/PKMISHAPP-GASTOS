import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, ArrowRight, ShieldCheck, Zap, CheckCircle2 } from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export const ResetPassword = ({ onComplete }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useSupabaseAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updatePassword(newPassword);
      setSuccess(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden font-sans selection:bg-cyan-500/30">
      {/* Fondo Tecnológico - Mismo estilo que Login */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-[460px] p-[1px] rounded-[32px] bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm mx-6"
      >
        <div className="bg-slate-950/80 backdrop-blur-2xl rounded-[31px] p-8 md:p-12 shadow-2xl border border-white/5">
          
          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-end gap-[3px] h-10 group relative">
                <motion.div animate={{ height: [12, 20, 12] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 bg-indigo-500/50 rounded-full" />
                <motion.div animate={{ height: [24, 40, 24] }} transition={{ repeat: Infinity, duration: 3 }} className="w-1.5 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-500">
                RESETEAR CLAVE
              </h1>
            </div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-cyan-500 font-bold mb-1">Actualización de Seguridad</p>
          </div>

          {success ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="flex justify-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
              </div>
              <p className="text-white font-medium text-sm">¡Contraseña actualizada con éxito!</p>
              <p className="text-slate-400 text-xs">Redirigiendo al sistema...</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-cyan-400 transition-colors px-1">
                    Nueva Clave de Seguridad
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                      type="password" 
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all text-sm text-white placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-indigo-400 transition-colors px-1">
                    Confirmar Clave
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="password" 
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all text-sm text-white placeholder:text-slate-700"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-2xl backdrop-blur-md"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="relative w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden group shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                <div className="flex items-center justify-center gap-2">
                  {loading ? 'Actualizando Nodo...' : 'Establecer Nueva Clave'}
                  {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </div>
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
