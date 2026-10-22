import { createContext, useContext, type ReactNode } from 'react'
import { fitFrame } from '../lib/geometry'

export type Env = { webgl: boolean; reduced: boolean; still: { src: string; local: boolean } }
export const EnvContext = createContext<Env>({ webgl: true, reduced: false, still: { src: '', local: false } })
export const useEnv = () => useContext(EnvContext)

/** Segmented control: a row of pressable chips. */
export function Seg<T extends string | number>({
  label,
  options,
  value,
  onChange,
  format = String,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (v: T) => void
  format?: (v: T) => ReactNode
}) {
  return (
    <div role="group" aria-label={label}>
      <span className="control-label" aria-hidden="true">
        {label}
      </span>
      <div className="seg">
        {options.map((o) => (
          <button key={o} type="button" className="chip" aria-pressed={o === value} onClick={() => onChange(o)}>
            {format(o)}
          </button>
        ))}
      </div>
    </div>
  )
}

export const ratio = (r: number) => `${r.toFixed(2)}:1`
export const pct = (x: number) => `${Math.round(x * 100)}%`

/**
 * Where the 3D screen appears. When WebGL is missing, an HTML screen with the same geometry stands in.
 * The image's alt text is always present for screen readers.
 */
export function ScreenSlot({ screen, frame, alt, caption }: { screen: number; frame: number; alt: string; caption?: ReactNode }) {
  const { webgl, still } = useEnv()
  const fit = fitFrame(frame, screen)
  if (webgl) {
    return (
      <div className="screen-slot">
        {/* the 3D screen is drawn behind this space */}
        <div role="img" aria-label={alt} className="absolute inset-0" />
        {caption && <p className="slot-caption small">{caption}</p>}
      </div>
    )
  }
  return (
    <div className="screen-slot">
      <div className="preview" style={{ ['--ratio' as string]: screen }}>
        <img
          src={still.src}
          alt={alt}
          style={{ width: `${fit.w * 100}%`, height: `${fit.h * 100}%`, aspectRatio: frame }}
        />
      </div>
      {caption && <p className="slot-caption small">{caption}</p>}
    </div>
  )
}
