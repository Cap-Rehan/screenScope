import { useRef, useState, type ReactNode } from 'react'
import { Ev } from '../components/Ev'
import { useWhileActive } from '../lib/hooks'
import { stage } from '../scene/state'

const FL_TO_NITS = 3.426
const MAX_FL = 35

type Mark = { id: string; fl: number; label: string; ev: ReactNode }

const MARKS: Mark[] = [
  { id: 'std', fl: 14, label: 'Standard cinema, nominal', ev: <Ev k="standard" s="st4311" /> },
  { id: 'imax', fl: 22, label: 'IMAX with Laser, said in a 2018 interview', ev: <Ev k="claim" s="displaydaily2018" /> },
  { id: 'dolby', fl: 31, label: 'Dolby Cinema 2D, as stated by Dolby', ev: <Ev k="claim" s="christie" /> },
]

export default function Light() {
  const section = useRef<HTMLElement>(null)
  const [id, setId] = useState('std')
  const mark = MARKS.find((m) => m.id === id)!
  const X = (fl: number) => `${(fl / MAX_FL) * 100}%`

  useWhileActive(section, () => (stage.brightness = mark.fl / 31), [mark])

  return (
    <section ref={section} data-shot="light" className="scene" aria-labelledby="light-title">
      <div className="scrim max-w-[44rem]">
        <h2 id="light-title" className="display h-section">
          Brightness is a range, not a number.
        </h2>
        <p className="body mt-5">
          The cinema standard sets screen white at a nominal 14 foot-lamberts (48 cd/m²), and a theatre passes anywhere
          from about 11 to 17
          <Ev k="standard" s="st4311" />. It is measured at the centre of the screen, in the installed room, and it
          drops as lamps age and optics gather dirt
          <Ev k="standard" s="st4311" />. Premium formats state higher figures, but no independent measurement of them
          was found. Pick one to set the screen.
        </p>
      </div>

      <div className="panel mt-10 max-w-5xl">
        <div className="relative h-24" aria-hidden="true">
          <div className="absolute inset-x-0 top-11 h-px bg-ash/50" />
          <div className="absolute top-8 h-7 rounded-[2px] bg-screen/15" style={{ left: X(11), width: X(6) }} />
          <span className="small absolute top-16" style={{ left: X(11) }}>
            11–17 fL passes
          </span>
          {[0, 10, 20, 30].map((t) => (
            <span key={t} className="small absolute top-0 -translate-x-1/2 figure" style={{ left: X(t) }}>
              {t}
            </span>
          ))}
          {MARKS.map((m) => (
            <span
              key={m.id}
              className={`absolute top-6 h-11 w-[3px] -translate-x-1/2 rounded-full ${m.id === id ? 'bg-lamp' : 'bg-screen/60'}`}
              style={{ left: X(m.fl) }}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label="Brightness figure">
          {MARKS.map((m) => (
            <button key={m.id} type="button" role="radio" aria-checked={m.id === id} className="chip" onClick={() => setId(m.id)}>
              <span className="figure">{m.fl} fL</span> {m.label}
            </button>
          ))}
        </div>
        <p className="body mt-5" aria-live="polite">
          <strong className="figure">
            {mark.fl} fL ≈ {Math.round(mark.fl * FL_TO_NITS)} cd/m²
          </strong>
          : {mark.label.toLowerCase()}
          {mark.ev}. Dolby&rsquo;s figure assumes a unity-gain screen; IMAX&rsquo;s came without a stated method.
        </p>
      </div>

      <div className="mt-16 grid max-w-5xl gap-10 md:grid-cols-2">
        <div>
          <h3 className="display h-sub">Contrast depends on how you measure it.</h3>
          <p className="body mt-3">
            Spec sheets usually quote sequential contrast: a full-white frame against a full-black one. In-frame
            contrast measures bright and dark patches in the same picture, and it is always lower. One laser projector
            lists both: 2,800:1 and 500:1
            <Ev k="claim" s="barco" />. In real rooms, a Dolby researcher&rsquo;s model found audience reflections cut
            contrast by up to about 25%
            <Ev k="claim" s="dolbyModel" />.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4" aria-hidden="true">
          <figure>
            <div className="grid aspect-square grid-cols-2 overflow-hidden rounded-[2px]">
              <div className="bg-screen" />
              <div className="bg-black ring-1 ring-ash/30 ring-inset" />
            </div>
            <figcaption className="small mt-2">
              Sequential: <span className="figure text-screen">2,800:1</span>
            </figcaption>
          </figure>
          <figure>
            <div className="grid aspect-square grid-cols-4 overflow-hidden rounded-[2px]">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className={(i + Math.floor(i / 4)) % 2 ? 'bg-[#2a2622]' : 'bg-screen'} />
              ))}
            </div>
            <figcaption className="small mt-2">
              In-frame: <span className="figure text-screen">500:1</span>, the white lifts the black
            </figcaption>
          </figure>
        </div>
      </div>

      <p className="body mt-16 max-w-[44rem]">
        HDR raises both ends. In DCI&rsquo;s viewing tests, a black level of 0.005 cd/m² was enough for a compelling HDR
        picture, and viewers preferred peaks of 300 cd/m² and up
        <Ev k="independent" s="dciHdr" />, far beyond the 48 cd/m² standard. Your display can&rsquo;t reproduce either
        end, so nothing on this page pretends to show HDR.
      </p>
    </section>
  )
}
