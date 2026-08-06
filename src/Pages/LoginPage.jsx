import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Context } from '../Context/ContextProvider';

const LoginPage = () => {
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const { shopEnter, shopEnterPending, setShop } = useContext(Context);

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const data = await shopEnter({ pin });

      if (!data.success) {
        return;
      }

      setShop(data.shop);

      localStorage.setItem('shop', JSON.stringify(data.shop));
      localStorage.setItem('isShopLoggedIn', 'true');

      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Invalid PIN');
    }
  };

  return (
    <div className="w-full max-w-md bg-(--color-base-100) border border-(--color-border-light) rounded-3xl p-8 shadow-sm flex flex-col items-center">
      <div className="w-44 h-44 mb-4 flex items-center justify-center">
        <img
          src="/loginImgs.svg"
          alt="Login Illustration"
          className="w-full h-full object-contain"
        />
      </div>

      {/* শপ নেম ও সাবটাইটেল */}
      <h1 className="text-xl font-bold text-(--color-base-content) mb-1">
        Assalamu-Alaikum
      </h1>
      <p className="text-xs text-(--color-text-muted) mb-6">
        Enter your security PIN to access dashboard
      </p>

      {/* লগইন ফর্ম */}
      <form onSubmit={handleLogin} className="w-full space-y-5">
        {/* অটো ফোকাসসহ বড় পিন ইনপুট বক্স */}
        <div>
          <input
            type="password"
            maxLength={6}
            value={pin}
            autoFocus
            onChange={e => setPin(e.target.value)}
            placeholder="••••"
            className="w-full h-16 text-center text-3xl tracking-widest font-bold bg-(--color-base-200)/50 border border-(--color-border-light) rounded-2xl text-(--color-base-content) outline-none focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 transition-all placeholder:text-(--color-text-muted)/40"
            required
          />
        </div>

        {/* সাবমিট বাটন (লোডিং স্টেট সহ) */}
        <button
          type="submit"
          disabled={shopEnterPending}
          className="w-full h-12 bg-(--color-primary) text-white font-semibold rounded-2xl shadow-sm hover:opacity-90 transition-all cursor-pointer disabled:opacity-60"
        >
          {shopEnterPending ? 'Checking...' : 'Access Store'}
        </button>
      </form>

      {/* শপ না থাকলে ক্রিয়েট করার লিংক */}
      <p className="text-xs text-(--color-text-muted) mt-6 text-center">
        Don't have a shop?{' '}
        <Link
          to="/auth/register"
          className="font-semibold text-(--color-primary) hover:underline"
        >
          Create shop
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
