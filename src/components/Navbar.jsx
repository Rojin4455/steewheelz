import LogoLockup from './Logo'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, Search, X, ArrowRight } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { getCategories } from '../services/catalog'
import { whatsappLink } from '../lib/whatsapp'
import WhatsAppIcon from './WhatsAppIcon'
import SearchOverlay from './SearchOverlay'
import './Navbar.css'

export default function Navbar() {
  const { pathname } = useLocation()
  const { data: categories = [] } = useAsync(getCategories, [])
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const [search, setSearch] = useState(false)

  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMega(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <header className={`nav ${overHero ? 'nav--hero' : 'nav--solid'} ${open ? 'nav--open' : ''}`}>
        <div className="container nav__inner">
          <Link to="/" className="nav__logo" aria-label="Steewheelz home">
            <LogoLockup />
          </Link>

          <nav className="nav__links" aria-label="Primary">
            <NavLink to="/shop" end className="nav__link">
              Shop all
            </NavLink>
            <div className="nav__mega-wrap" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
              <button className="nav__link" aria-expanded={mega} onClick={() => setMega((m) => !m)}>
                Collections <ChevronDown size={15} className={mega ? 'rot' : ''} />
              </button>
              <div className={`mega ${mega ? 'is-open' : ''}`}>
                <div className="mega__grid">
                  {(categories ?? []).map((c) => (
                    <Link key={c.slug} to={`/shop/${c.slug}`} className="mega__item">
                      <span className="mega__thumb">
                        <img src={c.cover} alt="" />
                      </span>
                      <span>
                        <strong>{c.name}</strong>
                        <small>{c.tagline}</small>
                      </span>
                    </Link>
                  ))}
                  <Link to="/shop" className="mega__all">
                    <span>View the full collection</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
            <NavLink to="/shop?filter=new" className="nav__link">
              New arrivals
            </NavLink>
            <NavLink to="/custom" className="nav__link">
              Custom builds
            </NavLink>
            <NavLink to="/about" className="nav__link">
              Our story
            </NavLink>
          </nav>

          <div className="nav__actions">
            <button className="nav__icon" aria-label="Search" onClick={() => setSearch(true)}>
              <Search size={20} />
            </button>
            <a className="btn btn--sm btn--sun nav__cta" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon size={17} />
              <span>Chat with us</span>
            </a>
            <button className="nav__icon nav__burger" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((o) => !o)}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="drawer__nav">
          <Link to="/shop">Shop all</Link>
          <Link to="/shop?filter=new">New arrivals</Link>
          <Link to="/custom">Custom builds</Link>
          <Link to="/about">Our story</Link>
          <span className="drawer__label">Collections</span>
          {(categories ?? []).map((c) => (
            <Link key={c.slug} to={`/shop/${c.slug}`} className="drawer__sub">
              {c.name}
              <small>{c.count}</small>
            </Link>
          ))}
        </nav>
        <a className="btn btn--wa btn--block" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon /> <span>Chat on WhatsApp</span>
        </a>
      </div>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  )
}
