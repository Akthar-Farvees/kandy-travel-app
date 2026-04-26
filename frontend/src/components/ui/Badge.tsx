import { cn } from '../../lib/utils';
import type { HTMLAttributes } from 'react';
import type { ProductCategory } from '../../types';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | ProductCategory;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    tea: "bg-green-100 text-green-800",
    handicraft: "bg-amber-100 text-amber-800",
    jewelry: "bg-purple-100 text-purple-800",
    spice: "bg-orange-100 text-orange-800",
    textile: "bg-blue-100 text-blue-800",
    pottery: "bg-stone-200 text-stone-800",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
