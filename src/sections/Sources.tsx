import { EvIcon } from '../components/Ev'
import { KIND_LABEL, SOURCES, type Kind } from '../content/sources'

const UNVERIFIED = [
  'How many screens can show the full 1.43:1 frame. Third-party counts (about 41 film plus about 20 dual-laser) don’t reconcile with the 52 film systems in IMAX’s filing.',
  'IMAX sound channel counts, and whether any IMAX theatre plays Dolby Atmos natively.',
  'Independent measurements of IMAX or Dolby brightness and contrast in real auditoriums. The figures shown are company statements.',
  'Any fixed pixel equivalent for 15/70 film. "16K" and similar figures are not measurements.',
  'How 2.39 and 1.85 releases are handled on each IMAX system. The frame demo shows geometry only.',
]

export default function Sources() {
  return (
    <section id="sources" data-shot="sources" className="scene bg-black/80" aria-labelledby="sources-title">
      <h2 id="sources-title" className="display h-section">
        Sources and caveats
      </h2>
      <p className="body mt-5">
        Every figure on this page carries a mark showing where it comes from. Follow a mark to its source here. The
        research behind the page is in the project&rsquo;s <code>reports/</code> folder.
      </p>

      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
          <li key={k} className="flex items-center gap-2 text-ash">
            <EvIcon kind={k} />
            <span className="text-screen">{KIND_LABEL[k]}</span>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <ol className="space-y-4">
          {Object.entries(SOURCES).map(([id, s]) => (
            <li key={id} id={`src-${id}`} className="scroll-mt-24 target:text-lamp">
              <a href={s.url} className="underline decoration-ash/50 underline-offset-4 hover:decoration-lamp" target="_blank" rel="noreferrer">
                {s.title}
              </a>
              {'note' in s && <span className="small block">{s.note}</span>}
            </li>
          ))}
        </ol>
        <div>
          <h3 className="display h-sub">What we couldn&rsquo;t verify</h3>
          <ul className="mt-4 list-disc space-y-3 pl-5">
            {UNVERIFIED.map((u) => (
              <li key={u} className="body">
                {u}
              </li>
            ))}
          </ul>
          <p className="small mt-10">
            Typefaces: Big Shoulders Display and Atkinson Hyperlegible Next, both under the SIL Open Font License. IMAX,
            Dolby Cinema and Dolby Atmos are trademarks of their owners. ScreenScope is independent and not affiliated
            with either company.
          </p>
        </div>
      </div>
    </section>
  )
}
