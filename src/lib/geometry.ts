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

// Illustrative film MTF: m(f) = exp(-(f/F0)^K). Not measured data for any stock;
// F0 is chosen so 10% contrast lands near 80 lp/mm, a plausible order of magnitude.
const F0 = 45.9
const K = 1.5

export function mtf(lpPerMm: number): number {
  return Math.exp(-((lpPerMm / F0) ** K))
}

/** Spatial frequency (lp/mm) at which the illustrative curve falls to `contrast`. */
export function cutoffFrequency(contrast: number): number {
  return F0 * (-Math.log(contrast)) ** (1 / K)
}

/** "K" figure a cutoff implies across a frame `widthMm` wide: 2 pixels per line pair, in thousands. */
export function impliedK(contrast: number, widthMm: number): number {
  return (2 * cutoffFrequency(contrast) * widthMm) / 1000
}
