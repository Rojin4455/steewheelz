import { useEffect, useRef, useState } from 'react'

/** Adds an "is-visible" flag once the element scrolls into view. */
export function useReveal(options = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return setVisible(true)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisible(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ref, visible]
}
