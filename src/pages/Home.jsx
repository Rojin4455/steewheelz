import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Hammer, PackageCheck, Truck, Gift, Sparkles, Ruler, Paintbrush, Lightbulb, Scissors, Gem } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { useReveal } from '../hooks/useReveal'
import { getCategories, getProducts } from '../services/catalog'
import { formatPrice } from '../lib/format'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid'
import ProductCard from '../components/ProductCard'
import CategoryCard from '../components/CategoryCard'
import WhatsAppButton from '../components/WhatsAppButton'
import CustomCommission from '../components/CustomCommission'
import { Emblem, FullLogo } from '../components/Logo'
import './Home.css'

export default function Home() {
  const { data: featured } = useAsync(() => getProducts({ filter: 'featured' }), [])
  const { data: fresh } = useAsync(() => getProducts({ filter: 'new' }), [])
  const { data: categories } = useAsync(getCategories, [])
  const { data: all } = useAsync(() => getProducts(), [])

  const catName = Object.fromEntries((categories ?? []).map((c) => [c.slug, c.name]))
  const spotlight = all?.find((p) => p.badge === 'Limited') ?? all?.[0]

  return (
    <>
      <Hero products={featured?.slice(0, 4) ?? []} />

      {/* Categories */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Shop by collection"
            title={
              <>
                Pick a street. <span className="display-italic">We’ll build the town.</span>
              </>
            }
            subtitle="Every collection is designed at collector scale, so each piece sits perfectly alongside the next."
            action={
              <Link to="/shop" className="link-underline">
                Browse everything <ArrowRight />
              </Link>
            }
          />
          <div className="bento">
            {(categories ?? []).map((c, i) => (
              <Reveal key={c.slug} delay={i * 80} className={i === 0 ? 'bento__lg' : ''}>
                <CategoryCard category={c} size={i === 0 ? 'lg' : 'md'} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section home-featured">
        <div className="container">
          <SectionHeading
            eyebrow="Collector favourites"
            title="The pieces everyone asks about"
            subtitle="Our most-requested builds — each one cut, assembled, painted and weathered by hand in our workshop."
            action={
              <Link to="/shop" className="link-underline">
                View all miniatures <ArrowRight />
              </Link>
            }
          />
          {featured ? <ProductGrid products={featured.slice(0, 8)} /> : <ProductGridSkeleton />}
        </div>
      </section>

      {/* Story */}
      <Story images={(all ?? []).slice(0, 12)} />

      {/* Spotlight */}
      {spotlight && <Spotlight product={spotlight} categoryName={catName[spotlight.category]} />}

      {/* New arrivals carousel */}
      <section className="section">
        <div className="container">
          <NewArrivals products={fresh ?? []} catName={catName} />
        </div>
      </section>

      <CustomCommission />

      <Promises />
    </>
  )
}

/* ------------------------------------------------------------------ */

function Hero({ products }) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (!products.length) return
    const t = setInterval(() => setActive((a) => (a + 1) % products.length), 5200)
    return () => clearInterval(t)
  }, [products.length])
  const current = products[active]

  return (
    <section className="hero grain">
      <div className="hero__glow" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__eyebrow">
            <Sparkles size={14} /> Handcrafted miniature dioramas
          </span>
          <h1 className="hero__title">
            Little worlds,
            <br />
            <em>built by hand.</em>
          </h1>
          <p className="hero__lead">
            Scale-model fuel stations, drive-thrus, garages and storefronts — designed, built and weathered piece by
            piece for collectors who notice the details.
          </p>
          <div className="hero__ctas">
            <Link to="/shop" className="btn btn--sun btn--lg">
              <span>Explore the collection</span>
              <ArrowRight className="arrow" />
            </Link>
            <WhatsAppButton variant="ghost-light" size="lg" message="Hi Steewheelz! I'd like to discuss a custom diorama.">
              Commission a build
            </WhatsAppButton>
          </div>
          <dl className="hero__stats">
            <div>
              <dt>1:64</dt>
              <dd>Collector scale</dd>
            </div>
            <div>
              <dt>100%</dt>
              <dd>Hand-built</dd>
            </div>
            <div>
              <dt>Pan-India</dt>
              <dd>Insured shipping</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual">
          <div className="hero__sun" />
          <div className="hero__orbit hero__orbit--1">
            <span />
          </div>
          <div className="hero__orbit hero__orbit--2">
            <span />
          </div>

          <div className="hero__frame">
            {products.map((p, i) => (
              <img
                key={p.id}
                src={p.images[3]?.src ?? p.cover}
                alt={p.name}
                className={i === active ? 'is-active' : ''}
              />
            ))}
          </div>

          {current && (
            <Link to={`/product/${current.slug}`} className="hero__card" key={current.id}>
              <span className="hero__card-thumb">
                <img src={current.cover} alt="" />
              </span>
              <span className="hero__card-text">
                <small>{current.badge ?? 'Featured'}</small>
                <strong>{current.name}</strong>
                <span>{formatPrice(current.price)}</span>
              </span>
              <span className="hero__card-go">
                <ArrowRight size={18} />
              </span>
            </Link>
          )}

          <div className="hero__seal">
            <FullLogo width={170} alt="Steewheelz" fetchpriority="high" />
          </div>

          <div className="hero__chip">
            <Hammer size={15} /> Made to be collected
          </div>

          <div className="hero__dots" role="tablist" aria-label="Featured models">
            {products.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === active}
                aria-label={p.name}
                className={i === active ? 'is-active' : ''}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
      <CraftRuler />
    </section>
  )
}

const CRAFT = [
  { icon: Scissors, title: 'Hand-cut', text: 'Foam board & styrene, cut piece by piece' },
  { icon: Paintbrush, title: 'Hand-painted', text: 'Signage, weathering & road markings' },
  { icon: Gem, title: 'Heirloom plinth', text: 'Walnut-stained base with brass plaque' },
  { icon: Lightbulb, title: 'LED-ready', text: 'Optional warm lighting, USB powered' },
]

const RULER_MARKS = [0, 6, 12, 18, 24, 30, 36]

function CraftRuler() {
  const [ref, visible] = useReveal({ threshold: 0.4 })
  return (
    <div ref={ref} className={`container craft ${visible ? 'is-visible' : ''}`}>
      <ul className="craft__items">
        {CRAFT.map((c, i) => (
          <li key={c.title} style={{ '--i': i }}>
            <span className="craft__icon">
              <c.icon size={18} strokeWidth={1.75} />
            </span>
            <div>
              <strong>{c.title}</strong>
              <small>{c.text}</small>
            </div>
          </li>
        ))}
      </ul>

      <div className="craft__ruler" aria-hidden="true">
        <div className="craft__ticks" />
        <div className="craft__labels">
          {RULER_MARKS.map((m) => (
            <span key={m} style={{ left: `${(m / 36) * 100}%` }}>
              {m}
              {m === 36 && <em> cm</em>}
            </span>
          ))}
        </div>
        <span className="craft__marker">
          <b>1 : 64</b>
        </span>
      </div>
    </div>
  )
}

function Story({ images }) {
  const steps = [
    { icon: Ruler, title: 'Designed to scale', text: 'Every façade is drawn up at true 1:64 so your diecast cars fit perfectly.' },
    { icon: Hammer, title: 'Built by hand', text: 'Cut from foam board and styrene, then assembled piece by tiny piece.' },
    { icon: Paintbrush, title: 'Painted & weathered', text: 'Hand-painted signage, oil stains, dusty kerbs — the details that make it real.' },
    { icon: Lightbulb, title: 'Lit & finished', text: 'Optional LED lighting, mounted on a walnut plinth with a brass name plaque.' },
  ]
  const a = images[3]
  const b = images[6]
  return (
    <section className="section story">
      <div className="container story__inner">
        <Reveal className="story__media">
          {a && <img className="story__img story__img--a" src={a.images[0].src} alt={a.name} loading="lazy" />}
          {b && <img className="story__img story__img--b" src={b.images[1].src} alt={b.name} loading="lazy" />}
          <div className="story__stamp">
            <Emblem size={96} loading="lazy" />
          </div>
        </Reveal>

        <div className="story__copy">
          <SectionHeading
            eyebrow="The Steewheelz workshop"
            title={
              <>
                Small scale. <span className="display-italic">Serious craft.</span>
              </>
            }
            subtitle="Steewheelz started with a shelf of diecast cars that deserved somewhere to park. Today every diorama still leaves our bench the same way — one at a time, made by hand."
          />
          <ol className="steps">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 90} className="steps__item">
                <span className="steps__icon">
                  <s.icon size={20} />
                </span>
                <div>
                  <h3>
                    <span>0{i + 1}</span> {s.title}
                  </h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Link to="/about" className="link-underline">
            Read our story <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Spotlight({ product, categoryName }) {
  const specs = Object.entries(product.specs).slice(0, 4)
  return (
    <section className="spotlight grain">
      <div className="container spotlight__inner">
        <Reveal className="spotlight__media">
          <img src={product.images[1].src} alt={`${product.name} at night`} loading="lazy" />
          <span className="spotlight__ribbon">{product.specs.Edition ?? 'Limited edition'}</span>
        </Reveal>
        <Reveal className="spotlight__copy" delay={120}>
          <span className="eyebrow">Spotlight · {categoryName}</span>
          <h2>{product.name}</h2>
          <p>{product.description[0]}</p>
          <dl className="spotlight__specs">
            {specs.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="spotlight__price">{formatPrice(product.price)}</div>
          <div className="spotlight__ctas">
            <WhatsAppButton product={product} size="lg">
              Reserve on WhatsApp
            </WhatsAppButton>
            <Link to={`/product/${product.slug}`} className="btn btn--ghost-light btn--lg">
              <span>View details</span>
              <ArrowRight className="arrow" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function NewArrivals({ products, catName }) {
  const track = useRef(null)
  const scroll = (d) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: d * (el.clientWidth * 0.8), behavior: 'smooth' })
  }
  return (
    <>
      <SectionHeading
        eyebrow="Fresh off the bench"
        title="New arrivals"
        subtitle="The latest additions to the Steewheelz collection."
        action={
          <div className="carousel-nav">
            <button onClick={() => scroll(-1)} aria-label="Scroll left">
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => scroll(1)} aria-label="Scroll right">
              <ArrowRight size={20} />
            </button>
          </div>
        }
      />
      <div className="carousel" ref={track}>
        {products.map((p) => (
          <div className="carousel__item" key={p.id}>
            <ProductCard product={p} categoryName={catName[p.category]} />
          </div>
        ))}
        <Link to="/shop?filter=new" className="carousel__more">
          <span>See all new arrivals</span>
          <ArrowRight size={22} />
        </Link>
      </div>
    </>
  )
}

function Promises() {
  const items = [
    { icon: Hammer, title: 'Hand-built', text: 'No mass production. Every model is assembled by hand.' },
    { icon: PackageCheck, title: 'Packed with care', text: 'Custom foam-lined boxes keep every tiny part safe.' },
    { icon: Truck, title: 'Ships India-wide', text: 'Tracked, insured delivery to your door.' },
    { icon: Gift, title: 'Gift-ready', text: 'Add a handwritten note — we’ll wrap it beautifully.' },
  ]
  return (
    <section className="promises">
      <div className="container promises__grid">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 80} className="promise">
            <span className="promise__icon">
              <it.icon size={22} />
            </span>
            <div>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
