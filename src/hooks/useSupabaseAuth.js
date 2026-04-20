import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSupabaseAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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

    // 2. Escuchar cambios en la autenticación (incluyendo la confirmación del correo)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Evento de Autenticación detectado:", event);
      setSession(newSession);
      
      // Si el evento es SIGN_IN o INITIAL_SESSION, aseguramos que loading sea false
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

  return {
    session,
    user: session?.user ?? null,
    loading,
    signUp,
    signIn,
    signOut
  };
};
