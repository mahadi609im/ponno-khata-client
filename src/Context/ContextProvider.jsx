import { createContext, useEffect, useState } from 'react';
import { useShopEnterHandle, useShopRegister } from '../api/useShopEnterHandle';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
} from '../api/useCategoryHandle';
import { useGroupedProducts } from '../api/useProductHandle';

const Context = createContext();

const ContextProvider = ({ children }) => {
  // --- Theme ---
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // --- Shop Auth ---
  const [shop, setShop] = useState(() => {
    const savedShop = localStorage.getItem('current_shop');
    return savedShop ? JSON.parse(savedShop) : null;
  });

  // যখনই shop পরিবর্তন হবে, তা localStorage-এ সেভ করে রাখুন
  useEffect(() => {
    if (shop) {
      localStorage.setItem('current_shop', JSON.stringify(shop));
    } else {
      localStorage.removeItem('current_shop');
    }
  }, [shop]);

  const [loading, setLoading] = useState(false);

  // --- Active Category (Default: 'all') ---
  const [activeCategory, setActiveCategory] = useState('all');

  const {
    mutateAsync: shopEnter,
    isPending: shopEnterPending,
    isError: shopEnterError,
  } = useShopEnterHandle(setShop);

  const {
    mutateAsync: shopRegister,
    isPending: shopRegisterPending,
    isError: shopRegisterError,
  } = useShopRegister(setShop);

  // --- Categories ---
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories(shop?._id);

  const { mutateAsync: createCategory, isPending: createCategoryPending } =
    useCreateCategory();

  const { data: groupedProducts = [], isLoading: groupedProductsLoading } =
    useGroupedProducts(shop?._id);

  const { mutateAsync: deleteCategory, isPending: deleteCategoryPending } =
    useDeleteCategory();

  const globalInfo = {
    // Theme
    theme,
    setTheme,
    toggleTheme,

    // Shop Auth
    shop,
    setShop,
    loading,
    setLoading,
    shopEnter,
    shopEnterPending,
    shopEnterError,
    shopRegister,
    shopRegisterPending,
    shopRegisterError,

    // Active Category State
    activeCategory,
    setActiveCategory,

    // Categories
    categories,
    categoriesLoading,
    categoriesError,
    createCategory,
    createCategoryPending,
    groupedProducts,
    groupedProductsLoading,
    deleteCategory,
    deleteCategoryPending,
  };

  return <Context.Provider value={globalInfo}>{children}</Context.Provider>;
};

export { Context, ContextProvider };
