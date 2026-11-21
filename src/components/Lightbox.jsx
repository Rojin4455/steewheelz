import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react'
import './Lightbox.css'

export default function Lightbox({ open, images, index, onIndex, onClose, name }) {
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  const touch = useRef(null)

  const go = (d) => {
    setZoom(false)
    onIndex((index + d + images.length) % images.length)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  })

  useEffect(() => {
    if (!open) setZoom(false)
  }, [open])

  if (!open) return null

  const onMove = (e) => {
    if (!zoom) return
    const r = e.currentTarget.getBoundingClientRect()
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${name} gallery`}>
      <div className="lightbox__top">
        <span className="lightbox__title">
          {name} <em>{images[index].alt}</em>
        </span>
        <div className="lightbox__tools">
          <button onClick={() => setZoom((z) => !z)} aria-label={zoom ? 'Zoom out' : 'Zoom in'}>
            {zoom ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
          </button>
          <button onClick={onClose} aria-label="Close gallery">
            <X size={22} />
          </button>
        </div>
      </div>

      <div
        className={`lightbox__stage ${zoom ? 'is-zoom' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null || zoom) return
          const dx = e.changedTouches[0].clientX - touch.current
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
          touch.current = null
        }}
      >
        <img
          key={index}
          src={images[index].src}
          alt={`${name} — ${images[index].alt}`}
          onClick={() => setZoom((z) => !z)}
          onMouseMove={onMove}
          style={{ transformOrigin: origin }}
          draggable="false"
        />
        <button className="lightbox__nav lightbox__nav--prev" onClick={() => go(-1)} aria-label="Previous image">
          <ChevronLeft size={26} />
        </button>
        <button className="lightbox__nav lightbox__nav--next" onClick={() => go(1)} aria-label="Next image">
          <ChevronRight size={26} />
        </button>
      </div>

      <div className="lightbox__thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={i === index ? 'is-active' : ''}
            onClick={() => {
              setZoom(false)
              onIndex(i)
            }}
            aria-label={`Show image ${i + 1}`}
          >
            <img src={img.src} alt="" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  )
}
