# ÒGO — Full-Stack Jewelry Store (Next.js)

A real e-commerce storefront for a Nigerian jewelry brand, built with Next.js 14 (App Router),
MongoDB Atlas and a built-in admin ERP at `/ERP`. Orders are placed and tracked directly on the
site — no WhatsApp dependency for checkout (WhatsApp is kept only as an optional support button).

## What's included

- **Storefront**: home, shop with filters/search, product pages, cart, real checkout, order
  tracking by link (`/track/[token]`) or by order number + phone (`/orders`), wishlist, policy pages.
- **Backend**: Next.js API routes backed by MongoDB (Mongoose). Orders re-price and re-check stock
  server-side, reserve inventory atomically, and generate a unique tracking link per order.
- **Admin ERP** at `/ERP`: dashboard, full CRUD on products, order review/status/payment/waybill
  management, and a customer directory — all cookie-session protected.
- **SEO**: per-page metadata, Open Graph tags, JSON-LD (JewelryStore/Product schema), a dynamic
  `sitemap.xml` that includes every active product, and `robots.txt`.
- **Animations**: Framer Motion throughout (hero, product grids, drawers, filters, status timeline).

## 1. Prerequisites

- Node.js 20.6+ (for `--env-file`) — Node 22 recommended.
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

## 2. Install

```bash
npm install
```

## 3. Set up MongoDB Atlas

1. Create a free cluster at mongodb.com/cloud/atlas.
2. **Database Access** → add a database user with a username/password.
3. **Network Access** → add your IP (or `0.0.0.0/0` while testing; restrict this before going live).
4. **Connect → Drivers** → copy the connection string. It looks like:
   `mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority`
5. Add a database name to the path, e.g. `.../ogo?retryWrites=true...`.

## 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

- `MONGODB_URI` — your Atlas connection string from step 3.
- `ADMIN_JWT_SECRET` — a long random string. Generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  ```
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — credentials for your first ERP login (change the
  password after logging in once — this build doesn't yet have a "change password" screen, so for
  now update it by re-running the seed script with a new password after deleting the Admin document,
  or extend the ERP with a password-change form).
- `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` for local dev; your real domain in production
  (used for tracking links, canonical URLs and the sitemap).
- `NEXT_PUBLIC_STORE_WHATSAPP` — your WhatsApp number, digits only, country code first (e.g.
  `2348012345678`), used only for the support button.

## 5. Seed your database

Creates your first admin account and 8 sample products (with placeholder photos):

```bash
npm run seed
```

Replace the placeholder image URLs in the ERP (Products → edit → Image URLs) with real product
photography before launch — host them anywhere (Cloudinary, S3, Atlas-adjacent storage, etc.) and
paste the URLs in, one per line.

## 6. Run it

```bash
npm run dev
```

- Storefront: http://localhost:3000
- Admin ERP: http://localhost:3000/ERP/login

## How orders work

1. A customer checks out on `/checkout`. The server re-prices every item from the database (client
   prices are never trusted), checks stock, and atomically decrements inventory.
2. An `Order` document is created with a unique `orderNumber` (e.g. `OGO-260214-8K2M`) and a random
   `trackingToken`.
3. The customer is redirected to `/track/[token]` — their permanent tracking link — and the same
   order is saved to the `Customer` collection (creating or updating that customer's record).
4. You review the order in `/ERP/orders`, confirm payment (bank transfer, handled off-platform),
   and move it through **Pending → Confirmed → Processing → Shipped → Delivered**. Each change is
   timestamped in the order's status history and instantly visible on the customer's tracking page.
5. If you cancel a pending order, its stock is automatically returned to inventory.

Customers who lose their tracking link can recover it at `/orders` using their order number + the
phone number they checked out with.

## The ERP (`/ERP`)

- **Dashboard** — revenue (paid orders), order counts by status, low-stock alert, recent orders.
- **Products** — create, edit, delete; manage stock, pricing, size options with per-size price
  adjustments, optional engraving, and featured/active flags.
- **Orders** — search/filter by status, view full order detail, update status/payment/carrier/
  waybill, see the full status history and the customer's tracking link.
- **Customers** — search, view order history per customer, edit contact info, delete.

Every `/ERP/*` page and `/api/erp/*` route is protected by an edge middleware that checks a signed,
httpOnly session cookie (7-day expiry). There's currently one role tier; extend `Admin.role` if you
need staff vs. owner permission splits.

## SEO notes

- `src/app/sitemap.ts` generates `/sitemap.xml` dynamically from your live product catalog.
- `src/app/robots.ts` disallows `/ERP`, `/api`, `/checkout` and `/track` from indexing.
- Every product and shop page sets a canonical URL, Open Graph tags, and `Product`/`JewelryStore`
  JSON-LD. Fill in real product descriptions and photos — thin/duplicate content still hurts
  rankings regardless of the schema markup.
- Set `NEXT_PUBLIC_SITE_URL` to your real domain before deploying, or canonical URLs and the
  sitemap will point at `localhost`.

## Deploying

This is a standard Next.js app — it deploys as-is to Vercel, Netlify, Railway, Render, or any Node
host. Steps for Vercel:

1. Push this project to a Git repository.
2. Import it in Vercel.
3. Add the same environment variables from `.env` in the Vercel project settings.
4. Deploy. Run `npm run seed` once locally (pointed at the same `MONGODB_URI`) to create your admin
   account and sample products before going live, then replace the sample products with real ones.

## Known limitations / next steps

- **Payment** is manual bank transfer, confirmed by you in the ERP — there's no payment gateway
  integration (Paystack/Flutterwave) yet. That's the natural next addition if you want automatic
  payment confirmation instead of manually marking orders "Paid".
- **Admin password changes** aren't exposed in the UI yet — see the note in step 4 above.
- **Single WhatsApp number** for support is hardcoded via env var; there's no live chat/inbox.
- **Image hosting** isn't built in — image URLs are pasted into the product form, so you'll want a
  place to upload photos (Cloudinary, S3, etc.) and grab their URLs.
- **Roles**: the `Admin` model has a `role` field (`owner`/`staff`) but all authenticated admins
  currently have equal access — add permission checks in the API routes if you need to restrict staff.

## Project structure

```
src/
  app/
    (store)/        storefront pages (home, shop, product, checkout, track, orders, wishlist, policies)
    ERP/             admin: login (public) + (admin) route group (dashboard, products, orders, customers)
    api/
      orders/        public order creation, tracking, lookup
      products/      public product listing (for the wishlist page)
      erp/           admin-only CRUD APIs, protected by middleware
    sitemap.ts, robots.ts
  components/        shared storefront UI (Header, CartDrawer, ProductCard, etc.)
  components/erp/    admin-only UI (AdminShell, ProductForm, StatusBadge, StatCard)
  context/           CartContext, WishlistContext (localStorage-backed)
  lib/
    models/          Mongoose schemas: Product, Order, Customer, Admin
    db.ts            cached MongoDB connection
    auth.ts           edge-compatible admin JWT (jose)
    storeData.ts      server-side product queries for storefront pages
    utils.ts, types.ts, policyContent.ts
  middleware.ts       protects /ERP and /api/erp
scripts/seed.mjs      creates first admin + sample products
```
