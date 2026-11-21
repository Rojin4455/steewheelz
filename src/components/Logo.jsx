import { BRAND } from '../config/brand'
import './Logo.css'

/** Mascot emblem only (no lettering). `size` = rendered height in px. */
export function Emblem({ size = 120, small = false, className = '', alt = '', ...rest }) {
  const h = size
  const w = Math.round(size * BRAND.ratio.emblem)
  return (
    <img
      className={`brand-emblem ${className}`}
      src={small ? BRAND.emblemSm : BRAND.emblem}
      width={w}
      height={h}
      alt={alt}
      draggable="false"
      {...rest}
    />
  )
}

/** Original script wordmark only. `height` = rendered height in px. */
export function Wordmark({ height = 40, small = false, className = '', alt = BRAND.name, ...rest }) {
  return (
    <img
      className={`brand-wordmark ${className}`}
      src={small ? BRAND.wordmarkSm : BRAND.wordmark}
      width={Math.round(height * BRAND.ratio.wordmark)}
      height={height}
      alt={alt}
      draggable="false"
      {...rest}
    />
  )
}

/** Complete original logo (mascot + lettering). `width` in px. */
export function FullLogo({ width = 200, className = '', alt = BRAND.name, ...rest }) {
  return (
    <img
      className={`brand-full ${className}`}
      src={BRAND.full}
      width={width}
      height={Math.round(width / BRAND.ratio.full)}
      alt={alt}
      draggable="false"
      {...rest}
    />
  )
}

/** Navigation lockup: compact emblem + wordmark side by side. */
export default function LogoLockup({ className = '' }) {
  return (
    <span className={`lockup ${className}`}>
      <Emblem size={52} small className="lockup__emblem" />
      <Wordmark height={30} small className="lockup__word" alt="" />
      <span className="sr-only">{BRAND.name}</span>
    </span>
  )
}
