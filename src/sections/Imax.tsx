import { useRef, useState, type ReactNode } from 'react'
import { Ev } from '../components/Ev'
import { ScreenSlot, ratio } from '../components/ui'
import { useWhileActive } from '../lib/hooks'
import { stage } from '../scene/state'

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
