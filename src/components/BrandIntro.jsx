import { useCallback, useEffect, useRef, useState } from 'react'
import { BRAND } from '../config/brand'
import { Emblem, Wordmark } from './Logo'
import './BrandIntro.css'

const SEEN_KEY = 'sw_intro_seen'
const EXIT_AT = 3400 // ms — when the curtain starts lifting
const EXIT_MS = 750

function shouldPlay() {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    if (sessionStorage.getItem(SEEN_KEY)) return false
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    return false
  }
  return true
}

/** 1:64 toy car, side profile, in the mascot's sticker style. */
function ToyCar() {
  return (
    <svg className="intro-car__svg" viewBox="0 0 168 76" aria-hidden="true">
      <defs>
        <linearGradient id="introCarBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd84a" />
          <stop offset="0.55" stopColor="#ffc61a" />
          <stop offset="1" stopColor="#f39208" />
        </linearGradient>
        <linearGradient id="introCarGlass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bfe0ff" />
          <stop offset="1" stopColor="#4d97e8" />
        </linearGradient>
      </defs>
      {/* sticker border */}
      <path
        d="M12 50 Q12 37 25 35 L49 33 L65 16 Q69 12 77 12 L111 12 Q119 12 124 18 L138 33 L150 35 Q158 37 158 48 L158 52 Q158 57 153 57 L17 57 Q12 57 12 52 Z"
        fill="#fff"
        stroke="#fff"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      {/* body */}
      <path
        d="M12 50 Q12 37 25 35 L49 33 L65 16 Q69 12 77 12 L111 12 Q119 12 124 18 L138 33 L150 35 Q158 37 158 48 L158 52 Q158 57 153 57 L17 57 Q12 57 12 52 Z"
        fill="url(#introCarBody)"
        stroke="#16120d"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* glass */}
      <path d="M70 19 L108 19 Q114 19 117 23 L127 33 L59 33 Z" fill="url(#introCarGlass)" stroke="#16120d" strokeWidth="3" strokeLinejoin="round" />
      <line x1="92" y1="19" x2="92" y2="33" stroke="#16120d" strokeWidth="3" />
      <path d="M74 22 L84 22 L78 30 L68 30 Z" fill="#fff" opacity="0.55" />
      {/* details */}
      <path d="M20 44 L150 44" stroke="#16120d" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
      <rect x="96" y="37" width="10" height="3" rx="1.5" fill="#16120d" />
      <circle cx="152" cy="42" r="3.2" fill="#fffbe8" stroke="#16120d" strokeWidth="2" />
      <rect x="12" y="40" width="6" height="5" rx="2" fill="#e2412b" stroke="#16120d" strokeWidth="1.6" />
      {/* wheels */}
      {[44, 126].map((cx) => (
        <g key={cx} transform={`translate(${cx} 57)`}>
          <circle r="15" fill="#fff" />
          <g className="intro-car__wheel">
            <circle r="12.5" fill="#16120d" />
            <circle r="6.5" fill="#fbf6ea" />
            <circle r="2.4" fill="#ffc61a" stroke="#16120d" strokeWidth="1.4" />
            <g stroke="#16120d" strokeWidth="1.6" strokeLinecap="round">
              <line x1="0" y1="-6" x2="0" y2="-3.2" />
              <line x1="5.2" y1="3" x2="2.8" y2="1.6" />
              <line x1="-5.2" y1="3" x2="-2.8" y2="1.6" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  )
}

/**
 * One-time brand intro (once per session). A 1:64 car drives in along a
 * measuring rule, brakes, the mascot badge pops up and the original wordmark
 * is revealed and polished with a shine — then the curtain lifts.
 * Never shown with prefers-reduced-motion; the site's static logos are
 * always present underneath, so nothing depends on this playing.
 */
// Decided once per page load (module scope), so StrictMode double renders
// and route changes never replay it.
const PLAY_ON_LOAD = shouldPlay()

export default function BrandIntro() {
  const [phase, setPhase] = useState(PLAY_ON_LOAD ? 'play' : 'done')
  const timers = useRef([])

  const finish = useCallback(() => {
    setPhase((p) => (p === 'play' ? 'exit' : p))
  }, [])

  useEffect(() => {
    if (phase === 'done') return
    if (phase === 'play') {
      document.documentElement.classList.add('intro-lock')
      timers.current.push(setTimeout(finish, EXIT_AT))
      const onKey = (e) => e.key === 'Escape' && finish()
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    }
    if (phase === 'exit') {
      document.documentElement.classList.remove('intro-lock')
      timers.current.push(setTimeout(() => setPhase('done'), EXIT_MS))
    }
  }, [phase, finish])

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      document.documentElement.classList.remove('intro-lock')
    },
    [],
  )

  if (phase === 'done') return null

  return (
    <div className={`intro ${phase === 'exit' ? 'intro--exit' : ''}`} onClick={finish} role="presentation">
      <div className="intro__glow" aria-hidden="true" />

      <div className="intro__stage" aria-hidden="true">
        <div className="intro__badge">
          <span className="intro__burst" />
          <Emblem size={220} className="intro__emblem" />
        </div>

        <div className="intro__word" style={{ '--word-mask': `url(${BRAND.wordmark})` }}>
          <Wordmark height={96} alt="" />
        </div>

        <div className="intro__road">
          <span className="intro__rule" />
          <div className="intro-car">
            <span className="intro-car__trail intro-car__trail--a" />
            <span className="intro-car__trail intro-car__trail--b" />
            <span className="intro-car__trail intro-car__trail--c" />
            <ToyCar />
          </div>
        </div>
      </div>

      <button type="button" className="intro__skip" onClick={finish}>
        Skip
      </button>
    </div>
  )
}
