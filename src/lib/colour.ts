// CIE 1931 xy chromaticity data for the gamut chart.

type XY = [number, number]

/** Spectral locus, 380–700 nm every 5 nm, from the CIE 1931 2° colour matching functions (CVRL). */
export const LOCUS: XY[] = [
  [0.1741, 0.005], [0.174, 0.005], [0.1738, 0.0049], [0.1736, 0.0049], [0.1733, 0.0048], [0.173, 0.0048],
  [0.1726, 0.0048], [0.1721, 0.0048], [0.1714, 0.0051], [0.1703, 0.0058], [0.1689, 0.0069], [0.1669, 0.0086],
  [0.1644, 0.0109], [0.1611, 0.0138], [0.1566, 0.0177], [0.151, 0.0227], [0.144, 0.0297], [0.1355, 0.0399],
  [0.1241, 0.0578], [0.1096, 0.0868], [0.0913, 0.1327], [0.0687, 0.2007], [0.0454, 0.295], [0.0235, 0.4127],
  [0.0082, 0.5384], [0.0039, 0.6548], [0.0139, 0.7502], [0.0389, 0.812], [0.0743, 0.8338], [0.1142, 0.8262],
  [0.1547, 0.8059], [0.1929, 0.7816], [0.2296, 0.7543], [0.2658, 0.7243], [0.3016, 0.6923], [0.3374, 0.6588],
  [0.3731, 0.6245], [0.4087, 0.5896], [0.4441, 0.5547], [0.4788, 0.5202], [0.5125, 0.4866], [0.5448, 0.4544],
  [0.5752, 0.4242], [0.6029, 0.3965], [0.627, 0.3725], [0.6482, 0.3514], [0.6658, 0.334], [0.6801, 0.3197],
  [0.6915, 0.3083], [0.7006, 0.2993], [0.7079, 0.292], [0.714, 0.2859], [0.719, 0.2809], [0.723, 0.2769],
  [0.726, 0.274], [0.7283, 0.2717], [0.73, 0.27], [0.7311, 0.2689], [0.732, 0.268], [0.7327, 0.2673],
  [0.7334, 0.2666], [0.734, 0.266], [0.7344, 0.2656], [0.7346, 0.2654], [0.7347, 0.2653],
]

/** R, G, B primaries. */
export const GAMUTS = {
  rec709: [[0.64, 0.33], [0.3, 0.6], [0.15, 0.06]] as XY[],
  p3: [[0.68, 0.32], [0.265, 0.69], [0.15, 0.06]] as XY[],
  rec2020: [[0.708, 0.292], [0.17, 0.797], [0.131, 0.046]] as XY[],
}

/** DCI white point (SMPTE ST 431-1 / ST 2113). */
export const DCI_WHITE: XY = [0.314, 0.351]

/** Is (x, y) inside the triangle of primaries? Same-side test on all three edges. */
export function inGamut([x, y]: XY, tri: XY[]): boolean {
  const side = (a: XY, b: XY) => (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0])
  const s = [side(tri[0], tri[1]), side(tri[1], tri[2]), side(tri[2], tri[0])]
  return s.every((v) => v >= 0) || s.every((v) => v <= 0)
}

/** Is (x, y) a colour the eye can see? Inside the locus, closed by the line of purples. */
export function visible([x, y]: XY): boolean {
  let inside = false
  for (let i = 0, j = LOCUS.length - 1; i < LOCUS.length; j = i++) {
    const [xi, yi] = LOCUS[i]
    const [xj, yj] = LOCUS[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** CIE XYZ for chromaticity (x, y) at luminance Y. */
export function xyToXYZ([x, y]: XY, Y = 1): [number, number, number] {
  return [(x / y) * Y, Y, ((1 - x - y) / y) * Y]
}

/**
 * Displayable sRGB (0..255) for a chromaticity: negative channels clipped, brightest channel scaled to full.
 * Colours outside sRGB come out as the nearest your screen can show, not the real colour.
 */
export function xyToDisplayRGB(xy: XY): [number, number, number] {
  const [X, Y, Z] = xyToXYZ(xy)
  const lin = [
    3.2406 * X - 1.5372 * Y - 0.4986 * Z,
    -0.9689 * X + 1.8758 * Y + 0.0415 * Z,
    0.0557 * X - 0.204 * Y + 1.057 * Z,
  ].map((v) => Math.max(0, v))
  const max = Math.max(...lin) || 1
  return lin.map((v) => {
    const c = v / max
    return Math.round(255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055))
  }) as [number, number, number]
}

/** Paint the visible-colour horseshoe into a canvas; `map` turns xy into canvas pixels. */
export function paintLocus(canvas: HTMLCanvasElement, map: (xy: XY) => [number, number], unmap: (px: number, py: number) => XY) {
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(canvas.width, canvas.height)
  for (let py = 0; py < canvas.height; py++) {
    for (let px = 0; px < canvas.width; px++) {
      const xy = unmap(px, py)
      if (xy[1] <= 0 || !visible(xy)) continue
      const [r, g, b] = xyToDisplayRGB(xy)
      img.data.set([r, g, b, 255], (py * canvas.width + px) * 4)
    }
  }
  ctx.putImageData(img, 0, 0)
  ctx.beginPath()
  LOCUS.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](...map(p)))
  ctx.closePath()
  return ctx
}

type RGB = [number, number, number]

// Display P3 (D65) -> linear sRGB, composed from the standard P3->XYZ and XYZ->sRGB matrices.
const P3_TO_SRGB = [
  [1.2249, -0.2247, 0],
  [-0.042, 1.0419, 0],
  [-0.0197, -0.0786, 1.0979],
]
const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

const linearSrgb = (p3: RGB) => {
  const lin = p3.map(toLinear)
  return P3_TO_SRGB.map((row) => row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]) as RGB
}

/** Display P3 colour (0..1, gamma-encoded) as the nearest sRGB colour: out-of-range channels are clipped. */
export function p3ToSrgb(p3: RGB): RGB {
  return linearSrgb(p3).map((c) => toGamma(Math.min(1, Math.max(0, c)))) as RGB
}

/** Is this P3 colour outside what sRGB can show? */
export const outsideSrgb = (p3: RGB) => linearSrgb(p3).some((c) => c < -0.0005 || c > 1.0005)
