import { useDeferredValue, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { productsApi } from '../lib/api/products';
import { locationApi } from '../lib/api/location';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ProductForm } from '../components/admin/ProductForm';
import { getApiErrorMessage, getApiValidationErrors } from '../lib/utils';
import { Eye, LogOut, Package, Pencil, Plus, Search, Tag, Trash2 } from 'lucide-react';
import type { FilterState, Location, Product, ProductPayload } from '../types';

type StatusFilter = 'all' | 'active' | 'inactive';

function buildAdminFilters(search: string, status: StatusFilter): FilterState {
  const filters: FilterState = {
    page: 1,
    per_page: 50,
  };

  if (search.trim()) {
    filters.q = search.trim();
  }

  if (status !== 'all') {
    filters.is_active = status === 'active';
  }

  return filters;
}

export function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let isCancelled = false;

    const loadLocation = async () => {
      try {
        const locationData = await locationApi.getLocation();

        if (!isCancelled) {
          setLocation(locationData);
        }
      } catch (error) {
        if (!isCancelled) {
          setFeedback({
            type: 'error',
            message: getApiErrorMessage(error, 'Unable to load the Kandy location details.'),
          });
        }
      }
    };

    void loadLocation();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const loadProducts = async () => {
      setIsLoading(true);

      try {
        const response = await productsApi.adminGetProducts(buildAdminFilters(deferredSearch, statusFilter));

        if (!isCancelled) {
          setProducts(response.data);
        }
      } catch (error) {
        if (!isCancelled) {
          setFeedback({
            type: 'error',
            message: getApiErrorMessage(error, 'Failed to load products.'),
          });
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      isCancelled = true;
    };
  }, [deferredSearch, statusFilter]);

  const refreshProducts = async () => {
    const response = await productsApi.adminGetProducts(buildAdminFilters(search, statusFilter));
    setProducts(response.data);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.deleteProduct(id);
        await refreshProducts();
        setFeedback({ type: 'success', message: 'Product deleted successfully.' });
      } catch (error) {
        setFeedback({
          type: 'error',
          message: getApiErrorMessage(error, 'Failed to delete the product.'),
        });
      }
    }
  };

  const handleSubmit = async (payload: ProductPayload | FormData) => {
    setIsSubmitting(true);
    setValidationErrors({});

    try {
      if (selectedProduct) {
        await productsApi.updateProduct(selectedProduct.id, payload);
      } else {
        await productsApi.createProduct(payload);
      }

      await refreshProducts();
      setFeedback({
        type: 'success',
        message: selectedProduct ? 'Product updated successfully.' : 'Product created successfully.',
      });
      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      setValidationErrors(getApiValidationErrors(error));
      setFeedback({
        type: 'error',
        message: getApiErrorMessage(error, 'We could not save the product.'),
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login', { replace: true });
  };

  const openCreateForm = () => {
    setValidationErrors({});
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setValidationErrors({});
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="font-display font-bold text-2xl tracking-tight">Kandy Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 p-3 rounded-md bg-primary text-white font-medium">
            <Package size={20} /> Products
          </a>
          <a href="#" className="flex items-center gap-3 p-3 rounded-md text-white/70 hover:bg-white/5 transition-colors">
            <Tag size={20} /> Categories
          </a>
        </nav>
        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-primary">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => void handleLogout()}
            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-secondary">Product Management</h1>
          <Button size="sm" className="gap-2" onClick={openCreateForm} disabled={!location}>
            <Plus size={18} /> Add Product
          </Button>
        </header>

        <div className="p-8">
          {feedback && (
            <div
              className={`mb-6 rounded-2xl px-4 py-3 text-sm ${
                feedback.type === 'success'
                  ? 'border border-green-100 bg-green-50 text-green-700'
                  : 'border border-red-100 bg-red-50 text-red-700'
              }`}
            >
              {feedback.message}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Total Products</p>
                <p className="text-2xl font-bold text-secondary">{products.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Package size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Active Items</p>
                <p className="text-2xl font-bold text-secondary">{products.filter((product) => product.is_active).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                <Eye size={24} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted mb-1">Categories</p>
                <p className="text-2xl font-bold text-secondary">{new Set(products.map((product) => product.category)).size}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                <Search size={24} />
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_auto]">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary">Search Products</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by product name, tags, or description"
                  className="h-11 w-full rounded-sm border border-gray-300 bg-white pl-10 pr-3 text-sm text-secondary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary">Visibility</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="h-11 min-w-44 rounded-sm border border-gray-300 bg-white px-3 text-sm text-secondary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="all">All products</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><Skeleton className="h-10 w-48" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-16" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-24 ml-auto" /></td>
                    </tr>
                  ))
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                      No products found. Try adjusting the filters or add your first product.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 overflow-hidden rounded bg-gray-100">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                className="h-full w-full object-cover"
                                alt={product.name}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                                No image
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-secondary">{product.name}</p>
                            <p className="text-xs text-text-muted truncate max-w-[200px]">
                              {product.short_description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={product.category}>{product.category}</Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-secondary">
                        {product.formatted_price}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(product)}
                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            type="button"
                            onClick={() => void handleDelete(product.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {isFormOpen && (
        <ProductForm
          key={selectedProduct?.id ?? 'new'}
          product={selectedProduct}
          location={location}
          isSubmitting={isSubmitting}
          validationErrors={validationErrors}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedProduct(null);
            setValidationErrors({});
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
