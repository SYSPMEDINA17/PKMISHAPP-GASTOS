import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { cn } from '../lib/utils';
import { Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

export const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex transition-colors duration-500 overflow-x-hidden font-sans bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed}
      />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-500 relative min-w-0",
          sidebarCollapsed ? "md:pl-20" : "md:pl-72",
          "pl-0"
        )}
      >
        <Navbar 
          onProfileClick={() => navigate('/settings')} 
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="min-h-[calc(100vh-80px)] mt-20 p-0 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
             <motion.div
               key={window.location.pathname}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
               className="w-full"
             >
               <Outlet />
             </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
