import { useState } from 'react';
import { useOutletContext } from 'react-router';
import ProductToolbar from './ProductToolbar';
import ProductGroup from './ProductGroup';

const AllProducts = () => {
  const context = useOutletContext() || {};
  const {
    groupedProducts = [],
    groupedProductsLoading,
    setIsProductModalOpen,
    setActiveCategory,
  } = context;

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  if (groupedProductsLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--color-primary)"></div>
      </div>
    );
  }

  const filteredGroups = groupedProducts
    .map(group => {
      const matchedProducts = group.products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      return {
        ...group,
        products: matchedProducts,
      };
    })
    .filter(group => group.products.length > 0);

  return (
    <div className="space-y-6 pb-12">
      <ProductToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddClick={() => setIsProductModalOpen && setIsProductModalOpen(true)}
      />

      {filteredGroups.length > 0 ? (
        filteredGroups.map(item => (
          <ProductGroup
            key={item.category._id}
            item={item}
            viewMode={viewMode}
            onManage={catId => setActiveCategory && setActiveCategory(catId)}
          />
        ))
      ) : (
        <div className="w-full h-64 flex flex-col items-center justify-center border border-dashed border-(--color-border-light) rounded-2xl bg-(--color-base-100)/50 gap-2">
          <p className="text-sm font-medium text-(--color-text-muted)">
            No products found matching your search!
          </p>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
