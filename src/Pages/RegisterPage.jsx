import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Context } from '../Context/ContextProvider';
import { Store, KeyRound, Lock, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [shopName, setShopName] = useState('');
  const [pin, setPin] = useState('');
  const [key, setKey] = useState('');

  const navigate = useNavigate();

  // Context থেকে shopRegister এবং shopRegisterPending নেওয়া হলো
  const { shopRegister, shopRegisterPending } = useContext(Context);

  const handleRegister = async e => {
    e.preventDefault();

    try {
      const data = await shopRegister({
        shopName,
        pin,
        key,
      });

      // ব্যাকএন্ড রেসপন্স সফল হলে লোকালস্টোরেজ এবং রিডাইরেক্ট হ্যান্ডেল করা
      if (data && data.shop) {
        localStorage.setItem('current_shop', JSON.stringify(data.shop));
        localStorage.setItem('isShopLoggedIn', 'true');
      }

      navigate('/');
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          'Failed to register shop. Please check your details.',
      );
    }
  };

  return (
    <div className="w-full max-w-md bg-(--color-base-100) border border-(--color-border-light) rounded-3xl p-8 shadow-sm flex flex-col items-center">
      {/* ইলাস্ট্রেশন বা আইকন */}
      <div className="w-24 h-24 mb-4 flex items-center justify-center bg-(--color-primary)/10 text-(--color-primary) rounded-2xl border border-(--color-primary)/20 shadow-inner">
        <Store size={40} />
      </div>

      {/* টাইটেল ও সাবটাইটেল */}
      <h1 className="text-xl font-bold text-(--color-base-content) mb-1">
        Create Your Shop
      </h1>
      <p className="text-xs text-(--color-text-muted) mb-6 text-center">
        Enter your shop details, security PIN, and Access Key to get started
      </p>

      {/* রেজিস্টার ফর্ম */}
      <form onSubmit={handleRegister} className="w-full space-y-4">
        {/* Shop Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--color-text-muted)">
            Shop Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--color-text-muted)">
              <Store size={16} />
            </span>
            <input
              type="text"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              placeholder="e.g. MS Electronics"
              className="w-full pl-9 pr-3 py-2.5 bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-xs text-(--color-base-content) outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 transition-all"
              required
            />
          </div>
        </div>

        {/* PIN Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--color-text-muted)">
            Security PIN (Max 6 digits)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--color-text-muted)">
              <Lock size={16} />
            </span>
            <input
              type="password"
              maxLength={6}
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="••••"
              className="w-full pl-9 pr-3 py-2.5 bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-xs text-(--color-base-content) outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 tracking-widest font-bold"
              required
            />
          </div>
        </div>

        {/* Key Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-(--color-text-muted)">
            Access Key (e.g. A3)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--color-text-muted)">
              <KeyRound size={16} />
            </span>
            <input
              type="text"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Enter unique key (e.g. A3)"
              className="w-full pl-9 pr-3 py-2.5 bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-xs text-(--color-base-content) outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 font-mono font-semibold"
              required
            />
          </div>
        </div>

        {/* সাবমিট বাটন */}
        <button
          type="submit"
          disabled={shopRegisterPending}
          className="w-full h-12 mt-2 bg-(--color-primary) text-white font-semibold rounded-2xl shadow-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 text-xs"
        >
          <span>
            {shopRegisterPending ? 'Creating Shop...' : 'Register Shop'}
          </span>
          <ArrowRight size={16} />
        </button>
      </form>

      {/* লগইন পেজে যাওয়ার লিংক */}
      <p className="text-xs text-(--color-text-muted) mt-6 text-center">
        Already have a shop?{' '}
        <Link
          to="/auth/login"
          className="font-semibold text-(--color-primary) hover:underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
