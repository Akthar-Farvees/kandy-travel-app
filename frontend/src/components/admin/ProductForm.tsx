import { useState, type FormEvent, useRef } from 'react';
import { ImagePlus, MapPin, X, Upload, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PRODUCT_CATEGORIES, type Location, type Product, type ProductCategory, type ProductPayload } from '../../types';

interface ProductFormProps {
  product: Product | null;
  location: Location | null;
  isSubmitting: boolean;
  validationErrors: Record<string, string[]>;
  onClose: () => void;
  onSubmit: (payload: ProductPayload | FormData) => Promise<void>;
}

interface ProductFormState {
  name: string;
  short_description: string;
  category: ProductCategory;
  price: string;
  image_url: string;
  tags: string;
  is_active: boolean;
  image_file: File | null;
  upload_mode: 'url' | 'upload';
}

function createFormState(product: Product | null): ProductFormState {
  if (!product) {
    return {
      ...defaultFormState,
    };
  }

  return {
    name: product.name,
    short_description: product.short_description,
    category: product.category,
    price: product.price.toString(),
    image_url: product.image_url ?? '',
    tags: product.tags.join(', '),
    is_active: product.is_active,
    image_file: null,
    upload_mode: 'url',
  };
}

const defaultFormState: ProductFormState = {
  name: '',
  short_description: '',
  category: 'tea',
  price: '',
  image_url: '',
  tags: '',
  is_active: true,
  image_file: null,
  upload_mode: 'url',
};

export function ProductForm({
  product,
  location,
  isSubmitting,
  validationErrors,
  onClose,
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductFormState>(() => createFormState(product));
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image_url ?? null);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!location) {
    return null;
  }

  const getFieldError = (field: string) => validationErrors[field]?.[0];

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setClientError(null);

    if (!file) return;

    // Client-side validation for immediate feedback
    if (!ALLOWED_TYPES.includes(file.type)) {
      setClientError('Please select a valid image file (JPEG, PNG, GIF, or WebP).');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setClientError(`Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 5 MB.`);
      e.target.value = '';
      return;
    }

    setForm((prev) => ({ ...prev, image_file: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError(null);

    const tags = form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      // Use FormData when a file is selected for upload
      if (form.upload_mode === 'upload' && form.image_file) {
        const formData = new FormData();
        formData.append('location_id', location.id.toString());
        formData.append('name', form.name.trim());
        formData.append('short_description', form.short_description.trim());
        formData.append('category', form.category);
        formData.append('price', form.price);
        formData.append('image', form.image_file);
        formData.append('is_active', form.is_active ? '1' : '0');
        tags.forEach((tag, index) => {
          formData.append(`tags[${index}]`, tag);
        });
        
        await onSubmit(formData);
      } else {
        // URL mode or upload mode with no file selected — send as JSON
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
      }
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

            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-secondary">Product Image</label>
                <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, upload_mode: 'url' }))}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      form.upload_mode === 'url' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-secondary'
                    }`}
                  >
                    <LinkIcon size={12} /> URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, upload_mode: 'upload' }))}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      form.upload_mode === 'upload' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-secondary'
                    }`}
                  >
                    <Upload size={12} /> Upload
                  </button>
                </div>
              </div>

              {form.upload_mode === 'url' ? (
                <Input
                  type="url"
                  value={form.image_url}
                  onChange={(event) => {
                    const url = event.target.value;
                    setForm((prev) => ({ ...prev, image_url: url }));
                    setPreviewUrl(url);
                  }}
                  placeholder="https://images.unsplash.com/..."
                  icon={<ImagePlus size={18} />}
                  error={getFieldError('image_url')}
                />
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative group cursor-pointer border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                    clientError || getFieldError('image')
                      ? 'border-red-300 bg-red-50/50'
                      : form.image_file ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                  />
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    form.image_file ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400 group-hover:text-primary group-hover:bg-primary/10'
                  }`}>
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium text-secondary">
                    {form.image_file ? form.image_file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-text-muted mt-1">PNG, JPG or WebP (max 5MB)</p>
                  {clientError && <p className="text-sm text-red-500 mt-2">{clientError}</p>}
                  {getFieldError('image') && <p className="text-sm text-red-500 mt-2">{getFieldError('image')}</p>}
                </div>
              )}
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

          {previewUrl && (
            <div className="relative group overflow-hidden rounded-2xl border border-gray-100 bg-bg">
              <img
                src={previewUrl}
                alt="Product preview"
                className="aspect-[16/8] w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm font-medium">Image Preview</p>
              </div>
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
