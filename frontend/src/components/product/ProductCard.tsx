import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div 
      className="group relative flex flex-col bg-surface rounded-md shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={() => onClick(product)}
      onKeyUp={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onClick(product);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button variant="primary" className="scale-95 group-hover:scale-100 transition-transform">
            View Details
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex justify-between items-start mb-2 gap-2">
          <Badge variant={product.category}>{product.category}</Badge>
          <span className="font-mono font-medium text-lg text-primary">{product.formatted_price}</span>
        </div>
        
        <h4 className="font-sans font-semibold text-text text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h4>
        
        <p className="text-text-muted text-sm line-clamp-2 mt-auto">
          {product.short_description}
        </p>
      </div>
    </div>
  );
}
