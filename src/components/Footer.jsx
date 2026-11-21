import { FullLogo } from './Logo'
import { Link } from 'react-router-dom'
import { Mail, MapPin, ArrowUpRight } from 'lucide-react'
import { SITE } from '../config/site'
import { whatsappLink } from '../lib/whatsapp'
import { useAsync } from '../hooks/useAsync'
import { getCategories } from '../services/catalog'
import WhatsAppIcon from './WhatsAppIcon'
import './Footer.css'

const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const Youtube = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8ZM9.7 15.1V8.9l5.8 3.1-5.8 3.1Z" />
  </svg>
)

export default function Footer() {
  const { data: categories } = useAsync(getCategories, [])
  const year = new Date().getFullYear()
  return (
    <footer className="footer grain">
      <div className="container">
        <div className="footer__cta">
          <h2>
            Let’s build your <em>little world.</em>
          </h2>
          <a className="btn btn--sun btn--lg" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon /> <span>Start a conversation</span>
          </a>
        </div>

        <div className="footer__grid">
          <div className="footer__brand">
            <FullLogo width={150} className="footer__logo" loading="lazy" />
            <p>{SITE.description}</p>
            <div className="footer__social">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={18} />
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4>Collections</h4>
            {(categories ?? []).map((c) => (
              <Link key={c.slug} to={`/shop/${c.slug}`}>
                {c.name}
              </Link>
            ))}
          </div>

          <div className="footer__col">
            <h4>Explore</h4>
            <Link to="/shop">Shop all</Link>
            <Link to="/shop?filter=new">New arrivals</Link>
            <Link to="/custom">Custom builds</Link>
            <Link to="/about">Our story</Link>
          </div>

          <div className="footer__col">
            <h4>Get in touch</h4>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={15} /> WhatsApp us <ArrowUpRight size={14} />
            </a>
            <a href={`mailto:${SITE.email}`}>
              <Mail size={15} /> {SITE.email}
            </a>
            <span>
              <MapPin size={15} /> {SITE.location}
            </span>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} {SITE.name}. Handcrafted with tiny tools & big patience.</span>
          <span>All models are hand-built and may vary slightly from photos.</span>
        </div>
      </div>
      <div className="footer__wordmark" aria-hidden="true">
        Steewheelz
      </div>
    </footer>
  )
}
