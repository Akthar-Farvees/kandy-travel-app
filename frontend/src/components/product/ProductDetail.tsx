import { useEffect } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../../types';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <div className="fixed inset-0 overflow-y-auto z-[101] pointer-events-none">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-surface w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row relative"
              >
                <button 
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 text-white rounded-full backdrop-blur-md transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-gray-100 relative">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/800x800?text=No+Image'} 
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={product.category} className="text-sm px-3 py-1">
                      {product.category}
                    </Badge>
                    <span className="flex items-center text-sm text-text-muted gap-1">
                      <MapPin size={14} /> {product.location?.name ?? 'Kandy'}, Sri Lanka
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary mb-4 leading-tight">
                    {product.name}
                  </h2>

                  <div className="text-3xl font-mono text-primary mb-6 font-medium">
                    {product.formatted_price}
                  </div>

                  <p className="mb-8 text-base leading-7 text-text-muted">{product.short_description}</p>

                  {product.tags && product.tags.length > 0 && (
                    <div className="mb-auto">
                      <h4 className="text-sm font-semibold text-text mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map(tag => (
                          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-10 pt-6 border-t border-gray-100 flex gap-4">
                    <Button size="lg" className="flex-1">
                      Enquire Now
                    </Button>
                    <Button variant="secondary" size="lg" className="px-6" onClick={onClose}>
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
