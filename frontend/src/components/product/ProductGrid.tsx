import { ProductCard } from './ProductCard';
import { Skeleton } from '../ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';
import type { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, isLoading, onProductClick }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="w-full aspect-[4/3] rounded-md" />
            <Skeleton className="h-6 w-24 rounded-sm" />
            <Skeleton className="h-6 w-full rounded-sm" />
            <Skeleton className="h-4 w-3/4 rounded-sm" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
      >
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
          <SearchX size={32} />
        </div>
        <h3 className="text-2xl font-display font-semibold text-secondary mb-2">No products found</h3>
        <p className="text-text-muted max-w-md">
          We couldn't find any products matching your filters. Try adjusting your search or clearing the filters to see more results.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <ProductCard product={product} onClick={onProductClick} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
