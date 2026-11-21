/**
 * Central site configuration.
 * Change the WhatsApp number, currency and brand details here — everything
 * else in the app reads from this file.
 */
export const SITE = {
  name: 'Steewheelz',
  tagline: 'Handcrafted miniature dioramas',
  description:
    'Scale-model fuel stations, drive-thrus, garages and storefronts — hand-built, hand-weathered and made to be collected.',

  // WhatsApp number in international format, digits only (no +, spaces or dashes).
  // Set VITE_WHATSAPP_NUMBER in .env (see .env.example).
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, ''),

  // Default opening line used for general (non-product) enquiries.
  whatsappGreeting: "Hi Steewheelz! I'd love to know more about your miniature dioramas.",

  currency: 'INR',
  locale: 'en-IN',

  email: import.meta.env.VITE_CONTACT_EMAIL || 'hello@steewheelz.com',
  location: 'Kochi, India',
  instagram: import.meta.env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/steewheelz/',
  youtube: import.meta.env.VITE_YOUTUBE_URL || 'https://youtube.com/',
}
