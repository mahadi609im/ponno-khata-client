import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ImagePlus, Check, Plus, Loader2 } from 'lucide-react';
import { useCreateProduct } from '../api/useProductHandle';

const AddProductModal = ({
  isOpen,
  onClose,
  activeCategory,
  categories,
  shopId,
}) => {
  const [loading, setLoading] = useState(false);
  const { mutateAsync: createProduct } = useCreateProduct();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const currentCategoryObj = categories.find(cat => cat._id === activeCategory);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const form = e.target;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('shopId', shopId);
      formData.append('categoryId', activeCategory);

      formData.append('name', form.name.value);

      formData.append('buyPrice', Number(form.buyPrice.value));

      formData.append('minSellPrice', Number(form.minSellPrice.value));

      formData.append('maxSellPrice', Number(form.maxSellPrice.value));

      // Image optional
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createProduct(formData);

      form.reset();

      setImageFile(null);

      setImagePreview(null);

      onClose();
    } catch (error) {
      console.error(
        'Error adding product:',
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="bg-(--color-base-100) border border-(--color-border-light) rounded-3xl w-full max-w-lg p-6 md:p-7 shadow-2xl relative my-auto overflow-hidden"
        >
          {/* Top Glow Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-(--color-primary) to-(--color-secondary,var(--color-primary))" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-(--color-border-light)">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center">
                <Plus size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-(--color-base-content)">
                  Add New Product
                </h3>
                <p className="text-xs text-(--color-base-content)/60 mt-0.5">
                  Target Category:{' '}
                  <span className="font-semibold text-(--color-primary)">
                    {currentCategoryObj?.name || 'General'}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-(--color-base-300)/50 hover:bg-(--color-base-300) text-(--color-base-content) transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-5">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-(--color-base-content)/70 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Organic Honey 500g"
                className="w-full px-4 py-3 text-sm bg-(--color-base-200)/70 border border-(--color-border-light) rounded-2xl text-(--color-base-content) focus:outline-none focus:border-(--color-primary) transition-all font-medium"
              />
            </div>

            {/* Image Upload Box */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-(--color-base-content)/70 mb-1.5">
                Product Image
              </label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-(--color-border-light) shadow-sm shrink-0">
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
                      className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full text-xs hover:bg-black"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-(--color-base-200) border border-dashed border-(--color-border-light) flex items-center justify-center text-(--color-base-content)/40 shrink-0">
                    <ImagePlus size={22} />
                  </div>
                )}

                <label className="flex-1 flex items-center justify-between px-4 py-3 border border-dashed border-(--color-border-light) hover:border-(--color-primary) rounded-2xl bg-(--color-base-200)/40 hover:bg-(--color-primary)/5 cursor-pointer transition-all">
                  <span className="text-xs font-medium text-(--color-base-content)/80">
                    {imageFile ? imageFile.name : 'Upload product image...'}
                  </span>
                  <span className="px-3 py-1.5 bg-(--color-primary)/10 text-(--color-primary) text-xs font-bold rounded-xl">
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

            {/* Pricing Section (3 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-(--color-base-content)/70 mb-1.5">
                  Buy Price
                </label>
                <input
                  type="number"
                  step="any"
                  name="buyPrice"
                  required
                  placeholder="0.00"
                  className="w-full px-3.5 py-3 text-sm bg-(--color-base-200)/70 border border-(--color-border-light) rounded-2xl text-(--color-base-content) focus:outline-none focus:border-(--color-primary) transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-(--color-base-content)/70 mb-1.5">
                  Min Sell Price
                </label>
                <input
                  type="number"
                  step="any"
                  name="minSellPrice"
                  required
                  placeholder="0.00"
                  className="w-full px-3.5 py-3 text-sm bg-(--color-base-200)/70 border border-(--color-border-light) rounded-2xl text-(--color-base-content) focus:outline-none focus:border-(--color-primary) transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-(--color-base-content)/70 mb-1.5">
                  Max Sell Price
                </label>
                <input
                  type="number"
                  step="any"
                  name="maxSellPrice"
                  required
                  placeholder="0.00"
                  className="w-full px-3.5 py-3 text-sm bg-(--color-base-200)/70 border border-(--color-border-light) rounded-2xl text-(--color-base-content) focus:outline-none focus:border-(--color-primary) transition-all font-medium"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-5 border-t border-(--color-border-light) mt-5">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-(--color-base-300)/50 hover:bg-(--color-base-300) rounded-2xl text-(--color-base-content) transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-(--color-primary) hover:opacity-95 text-white rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-(--color-primary)/20 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Check size={16} />
                )}
                {loading ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddProductModal;
