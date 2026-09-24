import { DELIVERY_ZONES, FREE_LAGOS_OVER, STORE_NAME, fmtNaira } from './utils';

export interface PolicyPage {
  slug: string;
  title: string;
  html: string;
}

// Template copy — have a Nigerian legal professional review before launch,
// and confirm every operational claim (resizing, insurance, etc.) is true
// for your business before publishing.
export const POLICY_PAGES: PolicyPage[] = [
  {
    slug: 'shipping',
    title: 'Shipping and delivery',
    html: `
      <p>We deliver across Nigeria using GIG Logistics, DHL or a dispatch rider in Lagos. Every parcel is insured and you'll receive a tracking link.</p>
      <table><thead><tr><th>Where</th><th>Fee</th><th>Estimate</th></tr></thead><tbody>
        <tr><td>Lagos</td><td>${fmtNaira(DELIVERY_ZONES.Lagos.fee)}</td><td>${DELIVERY_ZONES.Lagos.eta}</td></tr>
        <tr><td>Abuja (FCT)</td><td>${fmtNaira(DELIVERY_ZONES.Abuja.fee)}</td><td>${DELIVERY_ZONES.Abuja.eta}</td></tr>
        <tr><td>Other states</td><td>${fmtNaira(DELIVERY_ZONES.Other.fee)}</td><td>${DELIVERY_ZONES.Other.eta}</td></tr>
      </tbody></table>
      <p>Delivery within Lagos is free on orders over ${fmtNaira(FREE_LAGOS_OVER)}.</p>
      <h2>When we dispatch</h2>
      <p>We prepare your order once payment is confirmed. Engraved pieces add 3–5 business days. Estimates start from dispatch, not from the day you order.</p>
      <h2>Please note</h2>
      <p>Provide a phone number that will be answered on delivery day. A valid ID may be requested for high-value parcels.</p>
    `
  },
  {
    slug: 'returns',
    title: 'Returns and resizing',
    html: `
      <h2>Returns</h2>
      <p>You can return unworn pieces in their original packaging within 7 days of delivery. Contact us first so we can arrange the return.</p>
      <p>Earrings, engraved pieces and made-to-order items are final sale unless they arrive faulty.</p>
      <h2>Damaged or wrong item</h2>
      <p>Message us within 48 hours of delivery with clear photos or an unboxing video and we'll make it right.</p>
      <h2>Resizing</h2>
      <p>Your first ring or bracelet resize is free within 30 days. Some designs can't be resized — we'll tell you before you buy.</p>
      <h2>Refunds</h2>
      <p>Approved refunds are paid by bank transfer within 5 business days of us receiving and inspecting the piece.</p>
    `
  },
  {
    slug: 'terms',
    title: 'Terms of sale',
    html: `
      <h2>Ordering</h2>
      <p>Placing an order on this site reserves your items and creates a pending order. An order is confirmed once we receive payment.</p>
      <h2>Prices and payment</h2>
      <p>All prices are in Nigerian Naira (₦). Payment is by bank transfer to the account we confirm with you. We never ask you to pay to a personal account under a different name.</p>
      <h2>Availability</h2>
      <p>Stock is reserved for your order the moment you check out. If we've made a pricing error we'll contact you before dispatch.</p>
      <h2>Delivery and risk</h2>
      <p>Ownership passes to you on delivery. See our Shipping and Returns pages.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>
    `
  },
  {
    slug: 'privacy',
    title: 'Privacy policy',
    html: `
      <p>We respect your privacy and handle personal data in line with the Nigeria Data Protection Act (NDPA).</p>
      <h2>What we collect</h2>
      <p>Name, phone number, delivery address, optional email and the items you order.</p>
      <h2>Why we use it</h2>
      <p>To process and deliver your order, confirm payment, provide support and, where you consent, measure how the site is used.</p>
      <h2>Who sees it</h2>
      <p>We share delivery details with couriers only to deliver your order. We do not sell your data.</p>
      <h2>Your rights</h2>
      <p>You can ask to access, correct or delete your data, or object to its use, by contacting us.</p>
    `
  },
  {
    slug: 'care',
    title: 'Jewelry care',
    html: `
      <h2>Gold</h2><p>Wipe gently with a soft cloth after wear. Clean with warm water and a drop of mild soap, then dry well.</p>
      <h2>Silver</h2><p>Silver darkens with air and skin oils. Polish with a soft cloth and store in an airtight pouch.</p>
      <h2>Gold-plated</h2><p>Gold plating wears faster with friction and moisture, so keep it dry and avoid rubbing.</p>
      <h2>Stainless steel</h2><p>Rinse with clean water and dry. Steel resists tarnish but still benefits from a wipe after wear.</p>
      <p>Put jewelry on after perfume and lotion, and take it off before swimming, bathing or exercise.</p>
    `
  },
  {
    slug: 'about',
    title: `About ${STORE_NAME}`,
    html: `
      <p>${STORE_NAME} is a Lagos jewelry house making hallmarked gold, diamond and silver pieces for weddings, milestones and everyday wear.</p>
      <p>Every 18k piece is hallmarked and comes with a certificate. Every order gets a real tracking link, from confirmation to delivery.</p>
    `
  },
  {
    slug: 'contact',
    title: 'Contact us',
    html: `<p>Reach us on WhatsApp using the chat button, or use the order tracking page for questions about an existing order.</p>`
  }
];

export function getPolicyPage(slug: string) {
  return POLICY_PAGES.find((p) => p.slug === slug) || null;
}
