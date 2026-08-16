import { Package } from 'lucide-react';

const AllProductCard = ({ product }) => {
  const stockCount = product.stock;

  return (
    <div className="bg-(--color-base-100) border border-(--color-border-light) rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-(--color-primary)/50 transition-all group relative">
      <div>
        <div className="w-full h-36 bg-(--color-base-300)/50 rounded-xl overflow-hidden mb-3.5 relative flex items-center justify-center">
          {stockCount && (
            <div
              className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm ${
                Number(stockCount) < 3
                  ? 'bg-(--color-error) animate-pulse'
                  : 'bg-(--color-primary) backdrop-blur-sm'
              }`}
            >
              Stock: {stockCount}
            </div>
          )}

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

        <div className="space-y-1">
          <h3 className="font-medium text-sm md:text-base text-(--color-base-content) line-clamp-1 leading-snug min-w-0 flex-1">
            {product.name}
          </h3>

          {product.note && (
            <p className="text-xs text-(--color-text-muted) italic truncate mt-0.5">
              &quot;{product.note}&quot;
            </p>
          )}
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

export default AllProductCard;
