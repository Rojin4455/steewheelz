import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { getCategories, getProducts } from '../services/catalog'
import ProductGrid, { ProductGridSkeleton } from '../components/ProductGrid'
import Breadcrumbs from '../components/Breadcrumbs'
import WhatsAppButton from '../components/WhatsAppButton'
import { Emblem } from '../components/Logo'
import './Shop.css'

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A–Z' },
]

export default function Shop() {
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const sort = params.get('sort') ?? 'featured'
  const filter = params.get('filter') ?? ''

  const { data: categories } = useAsync(getCategories, [])
  const { data: products, loading } = useAsync(() => getProducts({ category, search: q, sort, filter }), [category, q, sort, filter])

  const current = useMemo(() => categories?.find((c) => c.slug === category), [categories, category])

  const setParam = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v)
    else next.delete(k)
    setParams(next, { replace: true })
  }

  const title = current?.name ?? (filter === 'new' ? 'New arrivals' : 'The collection')
  const intro =
    current?.description ??
    (filter === 'new'
      ? 'Fresh off the workbench — our newest hand-built dioramas.'
      : 'Every Steewheelz diorama, hand-built at collector scale. Filter by collection or search for something specific.')

  const qs = params.toString() ? `?${params.toString()}` : ''

  return (
    <>
      <header className="shop-hero">
        {current && <img className="shop-hero__bg" src={current.cover} alt="" />}
        <div className="container shop-hero__inner">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, ...(current ? [{ label: current.name }] : [])]} />
          <h1>{title}</h1>
          <p>{intro}</p>
        </div>
      </header>

      <div className="shop-bar">
        <div className="container shop-bar__inner">
          <nav className="pills" aria-label="Collections">
            <Link to={`/shop${qs}`} className={`pill ${!category ? 'is-active' : ''}`}>
              All
            </Link>
            {(categories ?? []).map((c) => (
              <Link key={c.slug} to={`/shop/${c.slug}${qs}`} className={`pill ${category === c.slug ? 'is-active' : ''}`}>
                {c.name}
                <small>{c.count}</small>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <section className="container shop-body">
        <div className="toolbar">
          <label className="toolbar__search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search miniatures…"
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
              aria-label="Search miniatures"
            />
            {q && (
              <button onClick={() => setParam('q', '')} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </label>

          <div className="toolbar__right">
            <button className={`chip ${filter === 'new' ? 'is-active' : ''}`} onClick={() => setParam('filter', filter === 'new' ? '' : 'new')}>
              New only
            </button>
            <span className="toolbar__count">
              {products ? `${products.length} ${products.length === 1 ? 'piece' : 'pieces'}` : '…'}
            </span>
            <label className="toolbar__sort">
              <SlidersHorizontal size={16} />
              <select value={sort} onChange={(e) => setParam('sort', e.target.value)} aria-label="Sort by">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {loading && !products ? (
          <ProductGridSkeleton />
        ) : products?.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="empty">
            <Emblem size={140} loading="lazy" />
            <h2>Nothing on this shelf… yet.</h2>
            <p>We couldn’t find a miniature matching your search. But we build custom pieces all the time.</p>
            <div className="empty__ctas">
              <Link to="/shop" className="btn btn--ghost">
                Clear filters
              </Link>
              <WhatsAppButton message={`Hi Steewheelz! I'm looking for a miniature of: ${q}`}>Ask for a custom build</WhatsAppButton>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
