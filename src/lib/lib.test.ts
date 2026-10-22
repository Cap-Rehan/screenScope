import { describe, expect, it } from 'vitest'
import { extraArea, fitFrame, impliedK, masterShown, mtf, cutoffFrequency, pixelsPerDegree, viewAngleDeg } from './geometry'
import { gains, makeSpeakers, nearestGroup } from './sound'

describe('aspect ratio maths', () => {
  it('matches IMAX\'s "up to 26%" for 2.39 -> 1.90 at the same width', () => {
    expect(extraArea(2.39, 1.9)).toBeCloseTo(0.258, 3)
    expect(extraArea(1.9, 1.43)).toBeCloseTo(0.329, 3)
    expect(extraArea(2.39, 1.43)).toBeCloseTo(0.671, 3)
  })

  it('crops the 1.43 master by height only', () => {
    expect(masterShown(1.43)).toBe(1)
    expect(masterShown(2.39)).toBeCloseTo(0.598, 3)
    expect(masterShown(1.2)).toBe(1)
  })

  it('letterboxes wider frames and pillarboxes taller ones', () => {
    expect(fitFrame(2.39, 1.43)).toMatchObject({ w: 1, bars: 'letterbox' })
    expect(fitFrame(2.39, 1.43).h).toBeCloseTo(0.598, 3)
    expect(fitFrame(1.43, 1.9)).toMatchObject({ h: 1, bars: 'pillarbox' })
    expect(fitFrame(1.9, 1.9)).toEqual({ w: 1, h: 1, bars: 'none' })
  })
})

describe('pixels per degree', () => {
  it('half a screen width away fills 90 degrees', () => {
    expect(viewAngleDeg(0.5)).toBeCloseTo(90, 6)
    expect(pixelsPerDegree(4096, 0.5)).toBeCloseTo(45.5, 1)
  })
  it('grows with distance', () => {
    expect(pixelsPerDegree(2048, 1.5)).toBeGreaterThan(pixelsPerDegree(2048, 0.6))
  })
})

describe('illustrative film MTF', () => {
  it('cutoff inverts the curve', () => {
    for (const c of [0.5, 0.1, 0.03]) expect(mtf(cutoffFrequency(c))).toBeCloseTo(c, 6)
  })
  it('same frame, different "K" depending on the cutoff', () => {
    expect(impliedK(0.5, 69.6)).toBeLessThan(impliedK(0.1, 69.6))
    expect(impliedK(0.1, 69.6)).toBeCloseTo(11.1, 0)
  })
})

describe('speakers', () => {
  it('lays out the requested count', () => {
    for (const n of [16, 32, 64]) expect(makeSpeakers(n)).toHaveLength(n)
  })
  it('channels light a whole wall, objects a few speakers at constant power', () => {
    const sp = makeSpeakers(32)
    const p = { x: 0.05, y: 0.5 }
    expect(nearestGroup(p)).toBe('left')
    const ch = gains(sp, p, 'channels')
    expect(ch.filter((g) => g > 0).length).toBe(sp.filter((s) => s.group === 'left').length)
    const ob = gains(sp, p, 'objects')
    expect(ob.filter((g) => g > 0)).toHaveLength(3)
    expect(Math.hypot(...ob)).toBeCloseTo(1, 6)
  })
})
