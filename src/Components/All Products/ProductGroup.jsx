import { FolderOpen } from 'lucide-react';
import AllProductCard from './AllProductsCard';
import AllProductListItem from './AllProductListItem';

const ProductGroup = ({ item, viewMode, onManage }) => {
  return (
    <div
      key={item.category._id}
      className="space-y-4 bg-(--color-base-100)/40 p-4 md:p-5 rounded-2xl border border-(--color-border-light)/60 backdrop-blur-sm"
    >
      {/* Category Header with Manage Button */}
      <div className="flex items-center justify-between pb-2 border-b border-(--color-border-light)/60">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-(--color-primary) animate-pulse" />
          <h3 className="text-base md:text-lg font-bold text-(--color-base-content)">
            {item.category.name}
          </h3>
        </div>

        {/* যদি onManage ফাংশন পাস করা হয়, তবেই Manage বাটন দেখাবে */}
        {onManage && (
          <button
            onClick={() => onManage(item.category._id)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-(--color-primary) hover:bg-(--color-primary) text-white transition-all duration-300 cursor-pointer"
          >
            <FolderOpen size={16} />
            <span className="text-xs font-medium">Manage</span>
          </button>
        )}
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {item.products.map(product => (
            <AllProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {item.products.map(product => (
            <AllProductListItem key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGroup;
