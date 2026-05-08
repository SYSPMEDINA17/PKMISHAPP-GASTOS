import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Analytics from './pages/Analytics';
import Records from './pages/Records';
import Settings from './pages/Settings';
import { Login } from './components/Login';
import { ResetPassword } from './components/ResetPassword';
import { Toaster } from 'sonner';

const AppContent = () => {
  const { user, loading, recoveryMode, setRecoveryMode } = useExpenses();

  if (recoveryMode) {
    return <ResetPassword onComplete={() => setRecoveryMode(false)} />;
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.3)]"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/entradas" element={<Income />} />
          <Route path="/salidas" element={<Expenses />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/registros" element={<Records />} />
          <Route path="/ajustes" element={<Settings />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-right" theme="dark" closeButton richColors />
    </Router>
  );
};

function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}

export default App;
