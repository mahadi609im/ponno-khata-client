import { useState } from 'react';
import { X, KeyRound, Loader2 } from 'lucide-react';

const AccessKeyModal = ({ isOpen, onClose, onVerify, title, subtitle }) => {
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    if (!accessKeyInput) return;

    setLoading(true);
    const isValid = await onVerify(accessKeyInput);
    setLoading(false);

    if (isValid) {
      setAccessKeyInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-(--color-base-100) border border-(--color-border-light) rounded-3xl p-6 shadow-xl flex flex-col relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-(--color-text-muted) hover:text-(--color-base-content) p-1 rounded-lg cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-(--color-primary)/10 text-(--color-primary) flex items-center justify-center shrink-0">
            <KeyRound size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-(--color-base-content)">
              {title || 'Enter Access Key'}
            </h3>
            <p className="text-xs text-(--color-text-muted)">
              {subtitle || 'Verify security key to proceed'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              required
              autoFocus
              placeholder="Enter store access key"
              value={accessKeyInput}
              onChange={e => setAccessKeyInput(e.target.value)}
              className="w-full h-11 px-4 text-xs font-medium bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-(--color-base-content) outline-none focus:border-(--color-primary) transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 h-10 bg-(--color-base-200) text-(--color-base-content) text-xs font-semibold rounded-xl hover:opacity-80 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 h-10 bg-(--color-primary) text-white text-xs font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessKeyModal;
