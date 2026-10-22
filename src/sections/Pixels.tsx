import { useState } from 'react'
import { Ev } from '../components/Ev'
import { cutoffFrequency, impliedK, mtf, pixelsPerDegree, viewAngleDeg } from '../lib/geometry'
import { Seg, pct } from '../components/ui'

const W = 200 // screen width in SVG units
const MAX_PPD = 110

function SeatDiagram({ d }: { d: number }) {
  const sy = 24 + d * W
  const half = viewAngleDeg(d) / 2
  return (
    <svg viewBox="0 0 400 440" className="w-full max-w-[26rem]" aria-hidden="true">
      <line x1={100} y1={20} x2={300} y2={20} stroke="var(--color-lamp)" strokeWidth={5} strokeLinecap="round" />
      <text x={200} y={12} textAnchor="middle" fill="var(--color-ash)" fontSize={12}>
        screen
      </text>
      <path d={`M100 20 L200 ${sy} L300 20`} fill="rgb(255 165 49 / 0.08)" stroke="var(--color-screen)" strokeOpacity={0.5} />
      <circle cx={200} cy={sy} r={8} fill="var(--color-screen)" />
      <text x={214} y={sy + 4} fill="var(--color-screen)" fontSize={13}>
        you
      </text>
      <text x={200} y={sy - 26} textAnchor="middle" fill="var(--color-screen)" fontSize={14} className="figure">
        {Math.round(half * 2)}°
      </text>
    </svg>
  )
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr_3.5rem] items-center gap-3">
      <span className="small">{label}</span>
      <div className="relative h-3 rounded-full bg-velvet">
        <div className="absolute inset-y-0 left-0 rounded-full bg-lamp" style={{ width: `${(Math.min(value, MAX_PPD) / MAX_PPD) * 100}%` }} />
        {[60, 94].map((m) => (
          <div key={m} className="absolute -inset-y-1.5 w-px bg-screen" style={{ left: `${(m / MAX_PPD) * 100}%` }} />
        ))}
      </div>
      <span className="figure text-right font-bold">{Math.round(value)}</span>
    </div>
  )
}

const FRAME_MM = 69.6
const CUTOFFS = [0.5, 0.2, 0.1, 0.05, 0.03] as const
const F_MAX = 140

