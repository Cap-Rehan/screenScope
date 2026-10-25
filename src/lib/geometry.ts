// Pure maths behind the demos. Every number the page computes comes from here.

/** The tall master frame every demo crops from. */
export const MASTER_RATIO = 1.43

/** Extra picture area of `taller` over `wider` at the same width (0.258 = 25.8% more). */
export function extraArea(wider: number, taller: number): number {
  return wider / taller - 1
}

/** Share of the 1.43 master that survives when it is cut to `frame` (centre crop). */
export function masterShown(frame: number): number {
  return frame >= MASTER_RATIO ? MASTER_RATIO / frame : 1
}

export type Fit = {
  /** Image size as a fraction of screen width and height. */
  w: number
  h: number
  /** 'letterbox' = bars top and bottom, 'pillarbox' = bars at the sides. */
  bars: 'none' | 'letterbox' | 'pillarbox'
}

/** Fit an image of ratio `frame` inside a screen of ratio `screen` without cropping. */
export function fitFrame(frame: number, screen: number): Fit {
  if (Math.abs(frame - screen) < 1e-6) return { w: 1, h: 1, bars: 'none' }
  if (frame > screen) return { w: 1, h: screen / frame, bars: 'letterbox' }
  return { w: frame / screen, h: 1, bars: 'pillarbox' }
}

/** Horizontal angle the screen fills, seen from the centre line at `distance` screen widths. */
export function viewAngleDeg(distance: number): number {
  return (2 * Math.atan(0.5 / distance) * 180) / Math.PI
}

/** Average pixels per degree across the screen for a projector `pixelsAcross` wide. */
export function pixelsPerDegree(pixelsAcross: number, distance: number): number {
  return pixelsAcross / viewAngleDeg(distance)
}

// Kodak VISION3 500T 5219 modulation transfer, read off the curves in Kodak's technical brochure
// (digitised from the published chart; the same emulsion is sold in 65 mm). Response 1 = 100%.
// Kodak's chart stops at 80 cycles/mm, so nothing finer is known from this source.
export const MTF_FREQS = [2.5, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80]
export const KODAK_MTF = {
  red: [1.04, 1.02, 0.98, 1.0, 0.89, 0.78, 0.68, 0.47, 0.34, 0.27, 0.22, 0.19],
  green: [1.0, 1.05, 1.09, 1.09, 1.04, 0.97, 0.88, 0.68, 0.55, 0.47, 0.41, 0.37],
  blue: [0.98, 0.98, 1.06, 1.13, 1.09, 1.02, 0.94, 0.8, 0.68, 0.55, 0.46, 0.4],
}
export type Layer = keyof typeof KODAK_MTF

/** Response at `f` cycles/mm, interpolated on a log frequency axis like Kodak's chart. */
export function mtf(layer: Layer, f: number): number {
  const r = KODAK_MTF[layer]
  const i = Math.min(Math.max(MTF_FREQS.findIndex((x) => x >= f), 1), MTF_FREQS.length - 1)
  const k = (Math.log(f) - Math.log(MTF_FREQS[i - 1])) / (Math.log(MTF_FREQS[i]) - Math.log(MTF_FREQS[i - 1]))
  return r[i - 1] + (r[i] - r[i - 1]) * k
}

/**
 * Finest detail (cycles/mm) still rendered at `contrast` or better, past the curve's peak.
 * null when the layer is still above `contrast` where Kodak's chart ends.
 */
export function cutoffFrequency(layer: Layer, contrast: number): number | null {
  const r = KODAK_MTF[layer]
  for (let i = 1; i < r.length; i++) {
    if (r[i] < contrast && r[i - 1] >= contrast) {
      const k = (r[i - 1] - contrast) / (r[i - 1] - r[i])
      return Math.exp(Math.log(MTF_FREQS[i - 1]) + k * (Math.log(MTF_FREQS[i]) - Math.log(MTF_FREQS[i - 1])))
    }
  }
  return null
}

/** "K" figure for `cyclesPerMm` across a frame `widthMm` wide: 2 pixels per cycle, in thousands. */
export function impliedK(cyclesPerMm: number, widthMm: number): number {
  return (2 * cyclesPerMm * widthMm) / 1000
}
