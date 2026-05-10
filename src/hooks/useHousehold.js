import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export const useHousehold = (user) => {
  const [householdId, setHouseholdId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initializationInProgress = useRef(false);

  useEffect(() => {
    if (!user?.id) {
      setHouseholdId(null);
      setLoading(false);
      return;
    }

    if (householdId) {
      setLoading(false);
      return;
    }

    if (initializationInProgress.current) return;

    const getOrCreateHousehold = async () => {
      try {
        initializationInProgress.current = true;
        setLoading(true);
        setError(null);

        console.log(`[Household] Verificando membresía para: ${user.email}`);

        // 1. BUSCAR MEMBRESÍA EXISTENTE
        const { data: members, error: memberError } = await supabase
          .from('household_members')
          .select('household_id')
          .eq('user_id', user.id);

        if (memberError) throw memberError;

        if (members && members.length > 0) {
          const existingId = members[0].household_id;
          console.log('✅ [Household] Membresía encontrada:', existingId);
          setHouseholdId(existingId);
          return;
        }

        // 2. CREACIÓN DINÁMICA (Estrategia de Bypass RLS)
        // Generamos el ID en el cliente para no depender de .select() que suele fallar por RLS
        // si el usuario aún no es miembro.
        const newHouseholdId = crypto.randomUUID();
        console.log('[Household] Creando nuevo hogar con ID pre-generado:', newHouseholdId);
        
        // Insertar el hogar sin pedir respuesta (select) para evitar error de política de lectura
        const { error: createError } = await supabase
          .from('households')
          .insert([{ 
            id: newHouseholdId, 
            name: `Hogar de ${user.email.split('@')[0]}` 
          }]);

        if (createError) {
          console.error('[Household] Error al insertar en households:', createError.message);
          // Si el error es de RLS aquí, es que la política de INSERT está bloqueada.
          throw createError;
        }

        // 3. VINCULACIÓN INMEDIATA
        console.log('[Household] Vinculando usuario al nuevo ID...');
        const { error: linkError } = await supabase
          .from('household_members')
          .insert([{ 
            user_id: user.id, 
            household_id: newHouseholdId
          }]);

        if (linkError) {
          console.error('[Household] Error al vincular miembro:', linkError.message);
          throw linkError;
        }

        setHouseholdId(newHouseholdId);
        console.log(`🚀 [Household] Configuración completada. ID: ${newHouseholdId}`);

      } catch (err) {
        console.error('❌ [Household] Error crítico:', err.message);
        
        // Manejo amigable de error RLS
        if (err.message.includes('row-level security policy')) {
          setError('Permisos de base de datos insuficientes para crear un hogar. Contacta al administrador.');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
        initializationInProgress.current = false;
      }
    };

    getOrCreateHousehold();
  }, [user?.id, householdId]);

  return { householdId, loading, error };
};
