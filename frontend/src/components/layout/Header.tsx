import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { MapPin, User, Menu, X } from 'lucide-react';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || !isHome ? 'glass py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center group-hover:bg-primary-dark transition-colors">
            <MapPin size={24} />
          </div>
          <span className={cn(
            "font-display text-2xl font-bold tracking-tight transition-colors",
            !isScrolled && isHome ? "text-white drop-shadow-md" : "text-secondary"
          )}>
            Kandy.
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              !isScrolled && isHome ? "text-white/90 hover:text-white drop-shadow-sm" : "text-text-muted"
            )}
          >
            Explore
          </Link>
          <a 
            href={isHome ? '#products' : '/#products'} 
            className={cn(
              "text-sm font-medium hover:text-primary transition-colors",
              !isScrolled && isHome ? "text-white/90 hover:text-white drop-shadow-sm" : "text-text-muted"
            )}
            onClick={(e) => {
              if (!isHome) return;
              e.preventDefault();
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Local Crafts
          </a>
          <Link 
            to="/admin" 
            className={cn(
              "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors",
              !isScrolled && isHome 
                ? "bg-white/20 text-white hover:bg-white/30 backdrop-blur-md" 
                : "bg-secondary/5 text-secondary hover:bg-secondary/10"
            )}
          >
            <User size={16} />
            Admin
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={!isScrolled && isHome ? "text-white" : "text-text"} />
          ) : (
            <Menu className={!isScrolled && isHome ? "text-white" : "text-text"} />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-4 md:hidden flex flex-col gap-4">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-secondary font-medium p-2 hover:bg-gray-50 rounded-md">Explore</Link>
          <a href={isHome ? '#products' : '/#products'} onClick={() => setIsMobileMenuOpen(false)} className="text-secondary font-medium p-2 hover:bg-gray-50 rounded-md">Local Crafts</a>
          <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-medium p-2 hover:bg-gray-50 rounded-md flex items-center gap-2">
            <User size={18} /> Admin Access
          </Link>
        </div>
      )}
    </header>
  );
}
