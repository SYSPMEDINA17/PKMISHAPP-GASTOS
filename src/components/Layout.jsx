import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { cn } from '../lib/utils';
import { Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-[#020617] transition-colors duration-300 overflow-hidden text-white font-sans">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
      />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-500 relative",
          sidebarCollapsed ? "md:pl-20" : "md:pl-72",
          "pl-0"
        )}
      >
        <Navbar 
          onProfileClick={() => navigate('/settings')} 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="min-h-[calc(100vh-80px)] mt-20 p-0 overflow-y-auto">
          <AnimatePresence mode="wait">
             <motion.div
               key={window.location.pathname}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
             >
               <Outlet />
             </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Orbe de luz de fondo global */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
    </div>
  );
};
