import { useState, useContext } from 'react';
import { Package } from 'lucide-react';
import { useDeleteProduct, useUpdateProduct } from '../api/useProductHandle';
import { Context } from '../Context/ContextProvider';
import AccessKeyModal from './AccessKeyModal';
import ProductDetailsModal from './ProductDetailsModal';

const ProductListItem = ({ product }) => {
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { shop } = useContext(Context);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);

  const handleInfoClick = e => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleDeleteClickFromModal = () => {
    setIsModalOpen(false);
    setModalType('delete');
    setIsAccessModalOpen(true);
  };

  const handleEditClickFromModal = formData => {
    setIsModalOpen(false);
    setPendingUpdateData(formData);
    setModalType('edit');
    setIsAccessModalOpen(true);
  };

  const handleVerifyAccess = async accessKey => {
    const correctKey = shop?.key || shop?.accessKey;

    if (accessKey !== correctKey) {
      alert('Invalid Access Key');
      return false;
    }

    try {
      if (modalType === 'delete') {
        await deleteProduct({
          id: product._id,
          categoryId: product.categoryId?._id || product.categoryId,
          shopId: product.shopId,
          key: accessKey,
        });
      } else if (modalType === 'edit' && pendingUpdateData) {
        const updatePayload = {
          name: pendingUpdateData.name,
          buyPrice: Number(pendingUpdateData.buyPrice),
          minSellPrice: Number(pendingUpdateData.minSellPrice),
          maxSellPrice: Number(pendingUpdateData.maxSellPrice),
          note: pendingUpdateData.note,
          stock: pendingUpdateData.stock || '',
          categoryId: product.categoryId?._id || product.categoryId,
          shopId: product.shopId?._id || product.shopId,
        };

        await updateProduct({
          id: product._id,
          updateData: updatePayload,
        });
      }
      return true;
    } catch (error) {
      console.error('Failed to process request:', error);
      alert(error.response?.data?.message || 'Operation failed');
      return false;
    }
  };

  const stockCount = product.stock;

  return (
    <>
      <div
        onClick={handleInfoClick}
        className="bg-(--color-base-100) border border-(--color-border-light) rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-4 hover:border-(--color-primary)/50 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
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

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm md:text-base text-(--color-base-content) leading-snug truncate">
                {product.name}
              </h3>

              {/* স্টকের ব্যাজটি ইমেজের বদলে এখন নামের পাশে বসানো হয়েছে */}
              {stockCount && (
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

        <div className="text-right shrink-0">
          <span className="text-xs text-(--color-text-muted) block font-normal">
            Sell Range
          </span>
          <span className="font-medium text-xs md:text-sm text-(--color-primary)">
            ৳{product.minSellPrice} - ৳{product.maxSellPrice}
          </span>
        </div>
      </div>

      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onDeleteClick={handleDeleteClickFromModal}
        onSaveEdit={handleEditClickFromModal}
      />

      <AccessKeyModal
        isOpen={isAccessModalOpen}
        onClose={() => {
          setIsAccessModalOpen(false);
          setPendingUpdateData(null);
          setModalType(null);
        }}
        onVerify={handleVerifyAccess}
        title={modalType === 'delete' ? 'Delete Product' : 'Update Product'}
        subtitle={`Enter your access key to ${
          modalType === 'delete' ? 'delete this product' : 'save changes'
        }`}
      />
    </>
  );
};

export default ProductListItem;
