import { motion } from 'framer-motion';

interface KandyIntroProps {
  description?: string;
  productCount?: number;
}

export function KandyIntro({ description, productCount }: KandyIntroProps) {
  return (
    <section className="py-24 bg-bg relative overflow-hidden">
      {/* Decorative leaf motif (abstract) */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-3">The Cultural Capital</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6 leading-tight">
              A Legacy of Craftsmanship
            </h3>
            <p className="text-text-muted text-lg mb-6 leading-relaxed">
              {description ?? "Nestled amidst lush hills and built around a peaceful lake, Kandy is the guardian of Sri Lanka's cultural heritage. From the sacred Temple of the Tooth to the vibrant streets filled with artisans, every corner tells a story."}
            </p>
            <p className="text-text-muted text-lg leading-relaxed">
              {productCount
                ? `Our curated collection currently features ${productCount} active products sourced for the Kandy travel experience. Discover authentic batiks, masterfully carved woodwork, traditional pottery, and the world's finest tea directly from local creators.`
                : "Our curated collection brings you the finest local lifestyle products. Discover authentic batiks, masterfully carved woodwork, traditional pottery, and the world's finest tea, directly from local creators."}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4 relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80" 
              alt="Spices" 
              className="rounded-lg object-cover w-full h-64 shadow-lg transform translate-y-8"
            />
            <img 
              src="https://www.dhl.com/discover/adobe/dynamicmedia/deliver/dm-aid--c621fc34-5ef1-4915-b7ee-6dbb76825168/handicraft-item-bag-sri-lanka-991x558.jpg?preferwebp=true&quality=82" 
              alt="Handicraft" 
              className="rounded-lg object-cover w-full h-80 shadow-lg"
            />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center p-4">
              <div className="w-full h-full border border-primary rounded-full flex items-center justify-center text-primary font-display font-bold text-xl">
                Est.<br/>2024
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
