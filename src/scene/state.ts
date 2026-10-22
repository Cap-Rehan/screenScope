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
  ignite: 0,
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
      return { pos: [9, 4.6, 31], look: [-2, 5, 0], light: 0.3, image: 1, seats: 1, speakers: 0 }
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
