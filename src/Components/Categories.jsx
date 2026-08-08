import { useContext, useState } from 'react';
import {
  PiPlusBold,
  PiPencilSimpleBold,
  PiCheckBold,
  PiTrashBold,
  PiSpinnerBold,
} from 'react-icons/pi';
import { X } from 'lucide-react';
import { Context } from '../Context/ContextProvider';
import AccessKeyModal from './AccessKeyModal';

const Categories = ({
  setIsSidebarOpen,
  activeCategory = 'all',
  setActiveCategory,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [pendingActionType, setPendingActionType] = useState(null); // 'action' or 'delete'
  const [targetDeleteId, setTargetDeleteId] = useState(null);

  const {
    shop,
    categories = [],
    categoriesLoading: sidebarLoading,
    createCategory,
    createCategoryPending,
    updateCategory,
    updateCategoryPending,
    deleteCategory,
    deleteCategoryPending,
  } = useContext(Context);

  const handleActionClick = () => {
    const categoryName = newCategoryName?.trim();

    if (!categoryName) {
      console.log('Error: Category name is invalid');
      return;
    }

    if (!shop?._id) {
      console.log('Error: Shop ID is missing');
      return;
    }

    setPendingActionType('action');
    setIsAccessModalOpen(true);
  };

  const handleDeleteClick = id => {
    setTargetDeleteId(id);
    setPendingActionType('delete');
    setIsAccessModalOpen(true);
  };

  const handleVerifyAccess = async accessKey => {
    if (accessKey !== shop?.key) {
      alert('Error: Invalid secret key!');
      return false;
    }

    try {
      if (pendingActionType === 'action') {
        const categoryName = newCategoryName?.trim();
        if (editingId) {
          await updateCategory({
            id: editingId,
            name: categoryName,
            shopId: shop._id,
          });
          setEditingId(null);
        } else {
          await createCategory({
            shopId: shop._id,
            name: categoryName,
          });
        }
        setNewCategoryName('');
      } else if (pendingActionType === 'delete' && targetDeleteId) {
        setDeletingId(targetDeleteId);
        await deleteCategory({
          id: targetDeleteId,
          shopId: shop._id,
        });

        if (editingId === targetDeleteId) {
          setEditingId(null);
          setNewCategoryName('');
        }

        if (activeCategory === targetDeleteId && setActiveCategory) {
          setActiveCategory('all');
        }
      }
      return true;
    } catch (error) {
      console.error('Operation failed:', error);
      return false;
    } finally {
      setDeletingId(null);
      setTargetDeleteId(null);
      setPendingActionType(null);
    }
  };

  const startEdit = category => {
    setEditingId(category._id);
    setNewCategoryName(category.name);
  };

  const handleCategoryClick = categoryId => {
    setActiveCategory?.(categoryId);

    // Mobile Sidebar Close
    if (window.innerWidth < 768) {
      setIsSidebarOpen?.(false);
    }
  };

  // Check if current action is pending
  const isActionPending = editingId
    ? updateCategoryPending
    : createCategoryPending;

  return (
    <>
      <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
        {sidebarLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--color-primary)"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-end items-center pr-2 md:hidden pt-2">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-xl bg-(--color-base-300) hover:bg-(--color-base-300)/80 transition-colors"
              >
                <X size={16} className="text-(--color-base-content)" />
              </button>
            </div>

            {/* নতুন ক্যাটাগরি অ্যাড বা এডিট করার ফর্ম */}
            <div className="p-4 border-b border-(--color-border-light) shrink-0">
              <div className="flex flex-col gap-2.5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-(--color-text-muted)">
                  {editingId ? 'Edit Category' : 'Add New Category'}
                </h3>
                <input
                  className="p-3 bg-(--color-base-100) border border-(--color-border-light) rounded-xl outline-none text-sm text-(--color-base-content) focus:border-(--color-primary) transition-all shadow-inner"
                  placeholder="Category Name (e.g. Light, Switch)..."
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  disabled={isActionPending}
                />
                <button
                  onClick={handleActionClick}
                  disabled={isActionPending}
                  className={`w-full p-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm border cursor-pointer transition-all ${
                    editingId
                      ? 'bg-(--color-success)/10 border-(--color-success)/30 text-(--color-success) hover:bg-(--color-success)/20'
                      : 'bg-(--color-primary) border-transparent text-white shadow-lg shadow-(--color-primary)/20 hover:opacity-95'
                  } ${isActionPending ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isActionPending ? (
                    <PiSpinnerBold size={16} className="animate-spin" />
                  ) : editingId ? (
                    <PiCheckBold size={16} />
                  ) : (
                    <PiPlusBold size={16} />
                  )}
                  <span>
                    {isActionPending
                      ? editingId
                        ? 'Updating...'
                        : 'Adding...'
                      : editingId
                        ? 'Update Category'
                        : 'Add Category'}
                  </span>
                </button>
              </div>
            </div>

            {/* ক্যাটাগরি লিস্ট */}
            <div className="p-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-(--color-text-muted) mb-3">
                Categories List
              </h3>

              <div className="flex flex-col gap-1">
                {/* All Products Virtual Category */}
                <button
                  type="button"
                  onClick={() => handleCategoryClick('all')}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                    activeCategory === 'all'
                      ? 'text-(--color-primary) font-semibold'
                      : 'text-(--color-base-content)'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        activeCategory === 'all'
                          ? 'bg-(--color-primary)'
                          : 'bg-(--color-text-muted)/40'
                      }`}
                    />
                    <span>All Products</span>
                  </div>
                </button>

                {categories.map(category => {
                  const isSelected = activeCategory === category._id;
                  const isThisDeleting =
                    deletingId === category._id &&
                    (deleteCategoryPending ?? true);

                  return (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() => handleCategoryClick(category._id)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                        isSelected
                          ? 'text-(--color-primary) font-semibold'
                          : 'text-(--color-base-content)'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-2 h-2 rounded-full transition-colors ${
                            isSelected
                              ? 'bg-(--color-primary)'
                              : 'bg-(--color-text-muted)/40 group-hover:bg-(--color-primary)/60'
                          }`}
                        ></span>
                        <span>{category.name}</span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          onClick={e => {
                            e.stopPropagation();
                            startEdit(category);
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'text-(--color-primary) hover:bg-(--color-primary)/10'
                              : 'text-(--color-text-muted) hover:text-(--color-primary)'
                          }`}
                          title="Edit"
                        >
                          <PiPencilSimpleBold size={15} />
                        </span>
                        <span
                          onClick={e => {
                            e.stopPropagation();
                            if (!isThisDeleting)
                              handleDeleteClick(category._id);
                          }}
                          className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'text-(--color-error) hover:bg-(--color-error)/10'
                              : 'text-(--color-text-muted) hover:text-(--color-error)'
                          } ${
                            isThisDeleting
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          title="Delete"
                        >
                          {isThisDeleting ? (
                            <PiSpinnerBold
                              size={15}
                              className="animate-spin text-(--color-error)"
                            />
                          ) : (
                            <PiTrashBold size={15} />
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Access Key Modal */}
      <AccessKeyModal
        isOpen={isAccessModalOpen}
        onClose={() => {
          setIsAccessModalOpen(false);
          setPendingActionType(null);
          setTargetDeleteId(null);
        }}
        onVerify={handleVerifyAccess}
        title={
          pendingActionType === 'delete'
            ? 'Delete Category'
            : editingId
              ? 'Update Category'
              : 'Add Category'
        }
        subtitle="Enter your access key to proceed"
      />
    </>
  );
};

export default Categories;
