import { useRef, useState, type ReactNode } from 'react'
import { Ev } from '../components/Ev'
import { ScreenSlot, ratio, useEnv } from '../components/ui'
import { useWhileActive } from '../lib/hooks'
import { stage } from '../scene/state'

// Drawing scale and film geometry in millimetres. Frame sizes are sourced; perforation pitch is drawn, not measured.
const PX = 3
const FILM = 70
const PERF_PITCH = 4.75
const IMAX_FRAME = { w: 69.6, h: 48.5 }
const FIVE_PERF = { w: 48.5, h: 22.1 }

function Perfs({ along, from, to, at, vertical }: { along: number; from: number; to: number; at: number; vertical?: boolean }) {
  const holes = []
  for (let d = from; d < to; d += PERF_PITCH * PX) {
    holes.push(
      vertical ? (
        <rect key={d} x={at - 3} y={along + d} width={6} height={8} rx={1.5} fill="#000" />
      ) : (
        <rect key={d} x={along + d} y={at - 3} width={8} height={6} rx={1.5} fill="#000" />
      ),
    )
  }
  return <>{holes}</>
}

/** The same 70mm film, run sideways by IMAX (15 perforations a frame) and upright by standard 70mm (5). */
function FilmStrips() {
  const { still } = useEnv()
  const H = FILM * PX
  const aPitch = 15 * PERF_PITCH * PX
  const bPitch = 5 * PERF_PITCH * PX
  const ax = (FILM - IMAX_FRAME.h) / 2
  const bx = (FILM - FIVE_PERF.w) / 2
  return (
    <figure className="mt-8">
      <svg viewBox="0 0 700 250" className="w-full" role="img" aria-label="Two strips of 70mm film drawn to scale. IMAX runs the film sideways with a frame 15 perforations long; standard 70mm runs it upright with a frame 5 perforations tall.">
        <defs>
          <clipPath id="strip-a">
            <rect x={0} y={20} width={440} height={H} />
          </clipPath>
          <clipPath id="strip-b">
            <rect x={480} y={20} width={H} height={H} />
          </clipPath>
        </defs>
        <g clipPath="url(#strip-a)">
          <rect x={0} y={20} width={440} height={H} fill="#2a1f17" />
          {[-aPitch + 120, 120, aPitch + 120].map((x) => (
            <image key={x} href={still.src} x={x} y={20 + ax * PX} width={IMAX_FRAME.w * PX} height={IMAX_FRAME.h * PX} preserveAspectRatio="xMidYMid slice" />
          ))}
          <rect x={120} y={20 + ax * PX} width={IMAX_FRAME.w * PX} height={IMAX_FRAME.h * PX} fill="none" stroke="var(--color-lamp)" strokeWidth={2} />
          <Perfs along={0} from={0} to={440} at={20 + (ax * PX) / 2} />
          <Perfs along={0} from={0} to={440} at={20 + H - (ax * PX) / 2} />
        </g>
        <g clipPath="url(#strip-b)">
          <rect x={480} y={20} width={H} height={H} fill="#2a1f17" />
          {[-bPitch + 40, 40, bPitch + 40].map((y) => (
            <image key={y} href={still.src} x={480 + bx * PX} y={20 + y} width={FIVE_PERF.w * PX} height={FIVE_PERF.h * PX} preserveAspectRatio="xMidYMid slice" />
          ))}
          <rect x={480 + bx * PX} y={60} width={FIVE_PERF.w * PX} height={FIVE_PERF.h * PX} fill="none" stroke="var(--color-screen)" strokeWidth={2} />
          <Perfs vertical along={20} from={0} to={H} at={480 + (bx * PX) / 2} />
          <Perfs vertical along={20} from={0} to={H} at={480 + H - (bx * PX) / 2} />
        </g>
      </svg>
      <figcaption className="small mt-3 max-w-[60ch]">
        <span className="text-lamp">Left, amber: IMAX 15/70, running sideways.</span>{' '}
        <span className="text-screen">Right, white: standard 70mm, running upright.</span> Same scale. IMAX&rsquo;s
        frame spans 15 perforations, about 69.6 × 48.5 mm; standard 70mm uses 5, about 48.5 × 22.1 mm
        <Ev k="independent" s="wikipedia" />. That&rsquo;s about {(IMAX_FRAME.w / FIVE_PERF.h).toFixed(1)} times the
        picture area
        <Ev k="estimate" />.
      </figcaption>
    </figure>
  )
}

