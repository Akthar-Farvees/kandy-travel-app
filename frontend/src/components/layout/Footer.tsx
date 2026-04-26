import { MapPin, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-white/80 py-12 mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Kandy.
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs text-white/60">
              Discover the cultural heart of Sri Lanka. Authentic crafts, premium tea, and traditional heritage.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">Temple of the Tooth</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kandy Lake</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Peradeniya Gardens</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Local Markets</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>hello@kandy-travel.lk</li>
              <li>+94 81 123 4567</li>
              <li>Dalada Veediya, Kandy</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-white/40">
          <p>© {new Date().getFullYear()} Kandy Travel App. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Built with <Heart size={12} className="text-accent" /> for Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
