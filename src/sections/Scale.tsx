import { useRef } from 'react'
import { Ev } from '../components/Ev'
import { useWhileActive } from '../lib/hooks'
import { stage } from '../scene/state'

// Metres. Orientation (wider than tall) is assumed; the sources give sizes without saying which side is which.
const SCREENS = [
  { label: 'Largest: about 38 × 22 m', w: 38, h: 22 },
  { label: 'Typical 15/70: about 24 × 18 m', w: 24, h: 18 },
  // A tenth of the largest one's area, drawn at 1.90:1.
  { label: 'Smallest IMAX-branded: about a tenth of the largest', w: Math.sqrt((38 * 22 * 1.9) / 10), h: Math.sqrt((38 * 22) / 10 / 1.9) },
]
const S = 10 // SVG units per metre

export default function Scale() {
  const section = useRef<HTMLElement>(null)
  useWhileActive(
    section,
    () => {
      stage.screenRatio = stage.frameRatio = 1.43
      stage.beams = 1
    },
    [],
  )

  return (
    <section ref={section} data-shot="scale" className="scene flex flex-col justify-end" aria-labelledby="scale-title">
      <div className="scrim max-w-[40rem]">
        <h2 id="scale-title" className="display h-section">
          Same logo, very different wall.
        </h2>
        <p className="body mt-5">
          Typical 15/70 IMAX screens measure about 18 by 24 metres; the largest, in Leonberg, Germany, about 38 by 22
          <Ev k="independent" s="wikipedia" />. The smallest IMAX-branded screens have roughly a tenth of the largest
          one&rsquo;s area
          <Ev k="independent" s="wikipedia" />. How much of your view the screen fills depends on the room and your
          seat as much as the logo.
        </p>
      </div>
      <figure className="panel mt-10 max-w-xl">
        <svg viewBox={`0 0 ${38 * S + 20} ${22 * S + 30}`} className="w-full" role="img" aria-label="Three screen outlines drawn to scale beside a person 1.8 metres tall.">
          {SCREENS.map((sc, i) => (
            <rect
              key={sc.label}
              x={10}
              y={22 * S + 10 - sc.h * S}
              width={sc.w * S}
              height={sc.h * S}
              fill={i === 2 ? 'rgb(255 165 49 / 0.25)' : 'none'}
              stroke={i === 0 ? 'var(--color-ash)' : i === 1 ? 'var(--color-screen)' : 'var(--color-lamp)'}
              strokeWidth={2}
              strokeDasharray={i === 0 ? '6 5' : undefined}
            />
          ))}
          <rect x={10 + 38 * S - 30} y={22 * S + 10 - 18} width={5} height={18} rx={2.5} fill="var(--color-screen)" />
          <line x1={0} y1={22 * S + 10} x2={38 * S + 20} y2={22 * S + 10} stroke="var(--color-ash)" strokeOpacity={0.5} />
        </svg>
        <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 small">
          <span>Dashed: the largest, about 38 × 22 m</span>
          <span className="text-screen">White: typical 15/70, about 24 × 18 m</span>
          <span className="text-lamp">Amber: a tenth of the largest</span>
          <span>Bar on the right: a person, 1.8 m</span>
        </figcaption>
      </figure>
    </section>
  )
}
