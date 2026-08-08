import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Context } from '../Context/ContextProvider';
// যদি আইকন ব্যবহার করতে চান, যেমন Lucide React থেকে (ঐচ্ছিক):
// import { Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [keyInput, setKeyInput] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();

  const { shopEnter, shopEnterPending, setShop } = useContext(Context);

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const data = await shopEnter({ pin, key: keyInput });

      if (!data.success) {
        return;
      }

      setShop(data.shop);

      localStorage.setItem('shop', JSON.stringify(data.shop));
      localStorage.setItem('isShopLoggedIn', 'true');

      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Invalid Shop Name/Key or PIN');
    }
  };

  // টেস্ট ডাটা অটো-ফিল করার ফাংশন
  const handleFillDemoData = () => {
    setKeyInput('MS Electronics');
    setPin('0000');
  };

  return (
    <div className="w-full max-w-md bg-(--color-base-100) border border-(--color-border-light) rounded-3xl p-8 shadow-sm flex flex-col items-center relative">
      {/* নতুন ডিজাইনের বাটন */}
      <button
        type="button"
        onClick={handleFillDemoData}
        title="Fill Demo Data"
        className="absolute top-4 right-4 group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-(--color-primary) bg-(--color-primary)/10 hover:bg-(--color-primary) hover:text-white rounded-full transition-all duration-200 border border-(--color-primary)/20 hover:border-transparent shadow-xs active:scale-95 cursor-pointer"
      >
        {/* কি (Key) আইকন */}
        <svg
          className="w-3.5 h-3.5 transition-transform group-hover:rotate-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 0 1 2 2m4 0a6 6 0 0 1-7.743 5.743L11 18H9v2H7v2H4a1 1 0 0 1-1-1v-2.586a1 1 0 0 1 .293-.707l5.964-5.964A6 6 0 1 1 21 9z"
          />
        </svg>
        <span>Demo</span>
      </button>

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
      <form onSubmit={handleLogin} className="w-full space-y-4">
        <div>
          <input
            type="text"
            required
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            placeholder="Shop Name or Access Key"
            className="w-full h-11 px-4 text-xs font-medium bg-(--color-base-100) rounded-xl text-(--color-primary) outline-none transition-all placeholder:text-(--color-text-muted)/50"
          />
        </div>

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

      {/* শপ না থাকলে ক্রিয়েট করার লিংক */}
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
