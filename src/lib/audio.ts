// Browser audio for the sound demo: each speaker of the 2D room becomes a virtual speaker
// placed around the listener (HRTF panning, best on headphones). Nothing plays until start().
import { gains, type Mode, type Point, type Speaker } from './sound'

/** Where you sit in the room, in room coords (x across, y from screen to back). */
export const LISTENER: Point = { x: 0.5, y: 0.62 }
const ROOM_METRES = 14

/** Speaker position in metres around the listener: x right, z backwards (the screen is ahead, at -z). */
export function speakerPosition(s: Point) {
  return { x: (s.x - LISTENER.x) * ROOM_METRES, z: (s.y - LISTENER.y) * ROOM_METRES }
}

/** Gains with constant total power, so a whole surround wall isn't louder than three speakers. */
export function renderGains(speakers: Speaker[], p: Point, mode: Mode): number[] {
  const g = gains(speakers, p, mode)
  const power = Math.hypot(...g)
  return power ? g.map((v) => v / power) : g
}

const VOLUME = 0.3

export type Engine = {
  setLayout(speakers: Speaker[]): void
  update(p: Point, mode: Mode): void
  /** Current output level, roughly 0..1, for visuals. */
  level(): number
  stop(): void
}

/** A rotor-like sound: chopped broadband noise plus a low thump, easy to localise. */
export function startEngine(speakers: Speaker[]): Engine {
  const ctx = new AudioContext()
  const master = ctx.createGain()
  master.gain.value = 0
  master.gain.setTargetAtTime(VOLUME, ctx.currentTime, 0.4)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = 512
  master.connect(analyser)
  analyser.connect(ctx.destination)

  const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = noiseBuf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const noise = ctx.createBufferSource()
  noise.buffer = noiseBuf
  noise.loop = true
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1100
  band.Q.value = 0.6

  // 9 Hz chop on both layers: the "blade" rhythm.
  const source = ctx.createGain()
  source.gain.value = 0.5
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 9
  const depth = ctx.createGain()
  depth.gain.value = 0.5
  lfo.connect(depth).connect(source.gain)

  const thump = ctx.createOscillator()
  thump.frequency.value = 58
  const thumpLevel = ctx.createGain()
  thumpLevel.gain.value = 0.6

  noise.connect(band).connect(source)
  thump.connect(thumpLevel).connect(source)
  noise.start()
  lfo.start()
  thump.start()

  let feeds: GainNode[] = []
  let current = speakers

  const setLayout = (sp: Speaker[]) => {
    feeds.forEach((f) => f.disconnect())
    current = sp
    feeds = sp.map((s) => {
      const feed = ctx.createGain()
      feed.gain.value = 0
      const pan = new PannerNode(ctx, { panningModel: 'HRTF', distanceModel: 'inverse', refDistance: 3, rolloffFactor: 0.6 })
      const { x, z } = speakerPosition(s)
      pan.positionX.value = x
      pan.positionY.value = 1
      pan.positionZ.value = z
      source.connect(feed).connect(pan).connect(master)
      return feed
    })
  }
  setLayout(speakers)

  const buf = new Float32Array(analyser.fftSize)
  return {
    setLayout,
    update(p, mode) {
      const g = renderGains(current, p, mode)
      feeds.forEach((f, i) => f.gain.setTargetAtTime(g[i], ctx.currentTime, 0.04))
    },
    level() {
      analyser.getFloatTimeDomainData(buf)
      let sum = 0
      for (const v of buf) sum += v * v
      return Math.min(1, Math.sqrt(sum / buf.length) * 25)
    },
    stop() {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.08)
      setTimeout(() => ctx.close(), 400)
    },
  }
}
