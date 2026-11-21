import WhatsAppIcon from './WhatsAppIcon'
import { productWhatsappLink, whatsappLink } from '../lib/whatsapp'

/**
 * Opens WhatsApp with a pre-filled message.
 * Pass `product` for a product enquiry, or `message` for a custom one.
 */
export default function WhatsAppButton({
  product,
  intent = 'buy',
  message,
  children = 'Enquire on WhatsApp',
  className = '',
  size,
  variant = 'wa',
  ...rest
}) {
  const href = product ? productWhatsappLink(product, { intent }) : whatsappLink(message)
  const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, className].filter(Boolean).join(' ')
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
      <WhatsAppIcon />
      <span>{children}</span>
    </a>
  )
}
