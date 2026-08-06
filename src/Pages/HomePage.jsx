import { useOutletContext } from 'react-router';
import AllProducts from '../Components/All Products/AllProducts';
import CategoryProducts from '../Components/CategoryProducts';

const HomePage = () => {
  // Outlet context থেকে activeCaaategory রিসিভ করা
  const context = useOutletContext() || {};
  const { activeCategory } = context;

  console.log(activeCategory);

  return activeCategory === 'all' ? <AllProducts /> : <CategoryProducts />;
};

export default HomePage;
