import { useRef, useState, type ReactNode } from 'react'
import { Ev } from '../components/Ev'
import { useWhileActive } from '../lib/hooks'
import { stage } from '../scene/state'

const LARGEST = { w: 38.8, h: 21 }
const smallestArea = (LARGEST.w * LARGEST.h) / 10

// Metres, width × height. Where a source gives two numbers without saying which is which, wider-than-tall is assumed.
const VENUES: { id: string; name: string; w: number; h: number; note: ReactNode }[] = [
  {
    id: 'leonberg',
    name: 'Leonberg, Germany',
    w: LARGEST.w,
    h: LARGEST.h,
    note: (
      <>
        Measured at 38.80 × 21.00 m, the largest permanent cinema screen in the world
        <Ev k="independent" s="guinness" />.
      </>
    ),
  },
  {
    id: 'bfi',
    name: 'BFI IMAX, London',
    w: 26,
    h: 20,
    note: (
      <>
        About 26 m wide and more than 20 m high
        <Ev k="independent" s="visitlondon" />.
      </>
    ),
  },
  {
    id: 'typical',
    name: 'Typical 15/70',
    w: 24,
    h: 18,
    note: (
      <>
        About 18 by 24 m is the commonly quoted size for a 15/70 film screen
        <Ev k="independent" s="wikipedia" />.
      </>
    ),
  },
  {
    id: 'small',
    name: 'Smallest IMAX-branded',
    // A tenth of the largest one's area, drawn at 1.90:1.
    w: Math.sqrt(smallestArea * 1.9),
    h: Math.sqrt(smallestArea / 1.9),
    note: (
      <>
        Roughly a tenth of the largest screen&rsquo;s area
        <Ev k="independent" s="wikipedia" />. Drawn at 1.90:1; the real shape varies.
      </>
    ),
  },
]
const S = 10 // SVG units per metre
const PERSON = 1.8

export default function Scale() {
  const section = useRef<HTMLElement>(null)
  const [id, setId] = useState('bfi')
  const venue = VENUES.find((v) => v.id === id)!

  useWhileActive(
    section,
    () => {
      stage.screenRatio = stage.frameRatio = venue.w / venue.h
      stage.screenMetres = venue.w
      stage.beams = 1
    },
    [venue],
  )

  return (
    <section ref={section} data-shot="scale" className="scene flex flex-col justify-end" aria-labelledby="scale-title">
      <div className="scrim max-w-[40rem]">
        <h2 id="scale-title" className="display h-section">
          Same logo, very different wall.
        </h2>
        <p className="body mt-5">
          IMAX-branded screens range from roughly a tenth of the largest one&rsquo;s area to a wall nearly 39 metres wide. How much of your view the
          screen fills depends on the room and your seat as much as the logo. Pick a screen; the person standing at its
          foot is 1.8 m tall.
        </p>
      </div>
      <figure className="panel mt-10 max-w-xl">
        <div className="seg mb-5" role="radiogroup" aria-label="Screen">
          {VENUES.map((v) => (
            <button key={v.id} type="button" role="radio" aria-checked={v.id === id} className="chip" onClick={() => setId(v.id)}>
              {v.name}
            </button>
          ))}
        </div>
        <svg
          viewBox={`0 0 ${LARGEST.w * S + 20} ${LARGEST.h * S + 30}`}
          className="w-full"
          role="img"
          aria-label={`Screen outlines drawn to scale beside a person 1.8 metres tall. ${venue.name} is highlighted.`}
        >
          {VENUES.map((v) => (
            <rect
              key={v.id}
              x={10}
              y={LARGEST.h * S + 10 - v.h * S}
              width={v.w * S}
              height={v.h * S}
              fill={v.id === id ? 'rgb(255 165 49 / 0.18)' : 'none'}
              stroke={v.id === id ? 'var(--color-lamp)' : 'var(--color-ash)'}
              strokeOpacity={v.id === id ? 1 : 0.5}
              strokeWidth={2}
            />
          ))}
          <rect x={10 + LARGEST.w * S - 30} y={LARGEST.h * S + 10 - PERSON * S} width={5} height={PERSON * S} rx={2.5} fill="var(--color-screen)" />
          <line x1={0} y1={LARGEST.h * S + 10} x2={LARGEST.w * S + 20} y2={LARGEST.h * S + 10} stroke="var(--color-ash)" strokeOpacity={0.5} />
        </svg>
        <figcaption className="mt-4" aria-live="polite">
          <p className="display h-sub">
            {venue.w.toFixed(1)} × {venue.h.toFixed(1)} m
          </p>
          <p className="body mt-2">
            {venue.note} That&rsquo;s about {Math.round(venue.h / PERSON)} people stacked head to toe.
          </p>
        </figcaption>
      </figure>
    </section>
  )
}
