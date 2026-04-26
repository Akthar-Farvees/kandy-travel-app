import { useEffect, useState } from 'react';
import { HeroSection } from '../components/hero/HeroSection';
import { KandyIntro } from '../components/hero/KandyIntro';
import { FilterBar } from '../components/filter/FilterBar';
import { ProductGrid } from '../components/product/ProductGrid';
import { ProductDetail } from '../components/product/ProductDetail';
import { useProducts } from '../hooks/useProducts';
import { productsApi } from '../lib/api/products';
import { locationApi } from '../lib/api/location';
import { getApiErrorMessage } from '../lib/utils';
import type { Location, Product } from '../types';

export function HomePage() {
  const [location, setLocation] = useState<Location | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const {
    products,
    total,
    filters,
    setFilters,
    isLoading,
    error,
  } = useProducts();

  useEffect(() => {
    let isCancelled = false;

    const loadPageData = async () => {
      try {
        const [locationData, categoryData] = await Promise.all([
          locationApi.getLocation(),
          productsApi.getCategories(),
        ]);

        if (isCancelled) {
          return;
        }

        setLocation(locationData);
        setCategories(categoryData);
      } catch (loadError) {
        if (!isCancelled) {
          setPageError(getApiErrorMessage(loadError, 'We could not load the Kandy travel data.'));
        }
      }
    };

    void loadPageData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  return (
    <main>
      <HeroSection
        heroImage={location?.hero_image || undefined}
        locationName={location?.name ?? 'Kandy'}
      />
      
      <KandyIntro
        description={location?.description}
        productCount={location?.products_count}
      />
      
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">Authentic Selection</h2>
            <h3 className="text-4xl font-display font-bold text-secondary">
              Explore Our Collection
            </h3>
          </div>

          {pageError && (
            <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {pageError}
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              {error}
            </div>
          )}

          <FilterBar 
            filters={filters} 
            setFilters={setFilters} 
            categories={categories}
            totalResults={total}
          />

          <ProductGrid 
            products={products} 
            isLoading={isLoading} 
            onProductClick={handleProductClick}
          />
        </div>
      </section>

      <ProductDetail 
        product={selectedProduct} 
        isOpen={isDetailOpen} 
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedProduct(null);
        }} 
      />
    </main>
  );
}
