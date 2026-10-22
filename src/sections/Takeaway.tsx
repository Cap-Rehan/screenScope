import { useRef } from 'react'
import gsap from 'gsap'
import { useEnv } from '../components/ui'
import { useWhileActive } from '../lib/hooks'
import { stage } from '../scene/state'

const QUESTIONS = [
  {
    q: 'Which projection system does this screen use?',
    a: 'Film, two laser projectors, one laser projector or xenon. The IMAX logo alone won’t tell you, so check the cinema’s own page or fan-run venue lists.',
  },
  {
    q: 'What shape is the screen?',
    a: 'A tall 1.43 screen can show the whole IMAX frame. A 1.90 screen shows the trimmed version.',
  },
  {
    q: 'Was the film made for that shape?',
    a: 'A taller screen only shows more picture when the film was shot or released in that taller ratio.',
  },
]

export default function Takeaway() {
  const { reduced } = useEnv()
  const section = useRef<HTMLElement>(null)

  // Back to the opening screen: same shape, blank light.
  useWhileActive(
    section,
    () => {
      stage.screenRatio = stage.frameRatio = 1.9
      stage.beams = 1
    },
    [],
  )

  const again = () => {
    if (reduced) {
      window.scrollTo({ top: 0 })
      return
    }
    // Dim the house, travel back to the opening shot, strike the lamp again.
    gsap
      .timeline()
      .to(stage, { ignite: 0, duration: 0.6, ease: 'power2.in' })
      .add(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
      .to(stage, { ignite: 1, duration: 2.4, ease: 'power2.inOut' }, '+=1.2')
  }

  return (
    <section ref={section} data-shot="takeaway" className="scene flex min-h-[160svh] flex-col justify-between" aria-labelledby="takeaway-title">
      <div className="scrim max-w-[40rem]">
        <h2 id="takeaway-title" className="display h-section max-w-[14ch]">
          Before you book, ask three things.
        </h2>
        <dl className="mt-10 space-y-8">
          {QUESTIONS.map(({ q, a }) => (
            <div key={q}>
              <dt className="display h-sub">{q}</dt>
              <dd className="body mt-2">{a}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-[40svh] pb-[8svh]">
        <p className="display h-hero max-w-[11ch]">Now you know what you might be missing.</p>
        <button type="button" className="cta mt-10" onClick={again}>
          See it again
        </button>
      </div>
    </section>
  )
}
