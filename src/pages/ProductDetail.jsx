import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Copy, Hammer, ShieldCheck, Truck, MessageCircleQuestion, ArrowRight } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { getCategoryBySlug, getProductBySlug, getRelatedProducts } from '../services/catalog'
import Gallery from '../components/Gallery'
import Breadcrumbs from '../components/Breadcrumbs'
import Price from '../components/Price'
import WhatsAppButton from '../components/WhatsAppButton'
import ProductGrid from '../components/ProductGrid'
import SectionHeading from '../components/SectionHeading'
import NotFound from './NotFound'
import { SITE } from '../config/site'
import './ProductDetail.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const { data: product, loading } = useAsync(() => getProductBySlug(slug), [slug])
  const { data: category } = useAsync(async () => (product ? getCategoryBySlug(product.category) : null), [product])
  const { data: related } = useAsync(async () => (product ? getRelatedProducts(product) : []), [product])
  const [tab, setTab] = useState('details')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (product) document.title = `${product.name} — ${SITE.name}`
    return () => {
      document.title = `${SITE.name} — Handcrafted Miniature Dioramas`
    }
  }, [product])

  if (loading && !product) return <div className="container pdp-loading skeleton" />
  if (!product) return <NotFound />

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }

  const inStock = product.availability === 'In stock'

  return (
    <>
      <section className="container pdp">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: 'Shop', to: '/shop' },
            ...(category ? [{ label: category.name, to: `/shop/${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="pdp__grid">
          <div className="pdp__gallery">
            <Gallery images={product.images} name={product.name} badge={product.badge} />
          </div>

          <div className="pdp__info">
            <div className="pdp__sticky">
              <div className="pdp__top">
                {category && (
                  <Link to={`/shop/${category.slug}`} className="pdp__cat">
                    {category.name}
                  </Link>
                )}
                <span className="pdp__sku">{product.sku}</span>
              </div>

              <h1 className="pdp__title">{product.name}</h1>
              <p className="pdp__short">{product.shortDescription}</p>

              <div className="pdp__price-row">
                <Price value={product.price} compareAt={product.compareAtPrice} className="pdp__price" />
                <span className={`pdp__stock ${inStock ? 'is-in' : ''}`}>
                  {product.availability}
                  {!inStock && product.specs['Build time'] && <small> · ships in {product.specs['Build time']}</small>}
                </span>
              </div>

              <ul className="pdp__highlights">
                {product.highlights.map((h) => (
                  <li key={h}>
                    <Check size={16} /> {h}
                  </li>
                ))}
              </ul>

              <div className="pdp__quick">
                <div>
                  <span>Scale</span>
                  <strong>{product.specs.Scale}</strong>
                </div>
                <div>
                  <span>Size</span>
                  <strong>{product.specs.Dimensions}</strong>
                </div>
                <div>
                  <span>Lighting</span>
                  <strong>{product.specs.Lighting?.split(' ')[0]}</strong>
                </div>
              </div>

              <div className="pdp__ctas">
                <WhatsAppButton product={product} intent="buy" size="lg" className="btn--block">
                  Buy now on WhatsApp
                </WhatsAppButton>
                <div className="pdp__ctas-row">
                  <WhatsAppButton product={product} intent="ask" variant="ghost" className="pdp__ask">
                    Ask a question
                  </WhatsAppButton>
                  <button className="btn btn--ghost pdp__copy" onClick={copyLink} aria-live="polite">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    <span>{copied ? 'Link copied' : 'Copy link'}</span>
                  </button>
                </div>
                <p className="pdp__note">
                  <MessageCircleQuestion size={16} /> Tapping “Buy now” opens WhatsApp with this model’s details
                  pre-filled — we’ll confirm availability, delivery and payment there.
                </p>
              </div>

              <ul className="pdp__trust">
                <li>
                  <Hammer size={18} />
                  <span>
                    <strong>Hand-built</strong> in our workshop
                  </span>
                </li>
                <li>
                  <ShieldCheck size={18} />
                  <span>
                    <strong>Foam-lined</strong> protective packing
                  </span>
                </li>
                <li>
                  <Truck size={18} />
                  <span>
                    <strong>Insured</strong> pan-India delivery
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="container pdp-tabs">
        <div className="tabs" role="tablist">
          {[
            ['details', 'The story'],
            ['specs', 'Specifications'],
            ['care', 'Shipping & care'],
          ].map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-active' : ''} onClick={() => setTab(k)}>
              {label}
            </button>
          ))}
        </div>

        <div className="tabs__panel" key={tab}>
          {tab === 'details' && (
            <div className="pdp-story">
              <div>
                {product.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <img src={product.images[2]?.src ?? product.cover} alt={`${product.name} close-up`} loading="lazy" />
            </div>
          )}
          {tab === 'specs' && (
            <dl className="specs">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div>
                <dt>Product code</dt>
                <dd>{product.sku}</dd>
              </div>
            </dl>
          )}
          {tab === 'care' && (
            <div className="care">
              <div>
                <h3>Shipping</h3>
                <p>
                  Every diorama is packed in a custom foam-lined box and shipped with tracking and insurance across India.
                  In-stock pieces dispatch within 2–3 working days; made-to-order pieces ship once complete.
                </p>
              </div>
              <div>
                <h3>Care</h3>
                <p>
                  Display away from direct sunlight and moisture. Dust gently with a soft make-up brush or a can of
                  compressed air. Handle by the plinth, never the building.
                </p>
              </div>
              <div>
                <h3>Payment</h3>
                <p>
                  No checkout, no sign-up. Orders are confirmed personally over WhatsApp, where we’ll share payment
                  options and an exact delivery date.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {related?.length > 0 && (
        <section className="section--tight pdp-related">
          <div className="container">
            <SectionHeading
              eyebrow="Complete the street"
              title="You might also like"
              action={
                <Link to="/shop" className="link-underline">
                  Shop all <ArrowRight />
                </Link>
              }
            />
            <ProductGrid products={related} />
          </div>
        </section>
      )}

      <div className="pdp-mobilebar">
        <div>
          <small>{product.name}</small>
          <Price value={product.price} />
        </div>
        <WhatsAppButton product={product} size="sm">
          Buy on WhatsApp
        </WhatsAppButton>
      </div>
    </>
  )
}
