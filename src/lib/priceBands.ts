// Price bands used by both the (server) shop page and the (client) toolbar.
// This must live outside any 'use client' file: a Server Component cannot
// read a property off a value that is exported from a client module (only
// components can be passed through that boundary), so this constant needs
// its own plain, server-safe module.
export const PRICE_BANDS: Record<string, [string, number, number]> = {
  any: ['Any price', 0, Infinity],
  u50: ['Under ₦50,000', 0, 49999],
  m200: ['₦50,000 – ₦200,000', 50000, 200000],
  m400: ['₦200,000 – ₦400,000', 200001, 400000],
  o400: ['Over ₦400,000', 400001, Infinity]
};
