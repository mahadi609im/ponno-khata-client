import { Search, LayoutGrid, List } from 'lucide-react';

const ProductToolbar = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      {/* Title & Subtitle */}
      <div className="min-w-0">
        <h2 className="text-xl md:text-2xl font-bold text-(--color-base-content) tracking-tight">
          All Products
        </h2>

        <p className="text-xs text-(--color-text-muted) mt-0.5">
          Manage your store inventory efficiently
        </p>
      </div>

      {/* Controls */}
      <div className="w-full lg:w-auto flex items-center gap-2 bg-(--color-base-100)/80 backdrop-blur-md p-1.5 rounded-2xl border border-(--color-border-light) shadow-lg shadow-(--color-base-content)/5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--color-text-muted)">
            <Search size={15} />
          </span>

          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full lg:w-52 pl-9 pr-3 py-2 lg:py-1.5 bg-(--color-base-200)/50 border border-(--color-border-light) rounded-xl text-xs text-(--color-base-content) outline-none focus:border-(--color-primary) transition-all shadow-inner"
          />
        </div>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-(--color-border-light) shrink-0" />

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-(--color-primary) text-white shadow-sm scale-105'
                : 'text-(--color-text-muted) hover:text-(--color-base-content) hover:bg-(--color-base-200)'
            }`}
            title="Grid View"
          >
            <LayoutGrid size={15} />
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-(--color-primary) text-white shadow-sm scale-105'
                : 'text-(--color-text-muted) hover:text-(--color-base-content) hover:bg-(--color-base-200)'
            }`}
            title="List View"
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
