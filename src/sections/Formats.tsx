import type { ReactNode } from 'react'
import { Ev } from '../components/Ev'
import { stage } from '../scene/state'

type Row = { name: string; screen?: { ratio: number; beams: number }; cells: ReactNode[] }

const COLS = ['Image from', 'Widest frame', 'Light, as stated', 'Sound', 'Keep in mind']

const ROWS: Row[] = [
  {
    name: 'IMAX 15/70 film',
    screen: { ratio: 1.43, beams: 1 },
    cells: [
      <>65mm negative, 70mm print<Ev k="independent" s="wikipedia" /></>,
      <>1.43:1<Ev k="independent" s="engadget" /></>,
      <>No published figure</>,
      <>IMAX proprietary<Ev k="filing" s="tenk" /></>,
      <>52 film systems worldwide<Ev k="filing" s="tenk" />. Grain and print wear vary.</>,
    ],
  },
  {
    name: 'IMAX with Laser, two projectors',
    screen: { ratio: 1.43, beams: 2 },
    cells: [
      <>Two 4K laser projectors<Ev k="independent" s="engadget" /></>,
      <>1.43:1 on suitably tall screens<Ev k="independent" s="engadget" /></>,
      <>IMAX said &ldquo;about 22 fL&rdquo; in a 2018 interview<Ev k="claim" s="displaydaily2018" /></>,
      <>Proprietary; 12 channels reported<Ev k="claim" s="whathifi" /></>,
      <>Number of screens unresolved</>,
    ],
  },
  {
    name: 'IMAX with Laser, one projector',
    screen: { ratio: 1.9, beams: 1 },
    cells: [
      <>One 4K laser projector<Ev k="independent" s="engadget" /></>,
      <>1.90:1<Ev k="independent" s="engadget" /></>,
      <>No published figure</>,
      <>IMAX proprietary<Ev k="filing" s="tenk" /></>,
      <>1.43 scenes are trimmed to 1.90. Auditorium sizes vary.</>,
    ],
  },
  {
    name: 'IMAX digital, xenon',
    screen: { ratio: 1.9, beams: 2 },
    cells: [
      <>Two 2K xenon projectors<Ev k="independent" s="engadget" /></>,
      <>1.90:1<Ev k="independent" s="wikipedia" /></>,
      <>No published figure</>,
      <>About 6 channels on legacy systems<Ev k="independent" s="wikipedia" /></>,
      <>No longer offered for new signings; 1,089 still installed<Ev k="filing" s="tenk" /></>,
    ],
  },
  {
    name: 'Dolby Cinema',
    cells: [
      <>Two 4K laser projection heads<Ev k="claim" s="christie" /></>,
      <>Cannot show 1.43<Ev k="independent" s="engadget" /></>,
      <>Dolby says up to 31 fL in 2D, on a unity-gain screen<Ev k="claim" s="christie" /></>,
      <>Dolby Atmos<Ev k="claim" s="atmos" /></>,
      <>Screen size varies by venue</>,
    ],
  },
  {
    name: 'Standard digital',
    cells: [
      <>2K or 4K DCI projector<Ev k="standard" s="dci" /></>,
      <>Whatever the screen allows</>,
      <>14 fL nominal, ±3 fL tolerance<Ev k="standard" s="st4311" /></>,
      <>Varies by room</>,
      <>Lamp age and dirty optics lower real brightness<Ev k="standard" s="st4311" /></>,
    ],
  },
]

export default function Formats() {
  return (
    <section data-shot="formats" className="scene" aria-labelledby="formats-title">
      <div className="scrim">
        <h2 id="formats-title" className="display h-section max-w-[16ch]">
          Six systems behind the big names.
        </h2>
        <p className="body mt-5">
          No single format wins on every line, and the brightness figures are each company&rsquo;s own statement,
          measured on different bases. No independent side-by-side measurement was found. Point at a row to see its
          screen shape.
        </p>
      </div>
      <div className="mt-10 overflow-x-auto rounded-[4px] bg-black/70 px-4 sm:px-6">
        <table className="formats">
          <caption className="sr-only">Comparison of six cinema projection systems</caption>
          <thead>
            <tr>
              <th scope="col">System</th>
              {COLS.map((c) => (
                <th key={c} scope="col">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const show = () => {
                if (!r.screen) return
                stage.screenRatio = stage.frameRatio = r.screen.ratio
                stage.beams = r.screen.beams
              }
              return (
                <tr key={r.name} onPointerEnter={show} onFocus={show}>
                  <th scope="row">{r.name}</th>
                  {r.cells.map((c, i) => (
                    <td key={i} data-label={COLS[i]}>
                      {c}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
