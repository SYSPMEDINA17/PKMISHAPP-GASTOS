import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useHousehold = (user) => {
  const [householdId, setHouseholdId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no hay usuario o ya tenemos un householdId, no hacemos nada
    if (!user?.id || householdId) {
      if (!user?.id) setLoading(false);
      return;
    }

    const getOrCreateHousehold = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. CONSULTA: Buscar si el usuario ya pertenece a un hogar
        // Usamos una consulta simple sin .single() para manejar mejor el flujo
        const { data: members, error: memberError } = await supabase
          .from('household_members')
          .select('household_id')
          .eq('user_id', user.id);

        if (memberError) throw memberError;

        // 2. VERIFICACIÓN: Si hay resultados, usamos el existente
        if (members && members.length > 0) {
          const existingId = members[0].household_id;
          console.log('✅ Household encontrado para el usuario:', existingId);
          setHouseholdId(existingId);
          return; // Salimos de la función, ya tenemos lo que necesitamos
        }

        // 3. CREACIÓN: Solo llegamos aquí si members.length === 0
        console.log('🏠 No se encontró household. Creando uno nuevo...');
        
        const { data: newHousehold, error: createError } = await supabase
          .from('households')
          .insert([{ name: `Hogar de ${user.email.split('@')[0]}` }])
          .select()
          .maybeSingle();

        if (createError) throw createError;
        if (!newHousehold) throw new Error('Error crítico: El hogar no pudo ser creado.');

        console.log('✨ Nuevo household creado:', newHousehold.id);

        // 4. VINCULACIÓN: Unir al usuario con el nuevo hogar
        const { error: linkError } = await supabase
          .from('household_members')
          .insert([{ 
            user_id: user.id, 
            household_id: newHousehold.id
          }]);

        if (linkError) {
          // Si falla la vinculación pero el household se creó, 
          // el siguiente intento del hook encontrará el household o fallará limpiamente.
          throw linkError;
        }

        setHouseholdId(newHousehold.id);
        console.log('🔗 Usuario vinculado al nuevo household correctamente.');

      } catch (err) {
        console.error('❌ Error en la lógica de Household:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getOrCreateHousehold();
  }, [user?.id, householdId]); // Dependencias precisas

  return { householdId, loading, error };
};