type System = { id: string; name: string; ratio: number; beams: number; detail: ReactNode }

export const SYSTEMS: System[] = [
  {
    id: 'film',
    name: '15/70 film',
    ratio: 1.43,
    beams: 1,
    detail: (
      <>
        70mm prints run sideways through the projector, each frame 15 perforations wide and about 69.6 × 48.5 mm
        <Ev k="independent" s="wikipedia" />. Fills a tall 1.43:1 screen. IMAX counted 52 film systems at the end of
        2025
        <Ev k="filing" s="tenk" />. It&rsquo;s analogue, so grain and print wear vary from show to show.
      </>
    ),
  },
  {
    id: 'gt',
    name: 'Laser, two projectors',
    ratio: 1.43,
    beams: 2,
    detail: (
      <>
        Two 4K laser projectors overlap on one screen (often called GT). They can project the full 1.43:1 frame in
        suitably tall theatres
        <Ev k="independent" s="engadget" />. How many such screens exist is unresolved: published counts disagree.
      </>
    ),
  },
  {
    id: 'single',
    name: 'Laser, one projector',
    ratio: 1.9,
    beams: 1,
    detail: (
      <>
        A single 4K laser projector, installed from 2018 onwards. It typically tops out at 1.90:1
        <Ev k="independent" s="engadget" />, so 1.43 scenes arrive with their top and bottom trimmed.
      </>
    ),
  },
  {
    id: 'xenon',
    name: 'Xenon digital',
    ratio: 1.9,
    beams: 2,
    detail: (
      <>
        The 2008-era digital system: two 2K projectors lit by xenon lamps, at 1.90:1
        <Ev k="independent" s="engadget" />. IMAX no longer offers it for new signings, yet it was still the largest
        group, with 1,089 systems at the end of 2025
        <Ev k="filing" s="tenk" />.
      </>
    ),
  },
]

export default function Imax() {
  const section = useRef<HTMLElement>(null)
  const [id, setId] = useState('film')
  const sys = SYSTEMS.find((s) => s.id === id)!

  useWhileActive(
    section,
    () => {
      stage.screenRatio = sys.ratio
      stage.frameRatio = sys.ratio
      stage.beams = sys.beams
    },
    [sys],
  )

  return (
    <section ref={section} data-shot="imax" aria-labelledby="imax-title">
      <header className="intro scrim">
        <h2 id="imax-title" className="display h-section">
          IMAX is a brand, not one screen.
        </h2>
        <p className="body mt-5">
          IMAX&rsquo;s annual report lists three families of projection system (film, laser and xenon digital) in a
          range of sizes and configurations
          <Ev k="filing" s="tenk" />. Of 1,864 IMAX systems at the end of 2025, more than half were the older xenon
          type
          <Ev k="filing" s="tenk" />.
        </p>
        <FilmStrips />
      </header>
      <div style={{ height: '130svh' }}>
      <div className="sticky">
        <div className="copy-col scrim">
          <div role="radiogroup" aria-label="Projection system">
            <div className="seg">
              {SYSTEMS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={s.id === id}
                  className="chip"
                  onClick={() => setId(s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="panel mt-5" aria-live="polite">
            <p className="display h-sub">{ratio(sys.ratio)}</p>
            <p className="small mt-1">{sys.beams === 2 ? 'Two projectors' : 'One projector'}</p>
            <p className="body mt-3">{sys.detail}</p>
          </div>

          <p className="small mt-5 max-w-[60ch]">
            On posters, &ldquo;Shot with IMAX&rdquo; means IMAX&rsquo;s own cameras, natively 1.43:1. &ldquo;Filmed for
            IMAX&rdquo; means a film planned for IMAX throughout, often on certified digital cameras that fill 1.90
            screens
            <Ev k="independent" s="slashfilmImax" />.
          </p>
          <p className="small mt-3 max-w-[60ch]">
            IMAX&rsquo;s theatre finder doesn&rsquo;t list which system a venue runs
            <Ev k="independent" s="engadget" />, and &ldquo;LieMAX&rdquo; is a fan nickname, not a specification
            <Ev k="independent" s="slashfilm" />.
          </p>
        </div>
        <ScreenSlot
          screen={sys.ratio}
          frame={sys.ratio}
          alt={`${sys.name}: a ${ratio(sys.ratio)} screen lit by ${sys.beams === 2 ? 'two projectors' : 'one projector'}.`}
        />
      </div>
      </div>
    </section>
  )
}
