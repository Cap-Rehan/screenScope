// Simplified 2D auditorium for the channel-vs-object demo.
// Room coords: x 0..1 across (left to right), y 0..1 from screen to back wall.

export type Group = 'L' | 'C' | 'R' | 'left' | 'right' | 'back'
export type Speaker = { x: number; y: number; group: Group }
export type Point = { x: number; y: number }
export type Mode = 'channels' | 'objects'

const ANCHORS: Record<Group, Point> = {
  L: { x: 0.2, y: 0 },
  C: { x: 0.5, y: 0 },
  R: { x: 0.8, y: 0 },
  left: { x: 0, y: 0.55 },
  right: { x: 1, y: 0.55 },
  back: { x: 0.5, y: 1 },
}

const spread = (count: number, from: number, to: number) =>
  Array.from({ length: count }, (_, i) => from + ((to - from) * (i + 0.5)) / count)

/** Lay out `total` speakers: screen speakers, then side walls and back wall. */
export function makeSpeakers(total: number): Speaker[] {
  const screenCount = total >= 32 ? 5 : 3
  const rest = total - screenCount
  const side = Math.round(rest * 0.35)
  const back = rest - 2 * side
  const screen = spread(screenCount, 0.1, 0.9).map((x): Speaker => ({
    x,
    y: 0,
    group: x < 0.38 ? 'L' : x > 0.62 ? 'R' : 'C',
  }))
  return [
    ...screen,
    ...spread(side, 0.15, 0.95).map((y): Speaker => ({ x: 0, y, group: 'left' })),
    ...spread(side, 0.15, 0.95).map((y): Speaker => ({ x: 1, y, group: 'right' })),
    ...spread(back, 0.08, 0.92).map((x): Speaker => ({ x, y: 1, group: 'back' })),
  ]
}

const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

/** The channel a sound at `p` would be mixed to in a channel-based format. */
export function nearestGroup(p: Point): Group {
  let best: Group = 'C'
  for (const g of Object.keys(ANCHORS) as Group[]) {
    if (dist(p, ANCHORS[g]) < dist(p, ANCHORS[best])) best = g
  }
  return best
}

/**
 * Speaker gains (0..1) for a sound at `p`.
 * channels: the whole channel's speaker group plays it equally.
 * objects: the nearest three speakers share it, closer ones louder (constant power).
 */
export function gains(speakers: Speaker[], p: Point, mode: Mode): number[] {
  if (mode === 'channels') {
    const g = nearestGroup(p)
    return speakers.map((s) => (s.group === g ? 1 : 0))
  }
  const nearest = speakers
    .map((s, i) => ({ i, d: dist(s, p) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3)
  const weights = nearest.map((n) => 1 / (n.d + 0.02))
  const norm = Math.hypot(...weights)
  const out = speakers.map(() => 0)
  nearest.forEach((n, k) => (out[n.i] = weights[k] / norm))
  return out
}
