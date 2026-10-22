import { useMemo, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react'
import { Ev } from '../components/Ev'
import { Seg } from '../components/ui'
import { useWhileActive } from '../lib/hooks'
import { gains, makeSpeakers, nearestGroup, type Group, type Mode, type Point } from '../lib/sound'
import { stage } from '../scene/state'

const X0 = 20
const Y0 = 30
const RW = 260
const RD = 370
const toSvg = (p: Point) => ({ x: X0 + p.x * RW, y: Y0 + p.y * RD })
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

const GROUP_NAME: Record<Group, string> = {
  L: 'left screen',
  C: 'centre screen',
  R: 'right screen',
  left: 'left surround',
  right: 'right surround',
  back: 'rear surround',
}

const PRESETS: { label: string; p: Point }[] = [
  { label: 'On screen', p: { x: 0.5, y: 0.04 } },
  { label: 'Left wall', p: { x: 0.08, y: 0.45 } },
  { label: 'Behind you', p: { x: 0.62, y: 0.94 } },
  { label: 'Right wall', p: { x: 0.92, y: 0.7 } },
]

export default function Sound() {
  const section = useRef<HTMLElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const [mode, setMode] = useState<Mode>('objects')
  const [count, setCount] = useState(32)
  const [orb, setOrb] = useState<Point>({ x: 0.3, y: 0.35 })
  const speakers = useMemo(() => makeSpeakers(count), [count])
  const g = gains(speakers, orb, mode)
  const lit = g.filter((v) => v > 0).length

  useWhileActive(
    section,
    () => {
      stage.orb = orb
      stage.soundMode = mode
      stage.speakerCount = count
    },
    [orb, mode, count],
  )

  const moveTo = (e: PointerEvent<SVGSVGElement>) => {
    const m = svg.current!.getScreenCTM()!.inverse()
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m)
    setOrb({ x: clamp01((pt.x - X0) / RW), y: clamp01((pt.y - Y0) / RD) })
  }
  const onKey = (e: KeyboardEvent) => {
    const step = 0.05
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
    if (!d) return
    e.preventDefault()
    setOrb((o) => ({ x: clamp01(o.x + d[0]), y: clamp01(o.y + d[1]) }))
  }

  const o = toSvg(orb)
  const status =
    mode === 'channels'
      ? `Mixed to the ${GROUP_NAME[nearestGroup(orb)]} channel: all ${lit} of its speakers play it.`
      : `Rendered to the ${lit} speakers nearest the sound, out of ${count}.`

  return (
    <section ref={section} data-shot="sound" className="scene grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]" aria-labelledby="sound-title">
      <div className="scrim">
        <h2 id="sound-title" className="display h-section max-w-[12ch]">
          Sound is built for the room too.
        </h2>
        <p className="body mt-5">
          Channel-based sound sends each track to a fixed channel, and a surround channel feeds a whole wall of speakers.
          Object-based sound stores where a sound is and lets the room&rsquo;s processor choose the nearest speakers.
          Move the sound and compare.
        </p>
        <p className="body">
          IMAX describes its sound only as proprietary loudspeakers and surround layouts
          <Ev k="filing" s="tenk" />; press reports of 12 channels for IMAX with Laser are unconfirmed by IMAX
          <Ev k="claim" s="whathifi" />. Dolby documents Atmos in cinemas as a 9.1 bed plus up to 118 objects, with up
          to 64 speaker feeds
          <Ev k="claim" s="atmos" />. Whether any IMAX theatre plays Atmos natively is unresolved.
        </p>
      </div>

      <div className="panel grid gap-5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-start">
        <svg
          ref={svg}
          viewBox="0 0 300 420"
          className="w-full touch-none cursor-crosshair"
          tabIndex={0}
          role="img"
          aria-label={`Top-down view of an auditorium. The sound is nearest the ${GROUP_NAME[nearestGroup(orb)]} speakers. Use arrow keys to move it. ${status}`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            moveTo(e)
          }}
          onPointerMove={(e) => e.buttons && moveTo(e)}
        >
          <rect x={X0} y={Y0} width={RW} height={RD} fill="none" stroke="var(--color-ash)" strokeOpacity={0.4} />
          <line x1={X0 + 20} y1={Y0 - 10} x2={X0 + RW - 20} y2={Y0 - 10} stroke="var(--color-screen)" strokeWidth={3} />
          {speakers.map((s, i) => {
            const p = toSvg(s)
            return <rect key={i} x={p.x - 5} y={p.y - 5} width={10} height={10} rx={2} fill={g[i] > 0 ? 'var(--color-lamp)' : '#3a312a'} fillOpacity={g[i] > 0 ? 0.35 + 0.65 * g[i] : 1} />
          })}
          {speakers.map((s, i) => {
            if (!g[i]) return null
            const p = toSvg(s)
            return <line key={i} x1={o.x} y1={o.y} x2={p.x} y2={p.y} stroke="var(--color-lamp)" strokeOpacity={0.25 + 0.5 * g[i]} />
          })}
          <circle cx={o.x} cy={o.y} r={11} fill="var(--color-screen)" />
          <circle cx={o.x} cy={o.y} r={20} fill="none" stroke="var(--color-screen)" strokeOpacity={0.3} />
        </svg>

        <div className="space-y-5">
          <Seg label="Format" options={['channels', 'objects'] as const} value={mode} onChange={setMode} format={(m) => (m === 'channels' ? 'Channels' : 'Objects')} />
          <Seg label="Speakers in the room" options={[16, 32, 64] as const} value={count as 16 | 32 | 64} onChange={setCount} />
          <div role="group" aria-label="Place the sound">
            <span className="control-label" aria-hidden="true">
              Place the sound (or drag it)
            </span>
            <div className="seg">
              {PRESETS.map((pr) => (
                <button key={pr.label} type="button" className="chip" onClick={() => setOrb(pr.p)}>
                  {pr.label}
                </button>
              ))}
            </div>
          </div>
          <p className="body" aria-live="polite">
            {status}
          </p>
          <p className="small">A simplified flat room: no height channels and no real panning law.</p>
        </div>
      </div>
    </section>
  )
}
