import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Ev } from '../components/Ev'
import { DCI_WHITE, GAMUTS, LOCUS, inGamut, paintLocus, visible, xyToDisplayRGB } from '../lib/colour'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useWhileActive } from '../lib/hooks'
import { STILL_H, STILL_W, drawStill, mutedCss, p3Canvas, p3Css, srgbCss } from '../lib/still'
import { stage } from '../scene/state'

type Key = keyof typeof GAMUTS
type XY = [number, number]

const SPACES: { key: Key; name: string; use: string; stroke: string; dash?: string }[] = [
  { key: 'rec709', name: 'Rec. 709', use: 'HD television and the sRGB web', stroke: 'var(--color-ash)', dash: '0.02 0.015' },
  { key: 'p3', name: 'DCI-P3', use: 'The cinema reference', stroke: 'var(--color-lamp)' },
  { key: 'rec2020', name: 'Rec. 2020', use: 'Ultra HD, wider still', stroke: 'var(--color-screen)' },
]

// What the viewer's own display reports, via the CSS color-gamut media query.
const SCREEN: { key: Key; label: string } = matchMedia('(color-gamut: rec2020)').matches
  ? { key: 'rec2020', label: 'Rec. 2020' }
  : matchMedia('(color-gamut: p3)').matches
    ? { key: 'p3', label: 'P3' }
    : { key: 'rec709', label: 'sRGB' }

