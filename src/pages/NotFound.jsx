import { Link } from 'react-router-dom'
import { Emblem } from '../components/Logo'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="nf container">
      <Emblem size={170} />
      <span className="eyebrow">Error 404</span>
      <h1>
        This road <em>doesn’t exist</em> — yet.
      </h1>
      <p>The page you’re looking for has moved, or was never built. Let’s get you back on the map.</p>
      <div className="nf__ctas">
        <Link to="/" className="btn btn--sun">
          Back to home
        </Link>
        <Link to="/shop" className="btn btn--ghost">
          Browse the collection
        </Link>
      </div>
    </section>
  )
}
