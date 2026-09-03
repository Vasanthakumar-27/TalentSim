import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  // Pages that don't need standard layout header/sidebar:
  const isFullBleedPage = ['/', '/login', '/register', '/interview/room'].includes(location.pathname);

  const pageVariants = {
    initial: { opacity: 0, y: 10, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.99 },
  };

  const pageTransition = {
    duration: 0.28,
    ease: 'easeOut' as const,
  };



  if (isFullBleedPage) {
    return (
      <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC]">
        {location.pathname === '/' && <Navbar />}
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F8FAFC] flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Sidebar />
        <main className="flex-1 min-w-0 lg:pl-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

