import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { stage } from '../scene/state'
import { useEnv } from '../components/ui'

export default function Hook() {
  const root = useRef<HTMLElement>(null)
  const { reduced } = useEnv()

  // The page's one orchestrated moment: the projector strikes, then the question appears.
  useGSAP(
    () => {
      if (reduced) {
        stage.ignite = 1
        return
      }
      stage.ignite = 0
      gsap
        .timeline({ delay: 0.4 })
        .to(stage, { ignite: 0.35, duration: 0.08 })
        .to(stage, { ignite: 0.05, duration: 0.12 })
        .to(stage, { ignite: 1, duration: 2.2, ease: 'power2.inOut' })
        .from('.hook-line', { opacity: 0, y: 24, duration: 1.1, stagger: 0.18, ease: 'power3.out' }, '-=1.3')
        .from('.hook-after', { opacity: 0, duration: 1 }, '-=0.4')
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <section ref={root} data-shot="hook" className="scene flex min-h-svh flex-col justify-end">
      <h1 className="display h-hero max-w-[11ch]">
        <span className="hook-line block">Are you actually</span>
        <span className="hook-line block">seeing the whole</span>
        <span className="hook-line block">movie?</span>
      </h1>
      <div className="hook-after mt-8 flex flex-wrap items-end justify-between gap-6">
        <p className="lede">
          One film can reach you as a wide strip, a taller frame or something close to a square. Which one you get
          depends on the screen in front of you.
        </p>
        <p className="small">Scroll to dim the house lights</p>
      </div>
    </section>
  )
}
