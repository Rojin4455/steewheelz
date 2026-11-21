import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight } from 'lucide-react'
import { getProducts } from '../services/catalog'
import { formatPrice } from '../lib/format'
import './SearchOverlay.css'

export default function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const input = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 60)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    let alive = true
    getProducts({ search: q }).then((r) => alive && setResults(r.slice(0, 6)))
    return () => {
      alive = false
    }
  }, [q])

  const suggestions = useMemo(() => ['Fuel station', 'Garage', 'Drive-thru', 'Café', 'Fire station'], [])

  const submit = (e) => {
    e.preventDefault()
    onClose()
    navigate(`/shop?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className={`search ${open ? 'is-open' : ''}`} role="dialog" aria-modal="true" aria-label="Search" aria-hidden={!open}>
      <div className="search__backdrop" onClick={onClose} />
      <div className="search__panel">
        <form className="search__form" onSubmit={submit}>
          <Search size={22} />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search miniatures…" aria-label="Search miniatures" />
          <button type="button" className="search__close" onClick={onClose} aria-label="Close search">
            <X size={20} />
          </button>
        </form>
        {!q && (
          <div className="search__chips">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setQ(s.split(' ')[0])}>
                {s}
              </button>
            ))}
          </div>
        )}
        <ul className="search__results">
          {results.map((p) => (
            <li key={p.id}>
              <Link to={`/product/${p.slug}`} onClick={onClose}>
                <img src={p.cover} alt="" />
                <span>
                  <strong>{p.name}</strong>
                  <small>{p.specs?.Scale} · {formatPrice(p.price)}</small>
                </span>
                <ArrowRight size={18} />
              </Link>
            </li>
          ))}
          {q && results.length === 0 && <li className="search__empty">No miniatures match “{q}”. Try another word — or ask us for a custom build.</li>}
        </ul>
      </div>
    </div>
  )
}
