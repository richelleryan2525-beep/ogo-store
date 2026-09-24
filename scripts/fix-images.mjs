// One-time fix for products seeded before the placeholder image URL bug was
// fixed. Run with: node --env-file=.env scripts/fix-images.mjs
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Make sure your .env file is filled in.');
  process.exit(1);
}

const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  const products = await Product.find({ images: { $regex: 'font=playfair-display' } });
  let fixed = 0;
  for (const p of products) {
    p.images = p.images.map((url) => url.replace(/&font=playfair-display/g, ''));
    await p.save();
    fixed++;
  }
  console.log(`Fixed image links on ${fixed} product(s).`);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error('Fix failed:', err);
  process.exit(1);
});
