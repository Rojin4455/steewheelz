import { Camera, MessageCircle, Hammer, PackageOpen } from 'lucide-react'
import Reveal from './Reveal'
import WhatsAppButton from './WhatsAppButton'
import { Emblem } from './Logo'
import './CustomCommission.css'

const STEPS = [
  { icon: Camera, title: 'Share your photos', text: 'Send us pictures of the place — your family shop, a favourite petrol pump, your first garage.' },
  { icon: MessageCircle, title: 'Get a quote', text: 'We’ll suggest a scale, size and level of detail, and confirm a price and timeline.' },
  { icon: Hammer, title: 'We build it', text: 'Progress photos on WhatsApp as your diorama comes to life on our bench.' },
  { icon: PackageOpen, title: 'Unbox the memory', text: 'Delivered in a foam-lined gift box, ready for the shelf.' },
]

export default function CustomCommission() {
  return (
    <section className="custom" id="custom">
      <div className="container">
        <div className="custom__panel">
          <div className="custom__copy">
            <span className="eyebrow custom__eyebrow">Custom commissions</span>
            <h2>
              Have a place you love?
              <br />
              <em>We’ll shrink it.</em>
            </h2>
            <p>
              From a grandparent’s corner shop to your company’s first showroom — we build one-of-a-kind dioramas from
              your photos. Perfect for anniversaries, retirements, office lobbies and collectors.
            </p>
            <WhatsAppButton
              size="lg"
              message="Hi Steewheelz! I'd like to commission a custom miniature. Here's what I have in mind:"
            >
              Start your custom build
            </WhatsAppButton>
          </div>
          <ol className="custom__steps">
            {STEPS.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 100}>
                <span className="custom__num">{i + 1}</span>
                <div>
                  <h3>
                    <s.icon size={18} /> {s.title}
                  </h3>
                  <p>{s.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
          <Emblem size={340} className="custom__mascot" loading="lazy" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
