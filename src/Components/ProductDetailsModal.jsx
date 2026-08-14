import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Edit3,
  Trash2,
  Check,
  Image as ImageIcon,
  Tag,
  TrendingUp,
  PlusCircle,
} from 'lucide-react';

const ProductDetailsModal = ({
  isOpen,
  onClose,
  product,
  onDeleteClick,
  onSaveEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);

  const [formData, setFormData] = useState({
    name: '',
    buyPrice: '',
    minSellPrice: '',
    maxSellPrice: '',
    note: '',
  });

  useEffect(() => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name || '',
        buyPrice: product.buyPrice || '',
        minSellPrice: product.minSellPrice || '',
        maxSellPrice: product.maxSellPrice || '',
        note: product.note || '',
      });
      setIsEditing(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (onSaveEdit) {
      onSaveEdit(formData); // প্যারেন্টে ডেটা পাঠিয়ে মডাল হ্যান্ডেল করবে
    }
  };

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="bg-(--color-base-100) border border-(--color-border-light) rounded-xl w-full max-w-sm max-h-[90vh] shadow-2xl overflow-y-auto flex flex-col my-auto relative"
        >
          <div className="relative w-full h-52 bg-(--color-base-200) shrink-0 overflow-hidden border-b border-(--color-border-light) flex items-center justify-center">
            {currentProduct.image ? (
              <>
                <div
                  className="absolute inset-0 bg-cover bg-center blur-md opacity-30 scale-110"
                  style={{ backgroundImage: `url(${currentProduct.image})` }}
                />
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="relative z-10 w-full h-full object-contain drop-shadow-md"
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-(--color-text-muted) gap-1.5 bg-(--color-base-200)/50">
                <ImageIcon size={32} />
                <span className="text-xs font-medium">No image available</span>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/65 hover:bg-black/85 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-xs shadow-md z-20"
            >
              <X size={15} />
            </button>
          </div>

          {/* Content Body */}
          <div className="p-4.5">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-(--color-text-muted) uppercase tracking-wider mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-9 px-3 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-lg text-(--color-base-content) outline-none focus:border-(--color-primary) font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-(--color-text-muted) uppercase tracking-wider mb-1">
                      Buy
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="buyPrice"
                      value={formData.buyPrice}
                      onChange={handleChange}
                      required
                      className="w-full h-9 px-2 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-lg text-(--color-base-content) outline-none focus:border-(--color-primary) font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-(--color-text-muted) uppercase tracking-wider mb-1">
                      Min Sell
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="minSellPrice"
                      value={formData.minSellPrice}
                      onChange={handleChange}
                      required
                      className="w-full h-9 px-2 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-lg text-(--color-base-content) outline-none focus:border-(--color-primary) font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-(--color-text-muted) uppercase tracking-wider mb-1">
                      Max Sell
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="maxSellPrice"
                      value={formData.maxSellPrice}
                      onChange={handleChange}
                      required
                      className="w-full h-9 px-2 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-lg text-(--color-base-content) outline-none focus:border-(--color-primary) font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-(--color-text-muted) uppercase tracking-wider mb-1">
                    Note
                  </label>
                  <textarea
                    name="note"
                    rows="2"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Add a note here..."
                    className="w-full p-2.5 text-xs bg-(--color-base-200)/50 border border-(--color-border-light) rounded-lg text-(--color-base-content) outline-none focus:border-(--color-primary) resize-none font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 h-8 bg-(--color-base-200) text-(--color-base-content) text-xs font-medium rounded-lg hover:opacity-80 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 h-8 bg-(--color-primary) text-white text-xs font-medium rounded-lg hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Check size={13} />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-(--color-base-content) leading-snug wrap-break-word whitespace-pre-wrap">
                    {currentProduct.name}
                  </h4>

                  <div className="mt-1 mb-5">
                    {currentProduct.note ? (
                      <p className="text-xs text-(--color-text-muted) italic wrap-break-word whitespace-pre-wrap">
                        &quot;{currentProduct.note}&quot;
                      </p>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="text-[11px] text-(--color-text-muted) hover:text-(--color-primary) flex items-center gap-1 transition-colors cursor-pointer pt-0.5"
                      >
                        <PlusCircle size={12} /> No note added. Click to write
                        one.
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 bg-(--color-base-200)/40 p-3 rounded-lg border border-(--color-border-light)">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-(--color-text-muted) flex items-center gap-1.5">
                      <Tag size={12} /> Buy Price
                    </span>
                    <span className="text-xs font-bold text-(--color-base-content)">
                      ৳{currentProduct.buyPrice}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-(--color-border-light)/60">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-(--color-text-muted) flex items-center gap-1.5">
                      <TrendingUp size={12} /> Sell Range
                    </span>
                    <span className="text-xs font-bold text-(--color-primary)">
                      ৳{currentProduct.minSellPrice} - ৳
                      {currentProduct.maxSellPrice}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-(--color-border-light)">
                  <button
                    onClick={() => {
                      if (onDeleteClick) onDeleteClick();
                    }}
                    className="px-3 h-8 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3.5 h-8 text-xs font-semibold bg-(--color-base-200) hover:bg-(--color-base-300) text-(--color-base-content) rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <Edit3 size={13} />
                    Edit Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};

export default ProductDetailsModal;
