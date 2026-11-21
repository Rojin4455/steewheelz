import { formatPrice } from '../lib/format'

export default function Price({ value, compareAt, className = '' }) {
  const off = compareAt && compareAt > value ? Math.round((1 - value / compareAt) * 100) : 0
  return (
    <span className={`price ${className}`}>
      <span className="price__now">{formatPrice(value)}</span>
      {off > 0 && (
        <>
          <s className="price__was">{formatPrice(compareAt)}</s>
          <span className="price__off">−{off}%</span>
        </>
      )}
    </span>
  )
}
