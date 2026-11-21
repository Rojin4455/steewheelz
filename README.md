# Steewheelz — Miniature Diorama Storefront

React + Vite frontend for a handcrafted miniature diorama brand. No cart or checkout: every "Buy" button opens WhatsApp with the product's details already filled in.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Where to change things

| What | File |
| --- | --- |
| WhatsApp number, currency, brand info | `src/config/site.js` |
| Products | `src/data/products.js` |
| Categories | `src/data/categories.js` |
| WhatsApp message text | `src/lib/whatsapp.js` |
| Colours, fonts, spacing (design tokens) | `src/styles/global.css` |
| Logo | `public/brand/` + `src/config/brand.js` |

## Adding real product photos

Each product has an `images` array. While it is empty, the site draws placeholder diorama artwork from the product's `art` spec. To use real photos, put them in `public/products/` and list them. The first image is the cover:

```js
images: [
  { src: '/products/highway-fuel-stop/main.jpg', alt: 'Front view' },
  { src: '/products/highway-fuel-stop/night.jpg', alt: 'Night lighting' },
  { src: '/products/highway-fuel-stop/detail.jpg', alt: 'Pump close-up' },
],
```

Square images, 1600px or larger, look best. The gallery and lightbox zoom into them. A category can use a real image too: set its `cover` to an image URL.

## Structure

```
src/
  config/      site-wide settings
  data/        static catalogue (stand-in for a database)
  services/    data access layer (catalog.js); the only code that reads data
  hooks/       useAsync, useReveal
  lib/         whatsapp links, price formatting, placeholder art
  components/  Navbar, Footer, ProductCard, Gallery, Lightbox, ...
  pages/       Home, Shop, ProductDetail, Custom, About, NotFound
```

## Future Supabase integration

Pages and components get their data only through the async functions in `src/services/catalog.js`: `getProducts`, `getProductBySlug`, `getCategories`, and so on. To move to Supabase:

1. Run `npm i @supabase/supabase-js` and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`.
2. Enable the client in `src/services/supabaseClient.js`.
3. Replace the function bodies in `catalog.js` with Supabase queries. The comments in that file show examples. Keep the returned shape the same, and the UI needs no changes.

Suggested tables: `categories`, `products` (with `specs` and `highlights` as `jsonb`), and `product_images` (with `product_id`, `src`, `alt` and `position`), plus Supabase Storage for the photos.

## Deploying

This is a single-page app. Configure the host to send every route to `index.html`. On Netlify, add a `_redirects` file containing `/* /index.html 200`. Vercel handles this automatically for Vite projects.

## Brand assets

Three logo variations cut from the original mascot logo. All are in `public/brand/`.

| Variation | Hi-res master (transparent PNG) | Web version |
|---|---|---|
| Mascot emblem (no lettering) | `steewheelz-emblem.png` | `steewheelz-emblem-web.webp`, `-160.webp` |
| Wordmark only | `steewheelz-wordmark.png` | `steewheelz-wordmark-web.webp`, `-360.webp` |
| Full logo | `steewheelz-logo.png` | `steewheelz-logo-web.webp` |

- Paths live in `src/config/brand.js`. The components are in `src/components/Logo.jsx`: `LogoLockup` (nav), `Emblem`, `Wordmark` and `FullLogo`.
- Favicons: `public/favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png` and `icon-512.png`.
- Intro animation: `src/components/BrandIntro.jsx`. It plays once per browser session and is skipped entirely when the visitor has reduced motion turned on. To replay it, clear the `sw_intro_seen` key in sessionStorage.