// Chart maps x 0..0.8 and y 0..0.9 into a 420 × 440 box.
const W = 420
const H = 440
const px = (x: number) => 30 + (x / 0.8) * 360
const py = (y: number) => 420 - (y / 0.9) * 400
const unmap = (sx: number, sy: number): XY => [((sx - 30) / 360) * 0.8, ((420 - sy) / 400) * 0.9]
const path = (pts: XY[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${px(x).toFixed(1)} ${py(y).toFixed(1)}`).join(' ') + ' Z'

// Points on the locus, nudged 2% toward white so they count as visible.
const nudge = ([x, y]: XY): XY => [x + (DCI_WHITE[0] - x) * 0.02, y + (DCI_WHITE[1] - y) * 0.02]
const PRESETS: { label: string; xy: XY }[] = [
  { label: 'Cinema white', xy: DCI_WHITE },
  { label: 'Laser green, 532 nm', xy: nudge([0.17, 0.7962]) },
  { label: 'Deep red, 650 nm', xy: nudge([0.726, 0.274]) },
  { label: 'Cyan, 490 nm', xy: nudge([0.0454, 0.295]) },
]

/** Wipe between the same still in sRGB and in P3. Real on P3 screens, a labelled simulation elsewhere. */
function Compare() {
  const figure = useRef<HTMLElement>(null)
  const narrow = useRef<HTMLCanvasElement>(null)
  const wide = useRef<HTMLCanvasElement>(null)
  const [pos, setPos] = useState(50)
  const real = SCREEN.key !== 'rec709' && p3Canvas()

  useEffect(() => {
    drawStill(narrow.current!.getContext('2d')!, real ? srgbCss : mutedCss)
    drawStill(wide.current!.getContext('2d', real ? { colorSpace: 'display-p3' } : undefined)!, real ? p3Css : srgbCss)
  }, [real])

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: figure.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (stage.dimScreen = self.isActive),
    })
    return () => {
      st.kill()
      stage.dimScreen = false
    }
  }, [])

  return (
    <figure ref={figure}>
      <div className="relative aspect-[1.9] overflow-hidden rounded-[4px] bg-black">
        <canvas ref={wide} width={STILL_W} height={STILL_H} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <canvas
          ref={narrow}
          width={STILL_W}
          height={STILL_H}
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-screen" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-9 -translate-1/2 place-items-center rounded-full bg-screen text-black">↔</span>
        </div>
        <span className="small pointer-events-none absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-screen">
          Rec. 709 / sRGB
        </span>
        <span className="small pointer-events-none absolute top-3 right-3 rounded-full bg-black/70 px-3 py-1 text-lamp">
          P3
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(+e.target.value)}
          aria-label="Drag to compare the sRGB and P3 versions"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="small mt-3 max-w-[64ch]">
        {real ? (
          <>
            <strong className="text-screen">This difference is real on your screen.</strong> Your display reports{' '}
            {SCREEN.label}, so the right side uses colours the left side can&rsquo;t contain. Watch the reds and greens.
            P3 here is your display&rsquo;s version; cinema&rsquo;s DCI-P3 has the same primaries.
          </>
        ) : (
          <>
            <strong className="text-screen">Simulated.</strong> Your display reports sRGB, so it can&rsquo;t show the
            extra P3 colours; the left side is desaturated to suggest the gap. On a wide-gamut screen (most recent
            phones and Macs) this comparison is real.
          </>
        )}
      </figcaption>
    </figure>
  )
}

export default function Colour() {
  const section = useRef<HTMLElement>(null)
  // The cinema screen shows the chart here, on a 1.90 screen like most IMAX venues.
  useWhileActive(
    section,
    () => {
      stage.screenRatio = stage.frameRatio = 1.9
      stage.beams = 1
    },
    [],
  )
  const [on, setOn] = useState<Record<Key | 'screen', boolean>>({ rec709: false, p3: true, rec2020: true, screen: true })
  const [probe, setProbe] = useState<XY>(PRESETS[1].xy)

  // The horseshoe painted in (approximate) colour, once.
  const fill = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    paintLocus(c, ([x, y]) => [px(x), py(y)], unmap)
    return c.toDataURL()
  }, [])

  const toXY = (e: PointerEvent<SVGSVGElement>) => {
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(e.currentTarget.getScreenCTM()!.inverse())
    const [x, y] = unmap(pt.x, pt.y)
    setProbe([Math.min(0.8, Math.max(0, x)), Math.min(0.9, Math.max(0.001, y))])
  }
  const onKey = (e: KeyboardEvent) => {
    const d = { ArrowLeft: [-0.01, 0], ArrowRight: [0.01, 0], ArrowUp: [0, 0.01], ArrowDown: [0, -0.01] }[e.key]
    if (!d) return
    e.preventDefault()
    setProbe(([x, y]) => [x + d[0], Math.max(0.001, y + d[1])])
  }

  const seen = visible(probe)
  const [r, g, b] = xyToDisplayRGB(probe)
  const onYourScreen = inGamut(probe, GAMUTS[SCREEN.key])

  return (
    <section ref={section} data-shot="colour" aria-labelledby="colour-title">
      <header className="scene flex min-h-[110svh] items-end">
        <h2 id="colour-title" className="display h-section scrim max-w-[12ch]">
          The same scene, more colour.
        </h2>
      </header>
      <div className="scene grid items-center gap-12 lg:grid-cols-[1fr_1.6fr]">
      <div className="scrim">
        <p className="body">
          A projector mixes three primary colours, so it can only show the colours between them: its gamut. HD
          television and most of the web use Rec. 709, also called sRGB
          <Ev k="standard" s="bt709" />. Cinema&rsquo;s reference, DCI-P3, reaches further into reds and greens
          <Ev k="standard" s="st2113" />; Rec. 2020 goes further still
          <Ev k="standard" s="bt2020" />.
        </p>
        <p className="body">
          Laser projectors with pure red, green and blue light can approach Rec. 2020. One Christie projector claims
          more than 90% coverage on its datasheet and more than 95% on its product page
          <Ev k="claim" s="christieRgb" />. Whether any particular IMAX or Dolby auditorium covers Rec. 2020 wasn&rsquo;t
          verified.
        </p>
      </div>
      <Compare />
      </div>

      <details className="scene !pt-0">
        <summary className="chip inline-flex w-fit list-none">See it on the colour chart</summary>
        <p className="body mt-6">
          The horseshoe holds every colour of light the eye can see
          <Ev k="standard" s="cie" />; each triangle is a gamut. The dotted one is your own screen: your browser
          reports about <strong>{SCREEN.label}</strong>. Click anywhere on the chart to test a colour.
        </p>
      {/* Opaque so the chart on the 3D screen behind doesn't double up with this one. */}
      <div className="panel mt-6 grid max-w-5xl gap-6 md:grid-cols-[1.2fr_1fr] md:items-start" style={{ background: 'var(--color-velvet)' }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full cursor-crosshair touch-none"
          tabIndex={0}
          role="img"
          aria-label={`CIE 1931 chromaticity chart. Selected colour is ${seen ? 'visible' : 'not a visible colour'}; use arrow keys to move it.`}
          onKeyDown={onKey}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            toXY(e)
          }}
          onPointerMove={(e) => e.buttons && toXY(e)}
        >
          <image href={fill} width={W} height={H} opacity={0.9} />
          <path d={path(LOCUS)} fill="none" stroke="var(--color-ash)" strokeOpacity={0.7} />
          {SPACES.map(
            (s) =>
              on[s.key] && (
                <path key={s.key} className={s.dash ? 'fade-in' : 'draw'} pathLength={1} d={path(GAMUTS[s.key])} fill="none" stroke={s.stroke} strokeWidth={2.5} strokeLinejoin="round" style={s.dash ? { strokeDasharray: s.dash } : undefined} />
              ),
          )}
          {on.screen && (
            <path className="fade-in" pathLength={1} d={path(GAMUTS[SCREEN.key])} fill="none" stroke="#000" strokeWidth={2} strokeDasharray="0.006 0.012" strokeLinecap="round" />
          )}
          <circle cx={px(DCI_WHITE[0])} cy={py(DCI_WHITE[1])} r={3} fill="#000" />
          {[
            [0.0743, 0.8338, '520 nm', -10, 'middle'],
            [0.7347, 0.2653, '700 nm', 14, 'start'],
            [0.1741, 0.005, '380 nm', 16, 'middle'],
          ].map(([x, y, t, dy, anchor]) => (
            <text key={t as string} x={px(x as number) + (anchor === 'start' ? 4 : 0)} y={py(y as number) + (dy as number)} fill="var(--color-ash)" fontSize={11} textAnchor={anchor as 'middle' | 'start'}>
              {t}
            </text>
          ))}
          <g transform={`translate(${px(probe[0])} ${py(probe[1])})`} pointerEvents="none">
            <circle r={9} fill={`rgb(${r} ${g} ${b})`} stroke="#000" strokeWidth={2} />
            <circle r={12} fill="none" stroke="var(--color-screen)" strokeWidth={1.5} />
          </g>
        </svg>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Triangles">
            {SPACES.map((s) => (
              <button key={s.key} type="button" className="chip" aria-pressed={on[s.key]} onClick={() => setOn((o) => ({ ...o, [s.key]: !o[s.key] }))}>
                {s.name}
                <span className="sr-only">, {s.use}</span>
              </button>
            ))}
            <button type="button" className="chip" aria-pressed={on.screen} onClick={() => setOn((o) => ({ ...o, screen: !o.screen }))}>
              Your screen
            </button>
          </div>
          <div role="group" aria-label="Test a colour">
            <span className="control-label" aria-hidden="true">
              Test a colour (or click the chart)
            </span>
            <div className="seg">
              {PRESETS.map((p) => (
                <button key={p.label} type="button" className="chip" onClick={() => setProbe(p.xy)}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div aria-live="polite">
            {seen ? (
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
                {[...SPACES.map((s) => [s.name, inGamut(probe, GAMUTS[s.key])] as const), ['Your screen', onYourScreen] as const].map(
                  ([name, ok]) => (
                    <div key={name} className="contents">
                      <dt className="small">{name}</dt>
                      <dd className={ok ? 'font-bold text-screen' : 'text-ash'}>{ok ? 'Can show it' : 'Can’t reach it'}</dd>
                    </div>
                  ),
                )}
              </dl>
            ) : (
              <p className="body">Outside the horseshoe: no light of any mix looks like this. It isn&rsquo;t a colour.</p>
            )}
            {seen && !onYourScreen && (
              <p className="small mt-3">Your screen can&rsquo;t show this one, so the dot is the nearest colour it can.</p>
            )}
          </div>
          <p className="small">
            Chart colours are approximate: outside your screen&rsquo;s range they show as the nearest it can.
          </p>
        </div>
      </div>
      </details>
    </section>
  )
}
