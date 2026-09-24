'use client';

import { motion } from 'framer-motion';
import { ProductDTO } from '@/lib/types';
import ProductCard from './ProductCard';

export default function ProductGrid({ products }: { products: ProductDTO[] }) {
  if (!products.length) return null;
  return (
    <motion.div
      className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {products.map((p, i) => (
        <motion.div
          key={p._id}
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductCard product={p} priority={i < 4} />
        </motion.div>
      ))}
    </motion.div>
  );
}
