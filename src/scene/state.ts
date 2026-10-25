import type { Mode, Point } from '../lib/sound'

/**
 * Shared, mutable stage state. HTML sections write to it; the 3D scene reads it every frame.
 * Plain object on purpose: no re-renders, no state library.
 */
export const stage = {
  /** Scroll position in "sections": 2.4 = 40% of the way from section 2's shot to section 3's. */
  t: 0,
  /** Shot names in page order, filled from [data-shot] elements. */
  shots: [] as string[],
  screenRatio: 1.9,
  frameRatio: 1.9,
  beams: 1,
  /** Show 1.90 and 2.39 frame lines over the 1.43 picture (frame section). */
  guides: false,
  ignite: 0,
  /** Screen brightness set by the light demo, 0..1 */
  brightness: 1,
  /** Pixels section fly-in, 0 = seats, 1 = nose against the screen */
  dive: 0,
  /** Real-world width of the screen in the scale section, in metres; the scene's screen is always SCREEN_W units. */
  screenMetres: 20,
  orb: { x: 0.5, y: 0.45 } as Point,
  soundMode: 'objects' as Mode,
  speakerCount: 32,
  reduced: false,
}

export type Stage = typeof stage

export const SCREEN_W = 20
export const SCREEN_BOTTOM = 2
export const screenHeight = (ratio: number) => SCREEN_W / ratio
export const screenCentreY = (ratio: number) => SCREEN_BOTTOM + screenHeight(ratio) / 2

export type Shot = {
  pos: [number, number, number]
  look: [number, number, number]
  /** Screen brightness 0..1 */
  light: number
  /** 0 = blank projector light, 1 = picture */
  image: number
  seats: number
  speakers: number
}

export const FOV = 40
const tanHalf = Math.tan(((FOV / 2) * Math.PI) / 180)

/** Straight-on shot that fits the screen in the upper part of the viewport, leaving room for controls. */
function fit(s: Stage, aspect: number): Pick<Shot, 'pos' | 'look'> {
  const h = screenHeight(s.screenRatio)
  const fillW = aspect < 0.8 ? 0.92 : 0.62
  const fillH = aspect < 0.8 ? 0.42 : 0.6
  const d = Math.max(h / (2 * tanHalf * fillH), SCREEN_W / (2 * tanHalf * aspect * fillW))
  const visibleH = 2 * d * tanHalf
  // Desktop: screen sits right of the copy column. Mobile: screen sits in the upper third.
  const shiftX = aspect < 0.8 ? 0 : -visibleH * aspect * 0.17
  const shiftY = aspect < 0.8 ? -visibleH * 0.26 : -visibleH * 0.04
  const y = screenCentreY(s.screenRatio) + shiftY
  return { pos: [shiftX, y, d], look: [shiftX, y, 0] }
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k

// Where the dive lands, as a fraction of the 1.43 master photo: the edge of the rocket's orange core stage against the night sky.
export const DIVE_U = 0.607
export const DIVE_V = 0.19
// Distance from the screen at the end of the dive; phones see a narrower slice, so they stop further back.
const diveEnd = (aspect: number) => (aspect < 0.8 ? 2.2 : 1)

/** World x, y of the dive target on the screen, given the current crop of the master photo. */
function divePoint(s: Stage): [number, number] {
  const crop = Math.min(1, 1.43 / s.frameRatio)
  const v = (DIVE_V - (1 - crop) / 2) / crop
  return [(DIVE_U - 0.5) * SCREEN_W, screenCentreY(s.screenRatio) + (0.5 - v) * screenHeight(s.screenRatio)]
}

const SEATS_VIEW: Shot = { pos: [9, 4.6, 31], look: [-2, 5, 0], light: 0.3, image: 1, seats: 1, speakers: 0 }

/** From the seats to the screen surface; distance shrinks exponentially so the last metre isn't rushed. */
function dive(s: Stage, aspect: number): Shot {
  const k = s.dive * s.dive * (3 - 2 * s.dive)
  if (!k) return SEATS_VIEW
  const [x, y] = divePoint(s)
  const z = SEATS_VIEW.pos[2] * (diveEnd(aspect) / SEATS_VIEW.pos[2]) ** s.dive
  return {
    pos: [lerp(SEATS_VIEW.pos[0], x, k), lerp(SEATS_VIEW.pos[1], y, k), z],
    look: [lerp(SEATS_VIEW.look[0], x, k), lerp(SEATS_VIEW.look[1], y, k), 0],
    light: lerp(0.3, 0.85, k),
    image: 1,
    seats: 1 - k,
    speakers: 0,
  }
}

const HOOK: Shot = { pos: [0, 9.5, 36], look: [0, 8.5, 0], light: 1, image: 0, seats: 1, speakers: 0 }
// On wide viewports the opening screen sits right of the headline.
// On tall phones it sits above the headline, seen from high in the back rows.
const hook = (aspect: number): Shot =>
  aspect < 0.8 ? { ...HOOK, pos: [0, 15, 66], look: [0, -1.5, 0] } : { ...HOOK, pos: [-4, 9.5, 36], look: [-9, 8, 0] }

export function shotFor(name: string | undefined, s: Stage, aspect: number): Shot {
  switch (name) {
    case 'frame':
    case 'imax':
      return { ...fit(s, aspect), light: 1, image: 1, seats: 0, speakers: 0 }
    case 'pixels':
      return dive(s, aspect)
    case 'light':
      return { pos: [0, 7.5, 31], look: [-7, 8, 0], light: 0.15 + 0.85 * s.brightness, image: 1, seats: 1, speakers: 0 }
    case 'colour':
      return { pos: [-10, 5, 30], look: [2, 8, 0], light: 0.3, image: 1, seats: 1, speakers: 0 }
    case 'scale':
      // At the foot of the screen, beside the person, looking up.
      return { pos: [9.6, 1.4, 6.5], look: [1, 10, 0], light: aspect < 0.8 ? 0.35 : 1, image: 1, seats: 1, speakers: 0 }
    case 'sound':
      return { pos: [0, 66, 22], look: [0, 0, 17], light: 0.4, image: 1, seats: 1, speakers: 1 }
    case 'formats':
      return { pos: [17, 13, 44], look: [0, 7, 2], light: 0.35, image: 1, seats: 1, speakers: 0 }
    case 'films':
      return { ...hook(aspect), light: 0.3, image: 1 }
    case 'sources':
      return { ...hook(aspect), light: 0.25 }
    default:
      return hook(aspect)
  }
}
