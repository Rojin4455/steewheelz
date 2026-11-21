import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAsync } from '../hooks/useAsync'
import { getProducts } from '../services/catalog'
import Reveal from '../components/Reveal'
import CustomCommission from '../components/CustomCommission'
import './About.css'

const VALUES = [
  { k: 'Patience', v: 'A single diorama can take three weeks. We never rush the details that make it feel real.' },
  { k: 'Honesty', v: 'What you see in the photos is what we build — and we’ll send progress shots along the way.' },
  { k: 'Play', v: 'These are collectibles, but they should still make you smile like you did at eight years old.' },
]

export default function About() {
  const { data: products } = useAsync(() => getProducts({ filter: 'featured' }), [])
  const pics = (products ?? []).slice(0, 3)
  return (
    <>
      <section className="about-hero grain">
        <div className="container about-hero__inner">
          <Reveal>
            <span className="eyebrow">Our story</span>
            <h1>
              We build the places
              <br />
              <em>your cars call home.</em>
            </h1>
          </Reveal>
          <Reveal delay={120} className="about-hero__lead">
            <p>
              Steewheelz began on a kitchen table with a box of diecast cars and nowhere to park them. A cardboard garage
              became a foam-board fuel station, then a drive-thru, then a whole street.
            </p>
            <p>
              Today we design and hand-build miniature dioramas for collectors, gift-givers and businesses who want a
              tiny, perfect version of a place that matters.
            </p>
          </Reveal>
        </div>
        <div className="container about-strip">
          {pics.map((p, i) => (
            <Reveal key={p.id} delay={i * 120} className="about-strip__item">
              <img src={p.images[i % 2 ? 1 : 3].src} alt={p.name} loading="lazy" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section container about-values">
        <Reveal className="about-values__intro">
          <span className="eyebrow">What we believe</span>
          <h2>Three rules on the workbench.</h2>
        </Reveal>
        <div className="about-values__list">
          {VALUES.map((v, i) => (
            <Reveal key={v.k} delay={i * 100} className="value">
              <span className="value__num">0{i + 1}</span>
              <h3>{v.k}</h3>
              <p>{v.v}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CustomCommission />

      <section className="section--tight container about-end">
        <h2>Ready to start your collection?</h2>
        <Link to="/shop" className="btn btn--sun btn--lg">
          <span>Shop the collection</span>
          <ArrowRight className="arrow" />
        </Link>
      </section>
    </>
  )
}
