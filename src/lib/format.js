import { SITE } from '../config/site'

const fmt = new Intl.NumberFormat(SITE.locale, {
  style: 'currency',
  currency: SITE.currency,
  maximumFractionDigits: 0,
})

export const formatPrice = (n) => fmt.format(n)
