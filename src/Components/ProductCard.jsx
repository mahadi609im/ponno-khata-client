import { useState, useContext } from 'react';
import { Package } from 'lucide-react';
import { useDeleteProduct, useUpdateProduct } from '../api/useProductHandle';
import { Context } from '../Context/ContextProvider';
import AccessKeyModal from './AccessKeyModal';
import ProductDetailsModal from './ProductDetailsModal';

const ProductCard = ({ product }) => {
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { shop } = useContext(Context);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);

  const handleInfoClick = () => {
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
        className="bg-(--color-base-100) border border-(--color-border-light) rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-(--color-primary)/50 transition-all group relative cursor-pointer"
      >
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

          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-sm md:text-base text-(--color-base-content) line-clamp-1 leading-snug">
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

export default ProductCard;
