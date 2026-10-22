import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Ev } from '../components/Ev'
import { Seg, ScreenSlot, pct, ratio, useEnv } from '../components/ui'
import { extraArea, fitFrame, masterShown } from '../lib/geometry'
import { useWhileActive } from '../lib/hooks'
import { stage } from '../scene/state'

const RATIOS = [2.39, 1.9, 1.43] as const
type R = (typeof RATIOS)[number]

const STEPS: { frame: R; screen: R; text: ReactNode }[] = [
  {
    frame: 2.39,
    screen: 2.39,
    text: (
      <>
        <strong>2.39:1</strong> is the wide &ldquo;scope&rdquo; shape many films use. Cut from our tall frame, it loses
        the rocket&rsquo;s nose and the ground under the pad.
      </>
    ),
  },
  {
    frame: 1.9,
    screen: 1.9,
    text: (
      <>
        <strong>1.90:1</strong> is the shape of most IMAX screens
        <Ev k="independent" s="wikipedia" />. At the same width it holds {pct(extraArea(2.39, 1.9))} more picture than
        2.39
        <Ev k="estimate" />, which matches IMAX&rsquo;s own &ldquo;up to 26% more image&rdquo;
        <Ev k="claim" s="tenk" />.
      </>
    ),
  },
  {
    frame: 1.43,
    screen: 1.43,
    text: (
      <>
        <strong>1.43:1</strong> is the full IMAX frame, with {pct(extraArea(2.39, 1.43))} more picture than 2.39
        <Ev k="estimate" />. IMAX says it is shown only in select locations
        <Ev k="filing" s="tenk" />.
      </>
    ),
  },
  {
    frame: 2.39,
    screen: 1.43,
    text: (
      <>
        Now a <strong>2.39 film on a 1.43 screen</strong>. Nothing is cut, but {pct(1 - fitFrame(2.39, 1.43).h)} of the
        screen stays dark. A taller screen only pays off when the film was framed for it.
      </>
    ),
  },
]

function describe(frame: number, screen: number): ReactNode {
  const fit = fitFrame(frame, screen)
  if (fit.bars === 'none') return <>Frame and screen match: the picture fills the screen edge to edge.</>
  if (fit.bars === 'letterbox')
    return <>The frame is wider than the screen, so it is letterboxed: dark bands above and below.</>
  return (
    <>
      The frame is taller than the screen, so here it shrinks with dark bands at the sides. In practice, a theatre whose
      system tops out at 1.90 shows a 1.90 version instead: the extra height is cut, not shrunk
      <Ev k="independent" s="engadget" />.
    </>
  )
}

export default function Frame() {
  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const { still } = useEnv()
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  const [manual, setManual] = useState<{ frame: R; screen: R } | null>(null)
  const frame = manual?.frame ?? STEPS[step].frame
  const screen = manual?.screen ?? STEPS[step].screen

  // Scrolling through the section walks the four steps; touching a control takes over until you scroll to a new step.
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: track.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const next = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))
        if (next === stepRef.current) return
        stepRef.current = next
        setStep(next)
        setManual(null)
      },
    })
    return () => st.kill()
  }, [])

  useWhileActive(
    section,
    () => {
      stage.frameRatio = frame
      stage.screenRatio = screen
      stage.beams = 1
    },
    [frame, screen],
  )

  const fit = fitFrame(frame, screen)
  const credit = still.local ? (
    'Your own still, from public/stills. It stays out of the repository.'
  ) : (
    <>
      Artemis I launch, 16 Nov 2022. Photo: NASA/Joel Kowsky, public domain
      <Ev k="independent" s="nasa" />. One tall photo, cut down the way a narrower screen cuts it. This is geometry,
      not any film&rsquo;s actual extraction.
    </>
  )

  return (
    <section ref={section} data-shot="frame" aria-labelledby="frame-title">
      <header className="intro scrim">
        <h2 id="frame-title" className="display h-section">
          Width is a choice. So is height.
        </h2>
        <p className="body mt-5">
          Aspect ratio is width divided by height: 2.39 is a wide strip, 1.43 is almost square. When a film&rsquo;s
          frame and a screen&rsquo;s shape disagree, something gives: black bars, or a cropped picture. Screens here
          keep the same width, so taller means more picture. Keep scrolling to step through four cases, or pick your own.
        </p>
        <p className="small mobile-only mt-4">{credit}</p>
      </header>
      <div ref={track} style={{ height: '400svh' }}>
        <div className="sticky">
        <div className="copy-col scrim">
          <p className="body min-h-[6.5em]" aria-live="polite">
            {manual ? describe(frame, screen) : STEPS[step].text}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
            <Seg label="Film framed for" options={RATIOS} value={frame} onChange={(f) => setManual({ frame: f, screen })} format={ratio} />
            <Seg label="Screen shape" options={RATIOS} value={screen} onChange={(s) => setManual({ frame, screen: s })} format={ratio} />
          </div>
          <dl className="readout mt-6">
            <dt>
              of the full 1.43 frame survives
              <Ev k="estimate" />
            </dt>
            <dd className="figure">{pct(masterShown(frame))}</dd>
            <dt>of the screen is lit</dt>
            <dd className="figure">{pct(fit.w * fit.h)}</dd>
          </dl>
        </div>
        <ScreenSlot
          screen={screen}
          frame={frame}
          caption={credit}
          alt={`A rocket launch at night shown at ${ratio(frame)} on a ${ratio(screen)} screen. ${pct(masterShown(frame))} of the full frame is visible.`}
        />
      </div>
      </div>
    </section>
  )
}
