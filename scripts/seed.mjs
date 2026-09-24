// Run with: npm run seed
// Reads .env via Node's --env-file flag (Node 20.6+/22).
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.ADMIN_SEED_NAME || 'Store Admin';
const ADMIN_EMAIL = (process.env.ADMIN_SEED_EMAIL || 'admin@ogo.example').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || 'change-this-password';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Copy .env.example to .env and fill it in first.');
  process.exit(1);
}

const AdminSchema = new mongoose.Schema(
  { name: String, email: { type: String, unique: true, lowercase: true }, passwordHash: String, role: String },
  { timestamps: true }
);
const ProductSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Placeholder photos — swap these image URLs for your own product photography
// before launch. placehold.co generates simple colored placeholders.
function ph(bg, fg, label) {
  return `https://placehold.co/900x900/${bg}/${fg}?text=${encodeURIComponent(label)}`;
}

const PRODUCTS = [
  {
    name: 'Adaeze Pavé Diamond Ring',
    slug: 'adaeze-pave-ring',
    category: 'Rings',
    metal: '18k Gold',
    stone: 'Diamond',
    occasions: ['Wedding', 'Gift'],
    price: 385000,
    description: 'A luminous centre diamond framed by a hand-set pavé band. Made for engagements, anniversaries and the moments you want to remember.',
    details: ['18k hallmarked yellow gold', 'Centre diamond about 0.30 ct with pavé accents', 'Band width 2.4 mm', 'Certificate of authenticity and gift box included'],
    images: [ph('f4eee4', '775a19', 'Adaeze+Ring+1'), ph('e2d8c6', '775a19', 'Adaeze+Ring+2')],
    stock: 4,
    badge: 'Bestseller',
    featured: true,
    active: true,
    sizeOptionLabel: 'Ring size',
    sizeOptions: ['5', '6', '7', '8', '9', '10'],
    sizePriceAdjust: {},
    engraving: { enabled: false }
  },
  {
    name: 'Sovereign Cuban Link Chain',
    slug: 'sovereign-cuban-chain',
    category: 'Necklaces',
    metal: '18k Gold',
    stone: 'None',
    occasions: ['Everyday', 'Gift'],
    price: 420000,
    description: 'A weighty, polished cuban link that sits flat and catches the light. Priced for 20 inches; other lengths adjust the price.',
    details: ['18k hallmarked yellow gold', 'Solid cuban link, 4.5 mm wide', 'Secure lobster clasp', 'Certificate of authenticity included'],
    images: [ph('f4eee4', '775a19', 'Sovereign+Chain')],
    stock: 6,
    badge: 'New',
    featured: true,
    active: true,
    sizeOptionLabel: 'Chain length',
    sizeOptions: ['18"', '20"', '22"'],
    sizePriceAdjust: { '18"': -35000, '22"': 40000 },
    engraving: { enabled: false }
  },
  {
    name: 'Ògo Signet Ring',
    slug: 'ogo-signet-ring',
    category: 'Rings',
    metal: '18k Gold',
    stone: 'None',
    occasions: ['Everyday', 'Gift'],
    price: 265000,
    description: 'A bold oval signet with a mirror finish. Add up to three initials for a piece that is unmistakably yours.',
    details: ['18k hallmarked yellow gold', 'Oval face about 14 × 11 mm', 'Optional hand engraving (+₦15,000)', 'Gift box included'],
    images: [ph('ecd3bf', '5d4201', 'Ogo+Signet')],
    stock: 5,
    featured: false,
    active: true,
    sizeOptionLabel: 'Ring size',
    sizeOptions: ['5', '6', '7', '8', '9', '10'],
    sizePriceAdjust: {},
    engraving: { enabled: true, label: 'Initials to engrave (up to 3 letters)', maxLength: 3, extraPrice: 15000, required: false }
  },
  {
    name: 'Owambe Emerald Drop Earrings',
    slug: 'owambe-emerald-drops',
    category: 'Earrings',
    metal: '18k Gold',
    stone: 'Emerald',
    occasions: ['Owambe', 'Wedding', 'Gift'],
    price: 185000,
    description: 'Statement drops with teardrop emeralds in gold bezels. Light enough to wear all night, striking enough to be noticed across the room.',
    details: ['18k hallmarked yellow gold', 'Natural teardrop emeralds', 'Drop length about 3.5 cm', 'Secure push-back posts'],
    images: [ph('e0eae3', '2d6a4f', 'Owambe+Drops')],
    stock: 3,
    badge: 'Bestseller',
    featured: true,
    active: true,
    sizeOptions: [],
    sizePriceAdjust: {},
    engraving: { enabled: false }
  },
  {
    name: 'Custom Nameplate Pendant',
    slug: 'nameplate-pendant',
    category: 'Necklaces',
    metal: '18k Gold',
    stone: 'None',
    occasions: ['Gift', 'Everyday'],
    price: 210000,
    description: 'A nameplate made to order with the name of your choice. A gift that feels personal from the first look.',
    details: ['18k hallmarked yellow gold', 'Plate about 22 × 8 mm', 'Engraving included in the price', 'Made to order'],
    images: [ph('f4eee4', '775a19', 'Nameplate')],
    stock: 8,
    featured: true,
    active: true,
    sizeOptionLabel: 'Chain length',
    sizeOptions: ['16"', '18"', '20"'],
    sizePriceAdjust: {},
    engraving: { enabled: true, label: 'Name to engrave (up to 12 letters)', maxLength: 12, extraPrice: 0, required: true }
  },
  {
    name: 'Silver Twist Bracelet',
    slug: 'silver-twist-bracelet',
    category: 'Bracelets',
    metal: 'Sterling Silver',
    stone: 'None',
    occasions: ['Everyday', 'Gift'],
    price: 48000,
    description: 'A twisted band in 925 sterling silver with a bright polish. Light enough for every day, easy to stack.',
    details: ['925 sterling silver', 'Twist band about 5 mm wide', 'Secure box clasp', 'Polishing cloth included'],
    images: [ph('eae8e5', '4e4639', 'Silver+Twist')],
    stock: 10,
    featured: false,
    active: true,
    sizeOptionLabel: 'Bracelet size',
    sizeOptions: ['Small (6.5")', 'Medium (7")', 'Large (7.5")'],
    sizePriceAdjust: {},
    engraving: { enabled: false }
  },
  {
    name: 'Freshwater Pearl Studs',
    slug: 'pearl-stud-earrings',
    category: 'Earrings',
    metal: 'Gold-Plated',
    stone: 'Pearl',
    occasions: ['Everyday', 'Wedding', 'Gift'],
    price: 32000,
    description: 'Soft-glow freshwater pearls on gold-plated posts. A quiet pair that works with everything.',
    details: ['Gold-plated brass posts', 'Freshwater pearls, 8 mm', 'Push-back closure', 'Comes in a keepsake pouch'],
    images: [ph('f4eee4', '775a19', 'Pearl+Studs')],
    stock: 12,
    featured: false,
    active: true,
    sizeOptions: [],
    sizePriceAdjust: {},
    engraving: { enabled: false }
  },
  {
    name: 'Curb Link Steel Bracelet',
    slug: 'steel-curb-bracelet',
    category: 'Bracelets',
    metal: 'Stainless Steel',
    stone: 'None',
    occasions: ['Everyday', 'Gift'],
    price: 28000,
    description: 'A sturdy curb link that resists tarnish and daily knocks. Built for people who never take their jewelry off.',
    details: ['316L stainless steel', 'Curb link, 6 mm wide', 'Lobster clasp', 'Water and sweat resistant'],
    images: [ph('eae8e5', '4e4639', 'Steel+Curb')],
    stock: 9,
    featured: false,
    active: true,
    sizeOptionLabel: 'Bracelet size',
    sizeOptions: ['Small (6.5")', 'Medium (7")', 'Large (7.5")'],
    sizePriceAdjust: {},
    engraving: { enabled: false }
  }
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  const existingAdmin = await Admin.findOne({ email: ADMIN_EMAIL });
  if (existingAdmin) {
    console.log(`Admin ${ADMIN_EMAIL} already exists — skipping admin creation.`);
  } else {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, passwordHash, role: 'owner' });
    console.log(`Created admin ${ADMIN_EMAIL}. Log in at /ERP/login, then change the password.`);
  }

  let created = 0;
  for (const p of PRODUCTS) {
    const exists = await Product.findOne({ slug: p.slug });
    if (exists) continue;
    await Product.create(p);
    created++;
  }
  console.log(`Seeded ${created} sample product(s) (${PRODUCTS.length - created} already existed).`);

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
