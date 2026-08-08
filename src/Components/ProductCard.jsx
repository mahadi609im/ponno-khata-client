import { Package, Trash2 } from 'lucide-react';
import { useDeleteProduct } from '../api/useProductHandle';
import { useContext } from 'react';
import { Context } from '../Context/ContextProvider';

const ProductCard = ({ product }) => {
  const { mutateAsync: deleteProduct, isPending: deleting } =
    useDeleteProduct();
  const { shop } = useContext(Context);

  const handleDelete = async () => {
    const accessKey = prompt('Enter Access Key');

    if (!accessKey) return;

    if (accessKey !== shop?.key) {
      alert('Invalid Access Key');
      return;
    }

    try {
      await deleteProduct({
        id: product._id,
        categoryId: product.categoryId?._id || product.categoryId,
        shopId: product.shopId,
        key: accessKey,
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="bg-(--color-base-100) border border-(--color-border-light) rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-(--color-primary)/50 transition-all group relative">
      <div>
        <div className="w-full h-36 bg-(--color-base-300)/50 rounded-xl overflow-hidden mb-3.5 relative flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-(--color-base-300)/40 text-(--color-text-muted)">
              <div className="w-9 h-9 rounded-full bg-(--color-base-300) flex items-center justify-center mb-1">
                <Package size={20} className="opacity-60" />
              </div>
              <span className="text-xs font-normal opacity-60">No Image</span>
            </div>
          )}
        </div>

        {/* নামের পাশে ডিলিট বাটন */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-sm md:text-base text-(--color-base-content) line-clamp-1 leading-snug min-w-0 flex-1">
            {product.name}
          </h3>
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

      <div className="mt-4 pt-3 border-t border-(--color-border-light) space-y-2">
        <div className="flex justify-between items-center text-xs md:text-sm">
          <span className="text-(--color-text-muted) font-normal">
            Buy Price:
          </span>
          <span className="font-medium text-(--color-base-content)">
            ৳{product.buyPrice}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs md:text-sm">
          <span className="text-(--color-text-muted) font-normal">
            Sell Range:
          </span>
          <span className="font-medium text-(--color-primary)">
            ৳{product.minSellPrice} - ৳{product.maxSellPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
