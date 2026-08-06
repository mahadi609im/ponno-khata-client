import { useLocation } from 'react-router';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-(--color-base-200)">
      <div className="grid md:grid-cols-2 items-center gap-8 md:gap-12 max-w-4xl w-full bg-(--color-base-100) backdrop-blur-2xl p-8 sm:p-12 rounded-3xl border border-(--color-border-light) shadow-2xl shadow-(--color-base-content)/5">
        {/* Left Column: SVG Illustration */}
        <div className="relative flex justify-center items-center order-last md:order-first">
          <div className="absolute w-48 h-48 sm:w-60 sm:h-60 bg-(--color-primary)/15 rounded-full blur-[80px] pointer-events-none" />

          <img
            src="/notfound.svg"
            alt="404 Illustration"
            className="relative w-full max-w-[260px] sm:max-w-xs h-auto object-contain drop-shadow-xl"
            width={400}
            height={400}
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden items-center justify-center w-60 h-60 bg-(--color-base-200)/80 border border-(--color-border-light) rounded-2xl text-red-500">
            <span className="text-9xl font-bold">!</span>
          </div>
        </div>

        {/* Right Column: Minimal & Clean Text Content */}
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-(--color-base-content) tracking-tight">
            Oops! Page Not Found
          </h1>

          {/* Dynamic & Meaningful Message */}
          <p className="text-xs sm:text-sm text-(--color-text-muted) leading-relaxed">
            Oops! The page you are looking for (
            <code className="px-1.5 py-0.5 bg-(--color-base-200) rounded text-(--color-base-content) font-mono">
              {currentPath}
            </code>
            ) could not be found. It may have been moved, deleted, or the URL
            might be incorrect.
          </p>

          {/* Action Area: One Button & One Link Style Back */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
            <button
              onClick={() => window.history.back()}
              className="group flex items-center gap-1.5 text-xs font-medium text-(--color-primary) hover:text-(--color-base-content) transition-colors cursor-pointer py-2"
            >
              <ArrowLeft
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Back to home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
