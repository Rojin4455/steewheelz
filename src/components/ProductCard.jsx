import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Price from './Price'
import WhatsAppIcon from './WhatsAppIcon'
import { productWhatsappLink } from '../lib/whatsapp'
import './ProductCard.css'

export default function ProductCard({ product, categoryName }) {
  const { slug, name, price, compareAtPrice, badge, images, shortDescription, specs, availability } = product
  const url = `/product/${slug}`
  const hover = images[1] ?? images[0]
  const waHref = productWhatsappLink(product, {
    intent: 'buy',
    url: typeof window !== 'undefined' ? `${window.location.origin}${url}` : url,
  })

  return (
    <article className="pcard">
      <Link to={url} className="pcard__media" aria-label={name}>
        <img className="pcard__img pcard__img--main" src={images[0].src} alt={`${name} — ${images[0].alt}`} loading="lazy" />
        <img className="pcard__img pcard__img--alt" src={hover.src} alt="" aria-hidden="true" loading="lazy" />
        {badge && <span className={`pcard__badge pcard__badge--${badge.toLowerCase().replace(/\s+/g, '-')}`}>{badge}</span>}
        <span className="pcard__scale">{specs?.Scale}</span>
        <span className="pcard__view">
          View details <ArrowUpRight size={16} />
        </span>
      </Link>

      <div className="pcard__body">
        <div className="pcard__meta">
          <span>{categoryName}</span>
          <span className={`pcard__stock ${availability === 'In stock' ? 'is-in' : ''}`}>{availability}</span>
        </div>
        <h3 className="pcard__title">
          <Link to={url}>{name}</Link>
        </h3>
        <p className="pcard__desc">{shortDescription}</p>
        <div className="pcard__foot">
          <Price value={price} compareAt={compareAtPrice} />
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="pcard__wa"
            aria-label={`Enquire about ${name} on WhatsApp`}
            title="Enquire on WhatsApp"
          >
            <WhatsAppIcon size={18} />
          </a>
        </div>
      </div>
    </article>
  )
}
