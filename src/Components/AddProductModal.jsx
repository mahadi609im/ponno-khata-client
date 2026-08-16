import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ImagePlus,
  Check,
  Plus,
  Loader2,
  Layers,
  Minus,
} from 'lucide-react';
import { useCreateProduct } from '../api/useProductHandle';
import AccessKeyModal from './AccessKeyModal';

const AddProductModal = ({
  isOpen,
  onClose,
  activeCategory,
  categories,
  shopId,
  shop,
}) => {
  const [loading, setLoading] = useState(false);
  const { mutateAsync: createProduct } = useCreateProduct();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stock, setStock] = useState(1);

  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [pendingFormEvent, setPendingFormEvent] = useState(null);

  const currentCategoryObj = categories.find(cat => cat._id === activeCategory);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleStockChange = delta => {
    setStock(prev => Math.max(1, (Number(prev) || 1) + delta));
  };

  const handleInitialSubmit = e => {
    e.preventDefault();
    setPendingFormEvent(e);
    setIsAccessModalOpen(true);
  };

  const handleVerifyAndSubmit = async accessKeyInput => {
    if (accessKeyInput !== shop?.key) {
      alert('Invalid Access Key');
      return false;
    }

    if (!pendingFormEvent) return false;

    const form = pendingFormEvent.target;
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('shopId', shopId);
      formData.append('categoryId', activeCategory);
      formData.append('name', form.name.value);
      formData.append('buyPrice', Number(form.buyPrice.value));
      formData.append('minSellPrice', Number(form.minSellPrice.value));
      formData.append('maxSellPrice', Number(form.maxSellPrice.value));

      // এখানে সরাসরি স্টেট বা ইনপুটের ভ্যালু নিশ্চিত করে পাঠানো হচ্ছে
      const finalStock = stock === '' ? 1 : Number(stock);
      formData.append('stock', finalStock);

      formData.append('note', form.note.value);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createProduct(formData);

      form.reset();
      setImageFile(null);
      setImagePreview(null);
      setStock(1);
      onClose();
      return true;
    } catch (error) {
      console.error(
        'Error adding product:',
        error.response?.data || error.message,
      );
      return false;
    } finally {
      setLoading(false);
      setPendingFormEvent(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-(--color-base-100) border border-(--color-border-light) rounded-2xl w-full max-w-md p-5 shadow-xl relative my-auto overflow-hidden"
          >
            {/* Minimal Top Line Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-(--color-primary)" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-(--color-border-light)/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-(--color-base-content)">
                    Add New Product
                  </h3>
                  <p className="text-[11px] text-(--color-base-content)/60">
                    Category:{' '}
                    <span className="font-medium text-(--color-primary)">
                      {currentCategoryObj?.name || 'General'}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-(--color-base-200) hover:bg-(--color-base-300) text-(--color-base-content)/70 hover:text-(--color-base-content) transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleInitialSubmit} className="space-y-3 pt-3">
              {/* Product Name & Stock (Inline Row) */}
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <label className="block text-[11px] font-semibold text-(--color-base-content)/70 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Organic Honey 500g"
                    className="w-full px-3 py-2 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-(--color-base-content) focus:outline-none focus:border-(--color-primary) transition-all"
                  />
                </div>
                <div className="w-28 shrink-0">
                  <label className="text-[11px] font-semibold text-(--color-base-content)/70 mb-1 flex items-center gap-1">
                    <Layers size={11} /> Stock
                  </label>
                  <div className="flex items-center justify-between bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl px-1 h-8.5">
                    <button
                      type="button"
                      onClick={() => handleStockChange(-1)}
                      className="w-6 h-6 rounded-lg bg-(--color-base-200) hover:bg-(--color-base-300) flex items-center justify-center text-(--color-base-content) transition-colors cursor-pointer shrink-0"
                    >
                      <Minus size={11} />
                    </button>

                    <input
                      type="number"
                      name="stock"
                      min="1"
                      value={stock}
                      onChange={e => {
                        const val = e.target.value;
                        if (val === '') {
                          setStock('');
                          return;
                        }
                        setStock(Number(val));
                      }}
                      required
                      className="flex-1 w-full text-center text-xs bg-transparent text-(--color-base-content) outline-none font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />

                    <button
                      type="button"
                      onClick={() => handleStockChange(1)}
                      className="w-6 h-6 rounded-lg bg-(--color-base-200) hover:bg-(--color-base-300) flex items-center justify-center text-(--color-base-content) transition-colors cursor-pointer shrink-0"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Upload Box (Compact) */}
              <div>
                <label className="block text-[11px] font-semibold text-(--color-base-content)/70 mb-1">
                  Product Image{' '}
                  <span className="text-[10px] opacity-60">(Optional)</span>
                </label>
                <div className="flex items-center gap-3">
                  {imagePreview ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-(--color-border-light) shrink-0">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-0.5 right-0.5 bg-black/70 text-white p-0.5 rounded-full text-[10px]"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-(--color-base-200)/60 border border-dashed border-(--color-border-light) flex items-center justify-center text-(--color-base-content)/40 shrink-0">
                      <ImagePlus size={18} />
                    </div>
                  )}

                  <label className="flex-1 flex items-center justify-between px-3 py-2 border border-dashed border-(--color-border-light) hover:border-(--color-primary) rounded-xl bg-(--color-base-200)/30 hover:bg-(--color-primary)/5 cursor-pointer transition-all text-xs">
                    <span className="truncate text-(--color-base-content)/70 max-w-40">
                      {imageFile ? imageFile.name : 'Choose image...'}
                    </span>
                    <span className="px-2 py-1 bg-(--color-primary)/10 text-(--color-primary) text-[10px] font-bold rounded-lg">
                      Browse
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Pricing Grid (3 Column Compact) */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-(--color-base-content)/70 mb-1">
                    Buy Price
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="buyPrice"
                    required
                    placeholder="0.00"
                    className="w-full px-2.5 py-2 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-(--color-base-content) focus:outline-none focus:border-(--color-primary) transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-(--color-base-content)/70 mb-1">
                    Min Sell
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="minSellPrice"
                    required
                    placeholder="0.00"
                    className="w-full px-2.5 py-2 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-(--color-base-content) focus:outline-none focus:border-(--color-primary) transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-(--color-base-content)/70 mb-1">
                    Max Sell
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="maxSellPrice"
                    required
                    placeholder="0.00"
                    className="w-full px-2.5 py-2 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-(--color-base-content) focus:outline-none focus:border-(--color-primary) transition-all"
                  />
                </div>
              </div>

              {/* Note Field */}
              <div>
                <label className="block text-[11px] font-semibold text-(--color-base-content)/70 mb-1">
                  Note{' '}
                  <span className="text-[10px] opacity-60">(Optional)</span>
                </label>
                <textarea
                  name="note"
                  rows="2"
                  placeholder="Add details..."
                  className="w-full px-3 py-2 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-(--color-base-content) focus:outline-none focus:border-(--color-primary) transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-(--color-border-light)/60 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-[11px] font-bold uppercase tracking-wide bg-(--color-base-200) hover:bg-(--color-base-300) rounded-xl text-(--color-base-content)/80 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-[11px] font-bold uppercase tracking-wide bg-(--color-primary) hover:opacity-95 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>

      <AccessKeyModal
        isOpen={isAccessModalOpen}
        onClose={() => {
          setIsAccessModalOpen(false);
          setPendingFormEvent(null);
        }}
        onVerify={handleVerifyAndSubmit}
        title="Enter Access Key"
        subtitle="Verify security key to save product"
      />
    </>
  );
};

export default AddProductModal;
