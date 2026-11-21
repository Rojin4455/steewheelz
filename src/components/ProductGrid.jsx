import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import Reveal from './Reveal'
import { getCategories } from '../services/catalog'
import './ProductGrid.css'

export default function ProductGrid({ products, columns = 4 }) {
  const [names, setNames] = useState({})
  useEffect(() => {
    getCategories().then((cats) => setNames(Object.fromEntries(cats.map((c) => [c.slug, c.name]))))
  }, [])
  return (
    <div className={`pgrid pgrid--${columns}`}>
      {products.map((p, i) => (
        <Reveal key={p.id} delay={(i % columns) * 90}>
          <ProductCard product={p} categoryName={names[p.category]} />
        </Reveal>
      ))}
    </div>
  )
}

export function ProductGridSkeleton({ count = 8, columns = 4 }) {
  return (
    <div className={`pgrid pgrid--${columns}`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" style={{ aspectRatio: '4 / 6' }} />
      ))}
    </div>
  )
}
