import { useState, type FormEvent } from 'react';
import { ImagePlus, MapPin, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PRODUCT_CATEGORIES, type Location, type Product, type ProductCategory, type ProductPayload } from '../../types';

interface ProductFormProps {
  product: Product | null;
  location: Location | null;
  isSubmitting: boolean;
  validationErrors: Record<string, string[]>;
  onClose: () => void;
  onSubmit: (payload: ProductPayload) => Promise<void>;
}

interface ProductFormState {
  name: string;
  short_description: string;
  category: ProductCategory;
  price: string;
  image_url: string;
  tags: string;
  is_active: boolean;
}

const defaultFormState: ProductFormState = {
  name: '',
  short_description: '',
  category: 'tea',
  price: '',
  image_url: '',
  tags: '',
  is_active: true,
};

function createFormState(product: Product | null): ProductFormState {
  if (!product) {
    return defaultFormState;
  }

  return {
    name: product.name,
    short_description: product.short_description,
    category: product.category,
    price: product.price.toString(),
    image_url: product.image_url ?? '',
    tags: product.tags.join(', '),
    is_active: product.is_active,
  };
}

export function ProductForm({
  product,
  location,
  isSubmitting,
  validationErrors,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormState>(() => createFormState(product));

  if (!location) {
    return null;
  }

  const getFieldError = (field: keyof ProductPayload | 'tags') => validationErrors[field]?.[0];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const tags = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      await onSubmit({
        location_id: location.id,
        name: form.name.trim(),
        short_description: form.short_description.trim(),
        category: form.category,
        price: Number.parseFloat(form.price),
        image_url: form.image_url.trim() || null,
        tags,
        is_active: form.is_active,
      });
    } catch {
      // Parent component owns the error state and feedback messaging.
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary transition-colors hover:bg-secondary/20"
          aria-label="Close product form"
        >
          <X size={18} />
        </button>

        <div className="border-b border-gray-100 px-6 py-6 md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            Admin Product Manager
          </p>
          <h2 className="mt-2 text-3xl font-display font-bold text-secondary">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-text-muted">
            <MapPin size={14} />
            Location: {location.name}, Sri Lanka
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-secondary">Product Name</label>
              <Input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Premium Ceylon Tea Gift Box"
                error={getFieldError('name')}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary">Category</label>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, category: event.target.value as ProductCategory }))
                }
                className="h-11 w-full rounded-sm border border-gray-300 bg-white px-3 text-sm text-secondary outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              {getFieldError('category') && <p className="text-sm text-red-500">{getFieldError('category')}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-secondary">Price</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                placeholder="24.99"
                error={getFieldError('price')}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-secondary">Short Description</label>
              <textarea
                value={form.short_description}
                onChange={(event) => setForm((prev) => ({ ...prev, short_description: event.target.value }))}
                placeholder="Describe the product in a concise, travel-friendly way."
                rows={4}
                className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm text-text outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                required
              />
              {getFieldError('short_description') && (
                <p className="text-sm text-red-500">{getFieldError('short_description')}</p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-secondary">Image URL</label>
              <Input
                type="url"
                value={form.image_url}
                onChange={(event) => setForm((prev) => ({ ...prev, image_url: event.target.value }))}
                placeholder="https://images.unsplash.com/..."
                icon={<ImagePlus size={18} />}
                error={getFieldError('image_url')}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-secondary">Tags</label>
              <Input
                value={form.tags}
                onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                placeholder="artisan, gift, tea estate"
                error={getFieldError('tags')}
              />
              <p className="text-xs text-text-muted">Separate tags with commas.</p>
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-bg px-4 py-3 md:col-span-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-secondary">Show this product on the public travel page</span>
            </label>
          </div>

          {form.image_url && (
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-bg">
              <img
                src={form.image_url}
                alt="Product preview"
                className="aspect-[16/8] w-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {product ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
