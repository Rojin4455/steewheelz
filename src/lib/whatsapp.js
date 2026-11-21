import { SITE } from '../config/site'
import { formatPrice } from './format'

const base = () => `https://wa.me/${SITE.whatsappNumber}`

/** Generic enquiry link (no product). */
export function whatsappLink(message = SITE.whatsappGreeting) {
  return `${base()}?text=${encodeURIComponent(message)}`
}

/** Pre-filled enquiry for a specific product. */
export function productWhatsappLink(product, { intent = 'buy', url } = {}) {
  const pageUrl = url ?? (typeof window !== 'undefined' ? window.location.href : '')
  const opener =
    intent === 'buy'
      ? `Hi ${SITE.name}! I'd like to buy this miniature:`
      : `Hi ${SITE.name}! I have a question about this miniature:`
  const lines = [
    opener,
    '',
    `*${product.name}*`,
    `Scale: ${product.specs?.Scale ?? '—'}`,
    `Price: ${formatPrice(product.price)}`,
    `Code: ${product.sku}`,
    pageUrl && `Link: ${pageUrl}`,
    '',
    intent === 'buy'
      ? 'Is it available? Please share delivery details.'
      : 'Could you share a few more details?',
  ].filter((l) => l !== false && l !== undefined)
  return whatsappLink(lines.join('\n'))
}
