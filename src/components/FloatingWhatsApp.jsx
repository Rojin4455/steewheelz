import { useEffect, useState } from 'react'
import { whatsappLink } from '../lib/whatsapp'
import WhatsAppIcon from './WhatsAppIcon'
import './FloatingWhatsApp.css'

export default function FloatingWhatsApp() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={`fab-wa ${show ? 'is-visible' : ''}`}
      aria-label="Chat with Steewheelz on WhatsApp"
    >
      <span className="fab-wa__pulse" />
      <WhatsAppIcon size={28} />
      <span className="fab-wa__label">Need help? Chat with us</span>
    </a>
  )
}
