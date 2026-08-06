import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { Search, LayoutGrid, List, Plus } from 'lucide-react';
import { useProductsByCategory } from '../api/useProductHandle';
import ProductCard from './ProductCard';
import ProductListItem from './ProductListItem';

const CategoryProducts = () => {
  const context = useOutletContext() || {};
  const {
    activeCategory,
    categories = [],
    categoriesLoading,
    setIsProductModalOpen,
  } = context;

  // Fetch products by active category
  const { data: products = [], isLoading: productsLoading } =
    useProductsByCategory(activeCategory);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  const currentCategory = categories.find(
    cat => cat._id === activeCategory || cat.id === activeCategory,
  );

  const currentCategoryName = currentCategory
    ? currentCategory.name
    : 'Category Products';

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      product.categoryId === activeCategory ||
      product.categoryId === String(activeCategory) ||
      product.categoryId?._id === activeCategory;

    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-(--color-base-content) flex items-center gap-2">
            <span>
              {categoriesLoading ? 'Loading...' : currentCategoryName}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-(--color-primary)/10 text-(--color-primary) font-semibold">
              {filteredProducts.length} Items
            </span>
          </h2>
          <p className="text-xs text-(--color-text-muted) mt-1">
            Manage your store inventory and pricing for this category
          </p>
        </div>

        {/* Search, View Mode Toggles & Add Product Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:flex-none md:w-64">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--color-text-muted)"
            />
            <input
              type="text"
              placeholder="Search product..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-(--color-base-100) border border-(--color-border-light) rounded-xl text-sm text-(--color-base-content) outline-none focus:border-(--color-primary) transition-all shadow-inner"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-(--color-base-100) border border-(--color-border-light) p-1 rounded-xl shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-(--color-primary) text-white shadow-sm'
                    : 'text-(--color-text-muted) hover:text-(--color-base-content)'
                }`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-(--color-primary) text-white shadow-sm'
                    : 'text-(--color-text-muted) hover:text-(--color-base-content)'
                }`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>

            {/* Add Product Action Button */}
            <button
              onClick={() =>
                setIsProductModalOpen && setIsProductModalOpen(true)
              }
              className="flex items-center gap-1.5 px-3.5 py-2 bg-(--color-primary) text-white text-xs font-semibold rounded-xl hover:opacity-95 transition-all shadow-md shadow-(--color-primary)/20 cursor-pointer shrink-0"
              title="Add New Product"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Display Section */}
      {productsLoading ? (
        <div className="w-full h-64 flex items-center justify-center">
          <p className="text-sm text-(--color-text-muted)">
            Loading products...
          </p>
        </div>
      ) : filteredProducts.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredProducts.map(product => (
              <ProductListItem key={product._id} product={product} />
            ))}
          </div>
        )
      ) : (
        <div className="w-full h-64 flex flex-col items-center justify-center border border-dashed border-(--color-border-light) rounded-2xl bg-(--color-base-100)/50">
          <p className="text-sm font-medium text-(--color-text-muted)">
            No products found!
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
