import { useState, useContext } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { MdOutlineFirstPage, MdLastPage } from 'react-icons/md';
import { Sun, Moon, LogOut } from 'lucide-react';
import Cateogries from '../Components/Categories';
import AddProductModal from '../Components/AddProductModal'; // ১. মডাল ইম্পোর্ট
import { Context } from '../Context/ContextProvider';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false); // ২. মডালের স্টেট

  // Context থেকে প্রয়োজনীয় ডেটা ও ফাংশনগুলো রিসিভ করা
  const {
    theme,
    toggleTheme,
    setShop,
    shop,
    categories = [],
    categoriesLoading,
    groupedProducts,
    groupedProductsLoading,
    activeCategory,
    setActiveCategory,
  } = useContext(Context);

  const isDarkMode = theme === 'dark';

  const handleLogout = () => {
    localStorage.removeItem('shop');
    localStorage.removeItem('isShopLoggedIn');
    setShop(null);
    navigate('/auth/login');
  };

  return (
    <div className="h-dvh w-screen bg-(--color-base-100) flex flex-col overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="h-18 bg-(--color-base-200)/30 backdrop-blur-3xl border-b border-(--color-border-light) flex items-center justify-between px-4 md:px-6 shadow-[0_8px_30px_var(--color-shadow)]">
        {/* Left Side: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 text-xl cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <MdLastPage className="text-(--color-secondary)" />
            ) : (
              <MdOutlineFirstPage className="text-(--color-secondary)" />
            )}
          </button>

          <Link to="/" className="flex items-center gap-3">
            <h1 className="block font-bold text-lg md:text-xl text-(--color-base-content)">
              Ponno Khata
            </h1>
          </Link>
        </div>

        {/* Right Side: Theme Toggle & Logout */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 bg-(--color-base-300)/50 border border-(--color-border-light) rounded-xl text-(--color-base-content) hover:bg-(--color-base-300) transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-(--color-error)/10 border border-(--color-error)/20 rounded-xl text-(--color-error) hover:bg-(--color-error)/20 transition-all cursor-pointer"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 absolute md:relative z-20 w-80 h-full bg-(--color-base-200)/90 backdrop-blur-3xl border-r border-(--color-border-light) p-2 gap-4 overflow-y-auto transition-transform duration-300 ease-in-out`}
        >
          <Cateogries
            setIsSidebarOpen={setIsSidebarOpen}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar bg-(--color-base-200)/30 backdrop-blur-3xl p-4 md:p-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet
                context={{
                  activeCategory,
                  setActiveCategory,
                  shop,
                  categories,
                  categoriesLoading,
                  groupedProducts,
                  groupedProductsLoading,
                  isProductModalOpen,
                  setIsProductModalOpen,
                }}
              />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        activeCategory={activeCategory}
        categories={categories}
        shopId={shop?._id}
        shop={shop}
      />
    </div>
  );
};

export default MainLayout;
