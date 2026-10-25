import { useEffect, useMemo, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Ev } from '../components/Ev'
import { Seg } from '../components/ui'
import { LISTENER, startEngine, type Engine } from '../lib/audio'
import { useWhileActive } from '../lib/hooks'
import { gains, makeSpeakers, nearestGroup, type Group, type Mode, type Point } from '../lib/sound'
import { stage } from '../scene/state'

const FLY_SECONDS = 7
/** One lap of the room: past the screen, down the right wall, behind you, up the left. */
const flyPath = (t: number): Point => ({ x: 0.5 + 0.42 * Math.sin(2 * Math.PI * t), y: 0.5 - 0.46 * Math.cos(2 * Math.PI * t) })

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
  const [playing, setPlaying] = useState(false)
  const [flying, setFlying] = useState(false)
  const [trail, setTrail] = useState<Point[]>([])
  const engine = useRef<Engine | null>(null)

  const stop = () => {
    engine.current?.stop()
    engine.current = null
    stage.level = 1
    svg.current?.style.removeProperty('--level')
    setPlaying(false)
    setFlying(false)
  }
  const play = () => {
    engine.current = startEngine(speakers)
    engine.current.update(orb, mode)
    setPlaying(true)
  }

  // Keep the audio in step with the plan.
  useEffect(() => engine.current?.setLayout(speakers), [speakers])
  useEffect(() => engine.current?.update(orb, mode), [orb, mode, speakers])

  // Live level drives the pulse in the plan (CSS variable) and in the 3D room.
  useEffect(() => {
    if (!playing) return
    let raf = 0
    const tick = () => {
      const level = engine.current?.level() ?? 1
      stage.level = level
      svg.current?.style.setProperty('--level', level.toFixed(3))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing])

  // Fly-by: move the sound around the room, leaving a short trail.
  useEffect(() => {
    if (!flying) return setTrail([])
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = flyPath(((now - t0) / 1000 / FLY_SECONDS) % 1)
      setOrb(p)
      setTrail((tr) => [...tr.slice(-24), p])
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [flying])

  // Silence when the section scrolls away or the page unmounts.
  useEffect(() => {
    const st = ScrollTrigger.create({ trigger: section.current, start: 'top bottom', end: 'bottom top', onLeave: stop, onLeaveBack: stop })
    return () => {
      st.kill()
      stop()
    }
  }, [])

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
    setFlying(false)
    const m = svg.current!.getScreenCTM()!.inverse()
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m)
    setOrb({ x: clamp01((pt.x - X0) / RW), y: clamp01((pt.y - Y0) / RD) })
  }
  const onKey = (e: KeyboardEvent) => {
    const step = 0.05
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
    if (!d) return
    e.preventDefault()
    setFlying(false)
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
          The picture belongs to the screen; sound fills the room. Channel-based sound sends each track to a fixed
          channel, and a surround channel feeds a whole wall of speakers. Object-based sound stores where a sound is,
          and the room&rsquo;s processor picks the speakers nearest to it.
        </p>
        <p className="body">
          Put on headphones and press play. Your browser places a virtual speaker around your head for every square in
          the plan, then plays a rotor sound through them. Switch between channels and objects: on a wall channel the
          sound smears along the whole side; as an object it stays a point.
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
          {playing &&
            speakers.map((s, i) => {
              if (!g[i]) return null
              const p = toSvg(s)
              return [0, 0.6].map((delay) => (
                <circle key={`${i}-${delay}`} className="ripple" cx={p.x} cy={p.y} r={8} fill="none" stroke="var(--color-lamp)" strokeOpacity={0.3 + 0.5 * g[i]} style={{ animationDelay: `${delay}s` }} />
              ))
            })}
          {speakers.map((s, i) => {
            const p = toSvg(s)
            return (
              <rect
                key={i}
                x={p.x - 5}
                y={p.y - 5}
                width={10}
                height={10}
                rx={2}
                fill={g[i] > 0 ? 'var(--color-lamp)' : '#3a312a'}
                style={g[i] > 0 ? { opacity: `calc(${0.35 + 0.65 * g[i]} * (0.45 + 0.55 * var(--level, 1)))` } : undefined}
              />
            )
          })}
          {(() => {
            const you = toSvg(LISTENER)
            return (
              <g>
                <path d={`M${you.x} ${you.y - 13} l-5 7 h10 z`} fill="var(--color-ash)" />
                <circle cx={you.x} cy={you.y} r={6} fill="none" stroke="var(--color-ash)" strokeWidth={1.5} />
                <text x={you.x + 11} y={you.y + 4} fill="var(--color-ash)" fontSize={11}>
                  you
                </text>
              </g>
            )
          })()}
          {trail.length > 1 && (
            <polyline points={trail.map((p) => `${toSvg(p).x},${toSvg(p).y}`).join(' ')} fill="none" stroke="var(--color-screen)" strokeOpacity={0.35} strokeWidth={3} strokeLinecap="round" />
          )}
          {speakers.map((s, i) => {
            if (!g[i]) return null
            const p = toSvg(s)
            return <line key={i} x1={o.x} y1={o.y} x2={p.x} y2={p.y} stroke="var(--color-lamp)" strokeOpacity={0.25 + 0.5 * g[i]} />
          })}
          <circle cx={o.x} cy={o.y} r={11} fill="var(--color-screen)" />
          <circle cx={o.x} cy={o.y} r={20} fill="none" stroke="var(--color-screen)" strokeOpacity={0.3} className="orb-halo" />
        </svg>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="cta !text-xl" aria-pressed={playing} onClick={playing ? stop : play}>
              {playing ? 'Stop sound' : 'Play sound'}
            </button>
            <button type="button" className="chip" aria-pressed={flying} onClick={() => setFlying((f) => !f)}>
              {flying ? 'Stop fly-by' : 'Fly it around the room'}
            </button>
          </div>
          <p className="small">Headphones recommended. Volume starts low.</p>
          <Seg label="Format" options={['channels', 'objects'] as const} value={mode} onChange={setMode} format={(m) => (m === 'channels' ? 'Channels' : 'Objects')} />
          <Seg label="Speakers in the room" options={[16, 32, 64] as const} value={count as 16 | 32 | 64} onChange={setCount} />
          <div role="group" aria-label="Place the sound">
            <span className="control-label" aria-hidden="true">
              Place the sound (or drag it)
            </span>
            <div className="seg">
              {PRESETS.map((pr) => (
                <button
                  key={pr.label}
                  type="button"
                  className="chip"
                  onClick={() => {
                    setFlying(false)
                    setOrb(pr.p)
                  }}
                >
                  {pr.label}
                </button>
              ))}
            </div>
          </div>
          <p className="body" aria-live="polite">
            {status}
          </p>
          <p className="small">
            Not IMAX or Dolby audio: those mixes aren&rsquo;t published, and laptop speakers can&rsquo;t reproduce cinema
            bass. A simplified flat room with no height speakers, showing the idea of channels versus objects.
          </p>
        </div>
      </div>
    </section>
  )
}
