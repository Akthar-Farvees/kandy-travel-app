import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  heroImage?: string;
  locationName?: string;
}

export function HeroSection({ heroImage, locationName = 'Kandy' }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const defaultHero = "https://images.unsplash.com/photo-1588614959060-4d144f28b207?q=80&w=2000&auto=format&fit=crop";

  return (
    <section className="relative h-screen w-full overflow-hidden bg-secondary">
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-bg z-10" />
        <img 
          src={heroImage || defaultHero} 
          alt="Kandy Landscape" 
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6 tracking-wide uppercase border border-white/30">
            Welcome to Sri Lanka
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 drop-shadow-lg"
        >
          Discover the Heart of {locationName}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl font-light drop-shadow-md"
        >
          Explore authentic local crafts, exquisite jewelry, and world-renowned Ceylon tea from the cultural capital of Sri Lanka.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button 
            size="lg" 
            className="rounded-full shadow-[0_0_20px_rgba(200,150,62,0.4)]"
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Browse Local Crafts
          </Button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce"
      >
        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
          <ChevronDown size={20} />
        </div>
      </motion.div>
    </section>
  );
}
