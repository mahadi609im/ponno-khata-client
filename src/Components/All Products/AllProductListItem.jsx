import { Package } from 'lucide-react';

const AllProductListItem = ({ product }) => {
  const stockCount = product.stock;

  return (
    <div className="bg-(--color-base-100) border border-(--color-border-light) rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-4 hover:border-(--color-primary)/50 transition-all group">
      {/* Left Section: Image and Info */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-14 h-14 bg-(--color-base-300)/50 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center">
          {product.image || product.img ? (
            <img
              src={product.image || product.img}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-(--color-base-300)/40 text-(--color-text-muted)">
              <Package size={22} className="opacity-60" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm md:text-base text-(--color-base-content) leading-snug truncate">
              {product.name}
            </h3>

            {/* স্টকের ব্যাজটি ইমেজের বদলে নামের পাশে বসানো হয়েছে */}
            {stockCount !== undefined &&
              stockCount !== null &&
              stockCount !== '' && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white shrink-0 ${
                    Number(stockCount) < 3
                      ? 'bg-(--color-error) animate-pulse'
                      : 'bg-(--color-primary)'
                  }`}
                >
                  Stock: {stockCount}
                </span>
              )}
          </div>

          {/* Product Note (যদি নোট থাকে তবেই দেখাবে) */}
          {product.note && (
            <p className="text-xs text-(--color-text-muted) italic truncate mt-0.5 max-w-2xs">
              &quot;{product.note}&quot;
            </p>
          )}

          <p className="text-xs md:text-sm text-(--color-text-muted) mt-0.5 font-normal">
            Buy:{' '}
            <span className="font-medium text-(--color-base-content)">
              ৳{product.buyPrice}
            </span>
          </p>
        </div>
      </div>

      {/* Right Section: Sell Range & Delete Button */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right shrink-0">
          <span className="text-xs text-(--color-text-muted) block font-normal">
            Sell Range
          </span>
          <span className="font-medium text-xs md:text-sm text-(--color-primary)">
            ৳{product.minSellPrice} - ৳{product.maxSellPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AllProductListItem;
