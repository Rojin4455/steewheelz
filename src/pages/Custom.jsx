import { useState } from 'react'
import { Plus } from 'lucide-react'
import CustomCommission from '../components/CustomCommission'
import Reveal from '../components/Reveal'
import WhatsAppButton from '../components/WhatsAppButton'
import './Custom.css'

const FAQ = [
  ['What can you build?', 'Almost any building or scene — shops, homes, petrol pumps, restaurants, workshops, offices, temples and more. If you can photograph it, we can usually miniaturise it.'],
  ['What scale do you work in?', 'Our standard is 1:64, which matches most diecast collector cars. We can also build at 1:43, 1:87 or 1:24 on request.'],
  ['How long does a custom build take?', 'Most commissions take 3–5 weeks depending on size and detail. We’ll confirm a timeline before we begin.'],
  ['How much does it cost?', 'Every commission is quoted individually based on size, complexity and lighting. Send us your photos on WhatsApp for a quick estimate.'],
  ['Can you add lighting or custom signage?', 'Yes — LED lighting, custom shop names, logos, number plates and even tiny figures of real people.'],
]

export default function Custom() {
  const [open, setOpen] = useState(0)
  return (
    <>
      <section className="custom-hero container">
        <Reveal>
          <span className="eyebrow">Custom builds</span>
          <h1>
            Your place, <em>in miniature.</em>
          </h1>
          <p>One-of-a-kind dioramas built from your photos — the perfect gift, keepsake or showroom centrepiece.</p>
        </Reveal>
      </section>

      <CustomCommission />

      <section className="section container faq">
        <Reveal className="faq__intro">
          <span className="eyebrow">Questions</span>
          <h2>Good to know</h2>
          <p>Still curious? Message us — we usually reply within a few hours.</p>
          <WhatsAppButton message="Hi Steewheelz! I have a question about custom builds.">Ask on WhatsApp</WhatsAppButton>
        </Reveal>
        <div className="faq__list">
          {FAQ.map(([q, a], i) => (
            <div key={q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{q}</span>
                <Plus size={20} />
              </button>
              <div className="faq__answer">
                <p>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
