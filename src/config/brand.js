/**
 * Steewheelz brand assets — single source of truth.
 *
 * Three variations cut from the original mascot logo:
 *   emblem   – mascot + yellow badge, no lettering
 *   wordmark – original "Steewheelz" script lettering only
 *   full     – complete original composition
 *
 * Hi-res transparent PNG masters live in /public/brand/*.png (for print,
 * social, packaging). The site serves lighter WebP renditions.
 */
export const BRAND = {
  name: 'Steewheelz',

  emblem: '/brand/steewheelz-emblem-web.webp', // 420px
  emblemSm: '/brand/steewheelz-emblem-160.webp', // nav / small UI
  wordmark: '/brand/steewheelz-wordmark-web.webp', // 640px
  wordmarkSm: '/brand/steewheelz-wordmark-360.webp', // nav
  full: '/brand/steewheelz-logo-web.webp', // 560px

  masters: {
    emblem: '/brand/steewheelz-emblem.png',
    wordmark: '/brand/steewheelz-wordmark.png',
    full: '/brand/steewheelz-logo.png',
  },

  // intrinsic aspect ratios (w / h) of the masters
  ratio: {
    emblem: 823 / 837,
    wordmark: 1109 / 264,
    full: 1109 / 1028,
  },
}
