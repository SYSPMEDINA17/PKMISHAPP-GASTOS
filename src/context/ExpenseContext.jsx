import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useHousehold } from '../hooks/useHousehold';
import { toast } from 'sonner';
import { formatCurrency } from '../lib/utils';

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { 
    user, 
    signOut: supabaseSignOut, 
    loading: authLoading, 
    recoveryMode, 
    setRecoveryMode 
  } = useSupabaseAuth();
  const { householdId, loading: householdLoading } = useHousehold(user);
  
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState({});
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [filters, setFilters] = useState({
    month: new Date().toISOString().slice(0, 7),
    category: 'all'
  });

  const isGlobalLoading = authLoading || (user && householdLoading);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (user && householdId) {
      fetchTransactions();
      fetchMembers();
      fetchGoals();
    } else if (!user && !authLoading) {
      setExpenses([]);
      setMembers([]);
      setGoals([]);
      setBudgets({});
      setLoading(false);
    }
  }, [user, householdId, authLoading]);

  useEffect(() => {
    if (!user || !householdId || !supabase) return;

    // Realtime para transacciones
    const channelTransactions = supabase
      .channel('realtime-transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `household_id=eq.${householdId}`
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          if (eventType === 'INSERT') {
            setExpenses((prev) => {
              // Evitar duplicados: Si ya existe por la inserción manual, no añadirlo
              if (prev.find(e => e.id === newRecord.id)) return prev;
              
              if (newRecord.user_id !== user?.id) {
                toast.info(`Nueva transacción: ${newRecord.description} (${formatCurrency(newRecord.amount)})`, {
                  description: `Añadido por otro miembro del hogar.`
                });
              }
              return [newRecord, ...prev];
            });
          } else if (eventType === 'UPDATE') {
            setExpenses((prev) => prev.map((exp) => (exp.id === newRecord.id ? newRecord : exp)));
          } else if (eventType === 'DELETE') {
            setExpenses((prev) => prev.filter((exp) => exp.id !== oldRecord.id));
          }
        }
      )
      .subscribe();

    // Realtime para metas
    const channelGoals = supabase
      .channel('realtime-goals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'savings_goals',
          filter: `household_id=eq.${householdId}`
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          if (eventType === 'INSERT') {
            setGoals((prev) => {
              if (prev.find(g => g.id === newRecord.id)) return prev;
              return [...prev, newRecord];
            });
          } else if (eventType === 'UPDATE') {
            setGoals((prev) => prev.map((goal) => (goal.id === newRecord.id ? newRecord : goal)));
            if (newRecord.current_amount > oldRecord.current_amount) {
              toast.success(`¡Progreso en meta: ${newRecord.name}!`, {
                description: `Se han añadido ${formatCurrency(newRecord.current_amount - oldRecord.current_amount)} al objetivo.`
              });
            }
          } else if (eventType === 'DELETE') {
            setGoals((prev) => prev.filter((goal) => goal.id !== oldRecord.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelTransactions);
      supabase.removeChannel(channelGoals);
    };
  }, [user, householdId]);

  const fetchTransactions = async () => {
    try {
      if (!householdId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('household_id', householdId)
        .order('date', { ascending: false });
      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error('Error al cargar transacciones:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      if (!householdId) return;
      const { data, error } = await supabase
        .from('household_members')
        .select('user_id')
        .eq('household_id', householdId);
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error al cargar miembros:', error.message);
    }
  };

  const fetchGoals = async () => {
    try {
      if (!householdId) return;
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('household_id', householdId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error al cargar metas:', error.message);
    }
  };

  const addExpense = async (expense) => {
    try {
      if (!householdId) throw new Error("No hay un hogar asignado");
      const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...expense, user_id: user.id, household_id: householdId }])
        .select();
      if (error) throw error;
      setExpenses(prev => [data[0], ...prev]);
      toast.success('Transacción registrada correctamente');
    } catch (error) {
      toast.error('Error al guardar: ' + error.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      toast.success('Transacción eliminada');
    } catch (error) {
      toast.error('Error al eliminar: ' + error.message);
    }
  };

  const addGoal = async (goal) => {
    try {
      if (!householdId) throw new Error("No hay un hogar asignado");
      const { data, error } = await supabase
        .from('savings_goals')
        .insert([{ ...goal, household_id: householdId }])
        .select();
      if (error) throw error;
      setGoals(prev => [...prev, data[0]]);
      toast.success('Meta de ahorro creada');
    } catch (error) {
      toast.error('Error al guardar meta: ' + error.message);
    }
  };

  const updateGoal = async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      setGoals(prev => prev.map(g => g.id === id ? data[0] : g));
    } catch (error) {
      toast.error('Error al actualizar meta: ' + error.message);
    }
  };

  const deleteGoal = async (id) => {
    try {
      const { error } = await supabase.from('savings_goals').delete().eq('id', id);
      if (error) throw error;
      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Meta eliminada');
    } catch (error) {
      toast.error('Error al eliminar meta: ' + error.message);
    }
  };

  const joinHousehold = async (id) => {
    try {
      const { error } = await supabase
        .from('household_members')
        .insert([{ user_id: user.id, household_id: id }]);
      if (error) throw error;
      toast.success('¡Te has unido al hogar con éxito!');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toast.error('Error al unirse al hogar: ' + error.message);
    }
  };

  const updateBudget = async (month, category, amount) => {
    setBudgets(prev => ({ ...prev, [`${month}-${category}`]: parseFloat(amount) || 0 }));
  };

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const filteredExpenses = expenses.filter(exp => {
    const matchesMonth = exp.date.startsWith(filters.month);
    const matchesCategory = filters.category === 'all' || exp.category === filters.category;
    return matchesMonth && matchesCategory;
  });

  const expensesByCategory = expenses
    .filter(exp => exp.date.startsWith(filters.month) && exp.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  const totalBalance = filteredExpenses.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const totalIncome = filteredExpenses
    .filter(exp => exp.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = filteredExpenses
    .filter(exp => exp.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <ExpenseContext.Provider value={{
      user,
      householdId,
      expenses,
      members,
      goals,
      filteredExpenses,
      loading: isGlobalLoading || (user && loading),
      filters,
      setFilters,
      budgets,
      updateBudget,
      expensesByCategory,
      addExpense,
      deleteExpense,
      addGoal,
      updateGoal,
      deleteGoal,
      joinHousehold,
      totalBalance,
      totalIncome,
      totalExpenses,
      theme,
      toggleTheme,
      recoveryMode,
      setRecoveryMode,
      signOut: supabaseSignOut
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses debe usarse dentro de un ExpenseProvider');
  return context;
};
