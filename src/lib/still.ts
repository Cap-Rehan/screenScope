// A laser-show still over a cinema audience, drawn in code so its colours are exact P3 values.
// The same drawing is rendered in different colour ranges by passing a different `css` colour function.
import { p3ToSrgb } from './colour'

export type RGB = [number, number, number]
export type CssColour = (c: RGB, alpha: number) => string

export const STILL_W = 1140
export const STILL_H = 600

// Saturated P3 colours; most sit outside sRGB, which is the point.
const BEAMS: RGB[] = [
  [1, 0, 0.05],
  [1, 0.45, 0],
  [0.55, 1, 0],
  [0, 1, 0.15],
  [0, 0.95, 1],
  [0.15, 0.2, 1],
  [1, 0, 0.75],
]

/** Full P3, for wide-gamut canvases. */
export const p3Css: CssColour = (c, a) => `color(display-p3 ${c.map((v) => v.toFixed(3)).join(' ')} / ${a})`
/** The same colours squeezed into sRGB (clipped), as a Rec. 709 / sRGB system shows them. */
export const srgbCss: CssColour = (c, a) => `rgb(${p3ToSrgb(c).map((v) => Math.round(v * 255)).join(' ')} / ${a})`
/** For screens that can't show P3: desaturate to suggest the narrower range. */
export const mutedCss: CssColour = (c, a) => {
  const grey = 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2]
  return srgbCss(c.map((v) => grey + (v - grey) * 0.4) as RGB, a)
}

export function drawStill(ctx: CanvasRenderingContext2D, css: CssColour) {
  const w = STILL_W
  const h = STILL_H
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)

  const haze = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, h * 1.2)
  haze.addColorStop(0, css([0.45, 0.05, 0.4], 0.35))
  haze.addColorStop(1, css([0, 0, 0], 0))
  ctx.fillStyle = haze
  ctx.fillRect(0, 0, w, h)

  // Beams from two lasers on the stage, fanning upward and crossing.
  ctx.globalCompositeOperation = 'lighter'
  for (const [ox, dir] of [
    [w * 0.36, 1],
    [w * 0.64, -1],
  ]) {
    const oy = h * 0.78
    BEAMS.forEach((c, i) => {
      const a = (-Math.PI / 2) + dir * (-0.75 + (i / (BEAMS.length - 1)) * 1.5) * 0.9
      const len = h * 1.6
      const ex = ox + Math.cos(a) * len
      const ey = oy + Math.sin(a) * len
      const grad = ctx.createLinearGradient(ox, oy, ex, ey)
      grad.addColorStop(0, css(c, 0.95))
      grad.addColorStop(0.55, css(c, 0.35))
      grad.addColorStop(1, css(c, 0))
      // Soft wedge, then a bright core line.
      const spread = 0.022
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(ox + Math.cos(a - spread) * len, oy + Math.sin(a - spread) * len)
      ctx.lineTo(ox + Math.cos(a + spread) * len, oy + Math.sin(a + spread) * len)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = grad
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(ox, oy)
      ctx.lineTo(ex, ey)
      ctx.stroke()
    })
    const glow = ctx.createRadialGradient(ox, oy, 0, ox, oy, 60)
    glow.addColorStop(0, css([1, 1, 1], 0.9))
    glow.addColorStop(0.2, css(BEAMS[0], 0.6))
    glow.addColorStop(1, css([0, 0, 0], 0))
    ctx.fillStyle = glow
    ctx.fillRect(ox - 60, oy - 60, 120, 120)
  }

  // Audience silhouettes in front.
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = '#000'
  for (let row = 0; row < 2; row++) {
    const y = h * (0.9 + row * 0.07)
    for (let x = -20 + row * 34; x < w + 40; x += 68) {
      const r = 22 + row * 4 + ((x * 7) % 5)
      ctx.beginPath()
      ctx.ellipse(x, y - r * 0.9, r * 0.75, r, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillRect(x - r * 1.6, y, r * 3.2, h)
    }
  }
}

/** True when the browser can paint a canvas in Display P3 (Chrome, Safari; not Firefox yet). */
export function p3Canvas(): boolean {
  const ctx = document.createElement('canvas').getContext('2d', { colorSpace: 'display-p3' })
  return ctx?.getContextAttributes().colorSpace === 'display-p3'
}
