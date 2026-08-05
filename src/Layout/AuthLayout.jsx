import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';
import { Context } from '../Context/ContextProvider';

const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(Context);
  const isDarkMode = theme === 'dark';

  const handleLogout = () => {
    localStorage.removeItem('isShopLoggedIn');
    localStorage.removeItem('shopId');
    navigate('/auth/login');
  };

  return (
    <div className="h-dvh w-screen bg-(--color-base-100) flex flex-col overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="h-18 shrink-0 bg-(--color-base-200)/30 backdrop-blur-3xl border-b border-(--color-border-light) flex items-center justify-between px-4 md:px-6 shadow-[0_8px_30px_var(--color-shadow)] z-10">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center font-bold text-lg">
            P
          </div>
          <h1 className="font-bold text-lg md:text-xl text-(--color-base-content)">
            Ponno Khata
          </h1>
        </Link>

        {/* Right Side: Theme Toggle & Logout Icon */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-(--color-base-300)/50 border border-(--color-border-light) rounded-xl text-(--color-base-content) hover:bg-(--color-base-300) transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logout / Exit Icon Button */}
          <button
            onClick={handleLogout}
            className="p-2.5 bg-(--color-error)/10 border border-(--color-error)/20 rounded-xl text-(--color-error) hover:bg-(--color-error)/20 transition-all cursor-pointer"
            title="Exit / Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area with proper spacing and scrolling */}
      <main className="flex-1 overflow-y-auto w-full custom-scrollbar bg-(--color-base-200)/30 backdrop-blur-3xl flex items-center justify-center p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full flex items-center justify-center my-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AuthLayout;