/** Same illustrative film curve, different "K" depending on where you cut it. */
function FilmK() {
  const [c, setC] = useState<(typeof CUTOFFS)[number]>(0.1)
  const f = cutoffFrequency(c)
  const X = (v: number) => 40 + (v / F_MAX) * 340
  const Y = (v: number) => 20 + (1 - v) * 180
  const curve = Array.from({ length: 71 }, (_, i) => {
    const v = (i / 70) * F_MAX
    return `${i ? 'L' : 'M'}${X(v).toFixed(1)} ${Y(mtf(v)).toFixed(1)}`
  }).join(' ')

  return (
    <aside className="panel grid gap-8 lg:col-span-2 lg:grid-cols-[1fr_1.1fr] lg:items-center" aria-labelledby="film-title">
      <div>
        <h3 id="film-title" className="display h-sub">
          And film?
        </h3>
        <p className="body mt-3">
          Film has no pixels. Detail fades gradually as it gets finer, measured as a curve (MTF)
          <Ev k="claim" s="kodak" />, so any &ldquo;K&rdquo; number depends on where you draw the line. IMAX&rsquo;s
          &ldquo;14K to 16K per color&rdquo; for 15/70 is a manufacturer claim, reported second-hand
          <Ev k="claim" s="ymcinema16k" />.
        </p>
        <div className="mt-5">
          <Seg label="Count detail down to this much contrast" options={CUTOFFS} value={c} onChange={setC} format={pct} />
        </div>
        <dl className="readout mt-5" aria-live="polite">
          <dt>
            &ldquo;K&rdquo; across a 69.6 mm frame
            <Ev k="estimate" />
          </dt>
          <dd className="figure">{impliedK(c, FRAME_MM).toFixed(1)}K</dd>
        </dl>
        <p className="small mt-4">
          An illustrative curve, not measured data for any film stock. It describes a camera negative; prints and
          projection lose more.
        </p>
      </div>
      <svg viewBox="0 0 400 240" className="w-full" aria-hidden="true">
        <line x1={40} y1={200} x2={380} y2={200} stroke="var(--color-ash)" strokeOpacity={0.5} />
        <line x1={40} y1={20} x2={40} y2={200} stroke="var(--color-ash)" strokeOpacity={0.5} />
        <text x={40} y={225} fill="var(--color-ash)" fontSize={11}>
          coarse detail
        </text>
        <text x={380} y={225} textAnchor="end" fill="var(--color-ash)" fontSize={11}>
          fine detail (line pairs per mm)
        </text>
        <text x={34} y={24} textAnchor="end" fill="var(--color-ash)" fontSize={11}>
          100%
        </text>
        <text x={34} y={204} textAnchor="end" fill="var(--color-ash)" fontSize={11}>
          0
        </text>
        <path d={curve} fill="none" stroke="var(--color-screen)" strokeWidth={2} />
        <line x1={40} y1={Y(c)} x2={X(f)} y2={Y(c)} stroke="var(--color-lamp)" strokeDasharray="4 4" />
        <line x1={X(f)} y1={Y(c)} x2={X(f)} y2={200} stroke="var(--color-lamp)" strokeDasharray="4 4" />
        <circle cx={X(f)} cy={Y(c)} r={5} fill="var(--color-lamp)" />
        <text x={X(f) + 8} y={Y(c) - 8} fill="var(--color-lamp)" fontSize={12} className="figure">
          {Math.round(f)} lp/mm
        </text>
      </svg>
    </aside>
  )
}

export default function Pixels() {
  const [d, setD] = useState(0.8)
  const p2k = pixelsPerDegree(2048, d)
  const p4k = pixelsPerDegree(4096, d)
  const verdict =
    p2k >= 60
      ? 'From here even 2K packs more than 60 pixels into each degree.'
      : p4k >= 60
        ? '2K falls below the 60 mark here; 4K stays above it.'
        : 'This close, both fall below 60 pixels per degree. Your eye could resolve more than the projector gives.'

  return (
    <section data-shot="pixels" className="scene grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]" aria-labelledby="pixels-title">
      <div className="scrim">
        <h2 id="pixels-title" className="display h-section max-w-[13ch]">
          Pixels only matter until your eye runs out.
        </h2>
        <p className="body mt-5">
          IMAX with Laser uses two 4K projectors
          <Ev k="claim" s="whathifi" /> and Dolby Cinema uses two 4K laser projection heads
          <Ev k="claim" s="christie" />, so pixel count alone doesn&rsquo;t separate them. What changes with your seat is
          how many pixels land in each degree of your view.
        </p>
        <p className="body">
          The 20/20 benchmark is about 60 pixels per degree, and a 2025 lab study put the eye&rsquo;s limit nearer 94
          <Ev k="independent" s="acuity" />. That study used displays, not cinemas.
        </p>
      </div>

      <div className="panel">
        <SeatDiagram d={d} />
        <label className="control-label mt-4" htmlFor="seat">
          Seat distance: <span className="figure text-screen">{d.toFixed(2)}</span> screen widths from the screen
        </label>
        <input id="seat" type="range" min={0.4} max={2} step={0.05} value={d} onChange={(e) => setD(+e.target.value)} />
        <div className="mt-5 space-y-3" aria-live="polite">
          <p className="small">
            Pixels per degree, averaged across the screen
            <Ev k="estimate" />. White ticks mark 60 and 94.
          </p>
          <Bar label="2K" value={p2k} />
          <Bar label="4K" value={p4k} />
          <p className="body mt-2">{verdict}</p>
        </div>
      </div>
      <FilmK />
    </section>
  )
}
