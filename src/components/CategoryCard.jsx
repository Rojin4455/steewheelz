import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import './CategoryCard.css'

export default function CategoryCard({ category, size = 'md' }) {
  return (
    <Link to={`/shop/${category.slug}`} className={`ccard ccard--${size}`}>
      <img src={category.cover} alt="" loading="lazy" className="ccard__img" />
      <div className="ccard__shade" />
      <div className="ccard__body">
        <span className="ccard__count">{String(category.count).padStart(2, '0')} pieces</span>
        <h3 className="ccard__title">{category.name}</h3>
        <p className="ccard__tag">{category.tagline}</p>
        <span className="ccard__cta">
          Explore <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  )
}
