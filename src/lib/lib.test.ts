import { describe, expect, it } from 'vitest'
import { cutoffFrequency, extraArea, fitFrame, impliedK, masterShown, mtf, pixelsPerDegree, viewAngleDeg } from './geometry'
import { gains, makeSpeakers, nearestGroup } from './sound'
import { LISTENER, renderGains, speakerPosition } from './audio'
import { DCI_WHITE, GAMUTS, inGamut, visible, xyToDisplayRGB } from './colour'

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

describe('Kodak film MTF', () => {
  it('cutoff lands on the curve', () => {
    for (const c of [0.8, 0.5, 0.4]) {
      const f = cutoffFrequency('green', c)!
      expect(mtf('green', f)).toBeCloseTo(c, 1)
    }
  })
  it('returns null past the end of Kodak\'s chart', () => {
    expect(cutoffFrequency('green', 0.3)).toBeNull()
    expect(cutoffFrequency('red', 0.3)).not.toBeNull()
  })
  it('80 cycles/mm across 69.6 mm is about 11K', () => {
    expect(impliedK(80, 69.6)).toBeCloseTo(11.1, 1)
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

describe('audio rendering', () => {
  it('keeps total power at 1 in both modes', () => {
    const sp = makeSpeakers(32)
    for (const mode of ['channels', 'objects'] as const) expect(Math.hypot(...renderGains(sp, { x: 0.05, y: 0.5 }, mode))).toBeCloseTo(1, 6)
  })
  it('puts the screen ahead of the listener and the back wall behind', () => {
    expect(speakerPosition({ x: LISTENER.x, y: 0 }).z).toBeLessThan(0)
    expect(speakerPosition({ x: LISTENER.x, y: 1 }).z).toBeGreaterThan(0)
    expect(speakerPosition({ x: 0, y: 0.5 }).x).toBeLessThan(0)
  })
})

describe('colour', () => {
  it('white is inside every gamut and visible', () => {
    for (const g of Object.values(GAMUTS)) expect(inGamut(DCI_WHITE, g)).toBe(true)
    expect(visible(DCI_WHITE)).toBe(true)
  })
  it('the Rec. 2020 green primary is outside P3 and Rec. 709', () => {
    const green = GAMUTS.rec2020[1]
    expect(inGamut([green[0] + 0.001, green[1] - 0.01], GAMUTS.rec2020)).toBe(true)
    expect(inGamut(green, GAMUTS.p3)).toBe(false)
    expect(inGamut(green, GAMUTS.rec709)).toBe(false)
  })
  it('points outside the horseshoe are not visible colours', () => {
    expect(visible([0.05, 0.05])).toBe(false)
    expect(visible([0.7, 0.6])).toBe(false)
  })
  it('the sRGB red primary maps to pure red', () => {
    expect(xyToDisplayRGB([0.64, 0.33])).toEqual([255, 0, 0])
  })
})
