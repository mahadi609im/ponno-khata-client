import { useState, useContext } from 'react';
import { Package, Info } from 'lucide-react';
import { useDeleteProduct, useUpdateProduct } from '../api/useProductHandle';
import { Context } from '../Context/ContextProvider';
import AccessKeyModal from './AccessKeyModal';
import ProductDetailsModal from './ProductDetailsModal';

const ProductCard = ({ product }) => {
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { shop } = useContext(Context);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // কোন অ্যাকশনের জন্য মডাল ওপেন হবে ('delete' অথবা 'edit')
  const [modalType, setModalType] = useState(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState(null);

  const handleInfoClick = () => {
    setIsModalOpen(true);
  };

  // ডিলিট বাটনে ক্লিক করলে
  const handleDeleteClickFromModal = () => {
    setIsModalOpen(false); // ডিটেইলস মডাল বন্ধ হবে
    setModalType('delete');
    setIsAccessModalOpen(true); // এক্সেস কি মডাল ওপেন হবে
  };

  // এডিট করার জন্য Save Changes এ ক্লিক করলে
  const handleEditClickFromModal = formData => {
    setIsModalOpen(false); // ডিটেইলস মডাল বন্ধ হবে
    setPendingUpdateData(formData);
    setModalType('edit');
    setIsAccessModalOpen(true); // এক্সেস কি মডাল ওপেন হবে
  };

  // AccessKeyModal থেকে পাস করা Key ভেরিফাই করে কাজ সম্পন্ন করা
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

  return (
    <>
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
          {/* Product Name & Info Button */}
          <div className="flex items-start justify-between gap-2">
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

            <button
              onClick={handleInfoClick}
              className="p-2 rounded-xl bg-(--color-primary)/10 hover:bg-(--color-primary) text-(--color-primary) hover:text-(--color-base-100) transition-all cursor-pointer disabled:opacity-50 shrink-0"
              title="Product info"
            >
              <Info size={16} />
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

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onDeleteClick={handleDeleteClickFromModal}
        onSaveEdit={handleEditClickFromModal}
      />

      {/* Access Key Modal for Delete/Edit */}
      <AccessKeyModal
        isOpen={isAccessModalOpen}
        onClose={() => {
          setIsAccessModalOpen(false);
          setPendingUpdateData(null);
          setModalType(null);
        }}
        onVerify={handleVerifyAccess}
        title={modalType === 'delete' ? 'Delete Product' : 'Update Product'}
        subtitle={`Enter your access key to ${modalType === 'delete' ? 'delete this product' : 'save changes'}`}
      />
    </>
  );
};

export default ProductCard;
