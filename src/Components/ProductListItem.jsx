import { Trash2, Package } from 'lucide-react';
import { useDeleteProduct } from '../api/useProductHandle';

const ProductListItem = ({ product }) => {
  const { mutateAsync: deleteProduct, isPending: deleting } =
    useDeleteProduct();

  const handleDelete = async () => {
    try {
      await deleteProduct({
        id: product._id,
        categoryId: product.categoryId?._id || product.categoryId,
        shopId: product.shopId,
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="bg-(--color-base-100) border border-(--color-border-light) rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-4 hover:border-(--color-primary)/50 transition-all group">
      {/* Left Section: Image and Info */}
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 bg-(--color-base-300)/50 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-(--color-base-300)/40 text-(--color-text-muted)">
              <Package size={22} className="opacity-60" />
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium text-sm md:text-base text-(--color-base-content) leading-snug">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm text-(--color-text-muted) mt-0.5 font-normal">
            Buy:{' '}
            <span className="font-medium text-(--color-base-content)">
              ৳{product.buyPrice}
            </span>
          </p>
        </div>
      </div>

      {/* Right Section: Sell Range & Delete Button */}
      <div className="flex items-center gap-4">
        <div className="text-right shrink-0">
          <span className="text-xs text-(--color-text-muted) block font-normal">
            Sell Range
          </span>
          <span className="font-medium text-xs md:text-sm text-(--color-primary)">
            ৳{product.minSellPrice} - ৳{product.maxSellPrice}
          </span>
        </div>

        {/* Direct Delete Button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-50 shrink-0"
          title="Delete Product"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ProductListItem;
