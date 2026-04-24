import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. Verificar sesión inicial inmediatamente
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (err) {
        console.error("Error recuperando sesión:", err.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // 2. Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Evento de Autenticación detectado:", event);
      setSession(newSession);

      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }
      
      if (newSession) setLoading(false);
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    if (!supabase) throw new Error("Supabase no está configurado");
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error("Supabase no está configurado");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resetPassword = async (email) => {
    if (!supabase) throw new Error("Supabase no está configurado");
    
    // Validar email antes de enviar
    if (!email || !email.includes('@')) {
      throw new Error("Por favor, ingresa un correo electrónico válido.");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Esta URL debe estar registrada en tu Dashboard de Supabase -> Authentication -> URL Configuration
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    
    if (error) throw error;
  };

  const updatePassword = async (newPassword) => {
    if (!supabase) throw new Error("Supabase no está configurado");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  return {
    session,
    user: session?.user ?? null,
    loading,
    recoveryMode,
    setRecoveryMode,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  };
};
