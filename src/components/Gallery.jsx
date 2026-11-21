import { useCallback, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, ZoomIn } from 'lucide-react'
import Lightbox from './Lightbox'
import './Gallery.css'

export default function Gallery({ images, name, badge }) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const [lightbox, setLightbox] = useState(false)
  const touch = useRef(null)

  const go = useCallback((d) => setIndex((i) => (i + d + images.length) % images.length), [images.length])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }

  const onTouchStart = (e) => (touch.current = e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touch.current == null) return
    const dx = e.changedTouches[0].clientX - touch.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touch.current = null
  }

  return (
    <div className="gallery">
      <div className="gallery__thumbs" role="tablist" aria-label="Product images">
        {images.map((img, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === index}
            aria-label={`Show image ${i + 1}: ${img.alt}`}
            className={`gallery__thumb ${i === index ? 'is-active' : ''}`}
            onClick={() => setIndex(i)}
          >
            <img src={img.src} alt="" />
          </button>
        ))}
      </div>

      <div className="gallery__stage">
        <div
          className={`gallery__frame ${zoom ? 'is-zoom' : ''}`}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={onMove}
          onClick={() => setLightbox(true)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={`${name} — ${img.alt}`}
              className={`gallery__img ${i === index ? 'is-active' : ''}`}
              style={i === index ? { transformOrigin: origin } : undefined}
              draggable="false"
            />
          ))}
        </div>

        {badge && <span className="gallery__badge">{badge}</span>}
        <span className="gallery__hint">
          <ZoomIn size={14} /> Hover to zoom · click to expand
        </span>

        <button className="gallery__nav gallery__nav--prev" onClick={() => go(-1)} aria-label="Previous image">
          <ChevronLeft size={22} />
        </button>
        <button className="gallery__nav gallery__nav--next" onClick={() => go(1)} aria-label="Next image">
          <ChevronRight size={22} />
        </button>

        <div className="gallery__bar">
          <span className="gallery__count">
            <strong>{String(index + 1).padStart(2, '0')}</strong> / {String(images.length).padStart(2, '0')}
            <em>{images[index].alt}</em>
          </span>
          <button className="gallery__expand" onClick={() => setLightbox(true)} aria-label="Open full-screen gallery">
            <Expand size={18} />
          </button>
        </div>
      </div>

      <Lightbox open={lightbox} images={images} index={index} onIndex={setIndex} onClose={() => setLightbox(false)} name={name} />
    </div>
  )
}
