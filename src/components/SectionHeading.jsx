import Reveal from './Reveal'
import './SectionHeading.css'

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', action, light = false }) {
  return (
    <Reveal className={`section-heading section-heading--${align} ${light ? 'section-heading--light' : ''}`}>
      <div className="section-heading__text">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="section-heading__title">{title}</h2>
        {subtitle && <p className="section-heading__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="section-heading__action">{action}</div>}
    </Reveal>
  )
}
