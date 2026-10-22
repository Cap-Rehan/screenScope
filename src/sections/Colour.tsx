import { useState } from 'react'
import { Ev } from '../components/Ev'
import { DCI_WHITE, GAMUTS, LOCUS } from '../lib/colour'

type Key = keyof typeof GAMUTS

const SPACES: { key: Key; name: string; use: string; stroke: string; dash?: string }[] = [
  { key: 'rec709', name: 'Rec. 709', use: 'HD television', stroke: 'var(--color-ash)', dash: '5 4' },
  { key: 'p3', name: 'DCI-P3', use: 'The cinema reference', stroke: 'var(--color-lamp)' },
  { key: 'rec2020', name: 'Rec. 2020', use: 'Ultra HD, wider still', stroke: 'var(--color-screen)' },
]

// Chart maps x 0..0.8 and y 0..0.9 into a 400 x 440 box.
const px = (x: number) => 30 + (x / 0.8) * 360
const py = (y: number) => 420 - (y / 0.9) * 400
const path = (pts: [number, number][], close = true) =>
  pts.map(([x, y], i) => `${i ? 'L' : 'M'}${px(x).toFixed(1)} ${py(y).toFixed(1)}`).join(' ') + (close ? ' Z' : '')

export default function Colour() {
  const [on, setOn] = useState<Record<Key, boolean>>({ rec709: true, p3: true, rec2020: false })

  return (
    <section data-shot="colour" className="scene grid items-center gap-12 lg:grid-cols-[1fr_1fr]" aria-labelledby="colour-title">
      <div className="scrim">
        <h2 id="colour-title" className="display h-section max-w-[12ch]">
          Every system draws a different triangle.
        </h2>
        <p className="body mt-5">
          The curved outline holds every colour of light the eye can see
          <Ev k="standard" s="cie" />. A projector mixes three primaries, so it can only show colours inside the
          triangle they make. Cinema&rsquo;s reference is DCI-P3
          <Ev k="standard" s="st2113" />; HD television uses the smaller Rec. 709
          <Ev k="standard" s="bt709" />; Rec. 2020 reaches further
          <Ev k="standard" s="bt2020" />.
        </p>
        <p className="body">
          Laser projectors with pure red, green and blue light can approach Rec. 2020. One Christie projector claims
          more than 90% coverage on its datasheet and more than 95% on its product page
          <Ev k="claim" s="christieRgb" />. Whether any particular IMAX or Dolby auditorium covers Rec. 2020 wasn&rsquo;t
          verified.
        </p>
      </div>

      <div className="panel">
        <svg viewBox="0 0 420 440" className="mx-auto w-full max-w-[28rem]" role="img" aria-label={`CIE 1931 chromaticity chart showing ${SPACES.filter((s) => on[s.key]).map((s) => s.name).join(', ') || 'no'} gamut triangles inside the range of visible colour.`}>
          <path d={path(LOCUS)} fill="rgb(243 238 228 / 0.04)" stroke="var(--color-ash)" strokeOpacity={0.7} />
          {SPACES.map(
            (s) =>
              on[s.key] && (
                <path key={s.key} d={path(GAMUTS[s.key])} fill="none" stroke={s.stroke} strokeWidth={2} strokeDasharray={s.dash} strokeLinejoin="round" />
              ),
          )}
          <circle cx={px(DCI_WHITE[0])} cy={py(DCI_WHITE[1])} r={3.5} fill="var(--color-screen)" />
          <text x={px(DCI_WHITE[0]) + 8} y={py(DCI_WHITE[1]) + 4} fill="var(--color-ash)" fontSize={11}>
            DCI white
          </text>
          <text x={px(0.0743)} y={py(0.8338) - 10} fill="var(--color-ash)" fontSize={11} textAnchor="middle">
            520 nm
          </text>
          <text x={px(0.7347) + 4} y={py(0.2653) + 14} fill="var(--color-ash)" fontSize={11}>
            700 nm
          </text>
          <text x={px(0.1741)} y={py(0.005) + 16} fill="var(--color-ash)" fontSize={11} textAnchor="middle">
            380 nm
          </text>
        </svg>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Colour spaces">
          {SPACES.map((s) => (
            <button key={s.key} type="button" className="chip" aria-pressed={on[s.key]} onClick={() => setOn((o) => ({ ...o, [s.key]: !o[s.key] }))}>
              {s.name}
              <span className="sr-only">, {s.use}</span>
            </button>
          ))}
        </div>
        <p className="small mt-4">
          Positions are exact; the page can&rsquo;t display these colours themselves, so the chart uses outlines only.
          Dashed: Rec. 709. Amber: DCI-P3. White: Rec. 2020.
        </p>
      </div>
    </section>
  )
}
