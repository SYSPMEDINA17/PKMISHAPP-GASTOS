import React, { useState } from 'react';
import { useHousehold } from './hooks/useHousehold'
import { ExpenseProvider, useExpenses } from './context/ExpenseContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { ProfileSettings } from './components/ProfileSettings';
import { Login } from './components/Login';
import { cn } from './lib/utils';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';

const AppContent = () => {
  const { user, loading } = useExpenses();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' o 'profile'

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
    <div className="min-h-screen flex bg-[#020617] transition-colors duration-300 overflow-hidden text-white font-sans">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-500 relative",
          sidebarCollapsed ? "md:pl-20" : "md:pl-72",
          "pl-0"
        )}
      >
        {/* Navbar con acceso al perfil y toggle de sidebar */}
        <Navbar 
          onProfileClick={() => setCurrentView('profile')} 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="min-h-[calc(100vh-80px)] mt-20 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentView === 'dashboard' ? (
              <Dashboard key="dashboard" />
            ) : (
              <ProfileSettings key="profile" onBack={() => setCurrentView('dashboard')} />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Orbe de luz de fondo global */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <Toaster position="top-right" theme="dark" closeButton richColors />
    </div>
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
