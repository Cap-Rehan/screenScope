import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { fitFrame, MASTER_RATIO } from '../lib/geometry'
import { gains, makeSpeakers } from '../lib/sound'
import { GAMUTS, paintLocus } from '../lib/colour'
import { FOV, SCREEN_W, screenCentreY, screenHeight, shotFor, stage, type Shot } from './state'

const LAMP = new THREE.Color('#FFA531')
const SCREEN_WHITE = new THREE.Color('#F3EEE4')
const ROOM_W = 26
const ROOM_D = 38
const PROJECTOR = new THREE.Vector3(0, 14, ROOM_D - 1)

const GUIDE_RATIOS = [1.9, 2.39]
const smooth = (x: number) => x * x * (3 - 2 * x)
const damp = THREE.MathUtils.damp

/** Scroll position in shots: section i adds 0..1 as its top travels from the viewport bottom to the top. */
function readScroll() {
  const els = document.querySelectorAll<HTMLElement>('[data-shot]')
  const vh = window.innerHeight
  let t = 0
  els.forEach((el, i) => {
    if (i > 0) t += THREE.MathUtils.clamp(1 - el.getBoundingClientRect().top / vh, 0, 1)
  })
  stage.shots = Array.from(els, (el) => el.dataset.shot ?? '')
  stage.t = t
}

function lerpShot(a: Shot, b: Shot, k: number): Shot {
  const l = (x: number, y: number) => x + (y - x) * k
  return {
    pos: [l(a.pos[0], b.pos[0]), l(a.pos[1], b.pos[1]), l(a.pos[2], b.pos[2])],
    look: [l(a.look[0], b.look[0]), l(a.look[1], b.look[1]), l(a.look[2], b.look[2])],
    light: l(a.light, b.light),
    image: l(a.image, b.image),
    seats: l(a.seats, b.seats),
    speakers: l(a.speakers, b.speakers),
    chart: l(a.chart ?? 0, b.chart ?? 0),
  }
}

/** The colour chart as a 1.90:1 screen image: the visible-colour horseshoe and the three gamut triangles. */
function chartTexture() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 540
  const S = 555
  const map = ([x, y]: [number, number]): [number, number] => [290 + x * S, 520 - y * S]
  const ctx = paintLocus(c, map, (px, py) => [(px - 290) / S, (520 - py) / S])
  ctx.globalCompositeOperation = 'destination-over'
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.globalCompositeOperation = 'source-over'
  ctx.lineWidth = 4
  ;(
    [
      ['rec709', '#8E867B'],
      ['p3', '#FFA531'],
      ['rec2020', '#F3EEE4'],
    ] as const
  ).forEach(([key, colour]) => {
    ctx.beginPath()
    GAMUTS[key].forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](...map(p)))
    ctx.closePath()
    ctx.strokeStyle = colour
    ctx.stroke()
  })
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function radialTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(255,165,49,0.9)')
  grad.addColorStop(0.35, 'rgba(255,140,40,0.35)')
  grad.addColorStop(1, 'rgba(180,68,15,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

function Theater({ src }: { src: string }) {
  const { camera, size } = useThree()
  const picture = useLoader(THREE.TextureLoader, src)
  picture.colorSpace = THREE.SRGBColorSpace
  // Up close (the pixels dive) show the photo's real pixels as hard squares, not a blur.
  picture.magFilter = THREE.NearestFilter

  // Damped values the scene actually renders.
  const live = useRef({ chart: 0, guides: 0, personScale: 1, ratio: stage.screenRatio, frame: stage.frameRatio, beams: stage.beams, shot: shotFor('hook', stage, 1), look: new THREE.Vector3(0, 8.5, 0) })

  const refs = {
    surface: useRef<THREE.Mesh>(null),
    image: useRef<THREE.Mesh>(null),
    blank: useRef<THREE.Mesh>(null),
    chart: useRef<THREE.Mesh>(null),
    glow: useRef<THREE.Mesh>(null),
    seats: useRef<THREE.InstancedMesh>(null),
    speakers: useRef<THREE.InstancedMesh>(null),
    orb: useRef<THREE.Mesh>(null),
    dust: useRef<THREE.Points>(null),
    light: useRef<THREE.PointLight>(null),
    person: useRef<THREE.Mesh>(null),
    guides: [useRef<THREE.LineLoop>(null), useRef<THREE.LineLoop>(null)],
  }

  const glowTex = useMemo(radialTexture, [])
  // Painting the chart takes a moment, so only once.
  const chartTex = useMemo(chartTexture, [])
  const unitRect = useMemo(
    () => new THREE.BufferGeometry().setFromPoints([[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].map(([x, y]) => new THREE.Vector3(x, y, 0))),
    [],
  )
  const imageMat = useMemo(() => new THREE.MeshBasicMaterial({ map: picture, transparent: true }), [picture])

  // Two beam pyramids from projector lens(es) to the lit image rectangle.
  const beams = useMemo(
    () =>
      [0, 1].map(() => {
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12 * 3), 3))
        const col = new Float32Array(12 * 3)
        for (let f = 0; f < 4; f++) {
          // apex bright, screen end faint
          col.set([0.09, 0.055, 0.02, 0.014, 0.008, 0.003, 0.014, 0.008, 0.003], f * 9)
        }
        g.setAttribute('color', new THREE.BufferAttribute(col, 3))
        const m = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
        return new THREE.Mesh(g, m)
      }),
    [],
  )

  const seatLayout = useMemo(() => {
    const out: THREE.Matrix4[] = []
    for (let row = 0; row < 14; row++) {
      for (let x = -10.8; x <= 10.8; x += 0.78) {
        out.push(new THREE.Matrix4().makeTranslation(x, row * 0.55 + 0.45, 9 + row * 2 + x * x * 0.012))
      }
    }
    return out
  }, [])

  const dustCount = size.width < 700 ? 220 : 520
  const dust = useMemo(() => {
    const pos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      pos.set([(Math.random() - 0.5) * 22, 1 + Math.random() * 15, 1 + Math.random() * (ROOM_D - 2)], i * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(dustCount * 3), 3))
    return g
  }, [dustCount])

  const tmp = useMemo(() => ({ v: new THREE.Vector3(), c: new THREE.Color(), axis: new THREE.Vector3(), lastCount: 0, speakers: makeSpeakers(32) }), [])

  useFrame((state, dt) => {
    readScroll()
    const reduced = stage.reduced
    const aspect = size.width / size.height
    const L = live.current

    // Ratios and beams ease toward the stage values.
    const k = reduced ? 1e3 : 5
    L.ratio = damp(L.ratio, stage.screenRatio, k, dt)
    L.frame = damp(L.frame, stage.frameRatio, k, dt)
    L.beams = damp(L.beams, stage.beams, k, dt)

    // Camera: lerp between neighbouring shots; reduced motion cuts to the nearest one.
    const t = reduced ? Math.round(stage.t) : stage.t
    const i = Math.min(Math.floor(t), stage.shots.length - 1)
    const a = shotFor(stage.shots[i], stage, aspect)
    const b = shotFor(stage.shots[Math.min(i + 1, stage.shots.length - 1)], stage, aspect)
    const target = lerpShot(a, b, smooth(t - i))
    const ck = reduced ? 1e3 : 3.2
    camera.position.set(damp(camera.position.x, target.pos[0], ck, dt), damp(camera.position.y, target.pos[1], ck, dt), damp(camera.position.z, target.pos[2], ck, dt))
    L.look.set(damp(L.look.x, target.look[0], ck, dt), damp(L.look.y, target.look[1], ck, dt), damp(L.look.z, target.look[2], ck, dt))
    camera.lookAt(L.look)
    for (const key of ['light', 'image', 'seats', 'speakers'] as const) L.shot[key] = damp(L.shot[key], target[key], ck, dt)
    L.chart = damp(L.chart, target.chart ?? 0, ck, dt)

    const light = L.shot.light * stage.ignite
    const H = screenHeight(L.ratio)
    const cy = screenCentreY(L.ratio)

    // Screen surface (dark where nothing is projected) and the lit image inside it.
    refs.surface.current!.scale.set(SCREEN_W, H, 1)
    refs.surface.current!.position.y = cy
    const fit = fitFrame(L.frame, L.ratio)
    const iw = SCREEN_W * fit.w
    const ih = H * fit.h
    for (const m of [refs.image.current!, refs.blank.current!]) {
      m.scale.set(iw, ih, 1)
      m.position.y = cy
    }
    // Crop the 1.43 master to the frame ratio (centre crop, height only).
    const rep = Math.min(1, MASTER_RATIO / L.frame)
    picture.repeat.set(1, rep)
    picture.offset.set(0, (1 - rep) / 2)
    imageMat.color.setScalar(light)
    imageMat.opacity = L.shot.image
    const chart = refs.chart.current!
    chart.visible = L.chart > 0.01
    chart.scale.set(iw, ih, 1)
    chart.position.y = cy
    const chartMat = chart.material as THREE.MeshBasicMaterial
    chartMat.opacity = L.chart
    chartMat.color.setScalar(light)
    const blankMat = refs.blank.current!.material as THREE.MeshBasicMaterial
    blankMat.color.copy(SCREEN_WHITE).multiplyScalar(0.92 * light)
    blankMat.opacity = 1 - L.shot.image

    // Frame lines: where 1.90 and 2.39 versions sit inside the 1.43 picture, cut from the centre.
    L.guides = damp(L.guides, stage.guides && stage.shots[Math.round(stage.t)] === 'frame' ? 1 : 0, k, dt)
    GUIDE_RATIOS.forEach((r, n) => {
      const g = refs.guides[n].current!
      g.visible = L.guides > 0.01
      g.scale.set(iw, (ih * L.frame) / r, 1)
      g.position.y = cy
      ;(g.material as THREE.LineBasicMaterial).opacity = L.guides
    })

    refs.glow.current!.scale.set(SCREEN_W * 2.1, H * 2.6, 1)
    refs.glow.current!.position.y = cy
    ;(refs.glow.current!.material as THREE.MeshBasicMaterial).opacity = 0.55 * light
    refs.light.current!.position.y = cy
    refs.light.current!.intensity = 9 * light

    // Beams: one or two lenses, aimed at the image corners.
    const corners = [
      [-iw / 2, cy - ih / 2], [iw / 2, cy - ih / 2], [iw / 2, cy + ih / 2], [-iw / 2, cy + ih / 2],
    ]
    beams.forEach((mesh, n) => {
      const dual = THREE.MathUtils.clamp(L.beams - 1, 0, 1)
      const apexX = (n === 0 ? -0.9 : 0.9) * dual
      const visible = n === 0 ? 1 : dual
      const p = mesh.geometry.attributes.position as THREE.BufferAttribute
      for (let f = 0; f < 4; f++) {
        const c1 = corners[f]
        const c2 = corners[(f + 1) % 4]
        p.setXYZ(f * 3, PROJECTOR.x + apexX, PROJECTOR.y, PROJECTOR.z)
        p.setXYZ(f * 3 + 1, c1[0], c1[1], 0.05)
        p.setXYZ(f * 3 + 2, c2[0], c2[1], 0.05)
      }
      p.needsUpdate = true
      mesh.geometry.computeBoundingSphere()
      ;(mesh.material as THREE.MeshBasicMaterial).opacity = 0.45 * light * visible * (1 - 0.3 * dual)
    })

    // The person keeps 1.8 m against the real width of the screen picked in the scale section.
    const metres = stage.shots[Math.round(stage.t)] === 'scale' ? stage.screenMetres : SCREEN_W
    L.personScale = damp(L.personScale, SCREEN_W / metres, k, dt)
    refs.person.current!.scale.setScalar(L.personScale)
    refs.person.current!.position.y = 0.88 * L.personScale

    // Seats fade out for straight-on demo shots so they never block the screen.
    const seatMat = refs.seats.current!.material as THREE.MeshLambertMaterial
    seatMat.opacity = L.shot.seats
    refs.seats.current!.visible = L.shot.seats > 0.02

    // Speakers mirror the sound demo.
    const sp = refs.speakers.current!
    if (tmp.lastCount !== stage.speakerCount) {
      tmp.speakers = makeSpeakers(stage.speakerCount)
      tmp.lastCount = stage.speakerCount
      sp.count = tmp.speakers.length
      tmp.speakers.forEach((s, n) => {
        const y = s.y === 0 ? cy : 7.5
        sp.setMatrixAt(n, new THREE.Matrix4().makeTranslation((s.x - 0.5) * ROOM_W * 0.98, y, s.y === 0 ? -0.4 : 0.6 + s.y * (ROOM_D - 2)))
      })
      sp.instanceMatrix.needsUpdate = true
    }
    const g = gains(tmp.speakers, stage.orb, stage.soundMode)
    // Lit speakers pulse with the demo's live audio level (1 when silent).
    const pulse = 0.45 + 0.55 * stage.level
    g.forEach((gain, n) => sp.setColorAt(n, tmp.c.setRGB(0.12, 0.1, 0.09).lerp(LAMP, gain * L.shot.speakers * pulse)))
    if (sp.instanceColor) sp.instanceColor.needsUpdate = true
    sp.visible = L.shot.speakers > 0.02
    const orb = refs.orb.current!
    orb.visible = sp.visible
    orb.position.set((stage.orb.x - 0.5) * ROOM_W * 0.9, 6, 0.6 + stage.orb.y * (ROOM_D - 3))
    orb.scale.setScalar(L.shot.speakers * (0.8 + 0.4 * stage.level))

    // Dust: drifts upward; brighter near the beam axis.
    const pts = dust.attributes.position as THREE.BufferAttribute
    const col = dust.attributes.color as THREE.BufferAttribute
    tmp.axis.set(0, cy, 0).sub(PROJECTOR).normalize()
    const time = state.clock.elapsedTime
    for (let n = 0; n < dustCount; n++) {
      let y = pts.getY(n)
      if (!reduced) {
        y += dt * 0.18
        if (y > 16) y = 1
        pts.setY(n, y)
        pts.setX(n, pts.getX(n) + Math.sin(time * 0.3 + n) * dt * 0.05)
      }
      tmp.v.set(pts.getX(n), y, pts.getZ(n)).sub(PROJECTOR)
      const along = tmp.v.dot(tmp.axis)
      const off = tmp.v.addScaledVector(tmp.axis, -along).length()
      const radius = 0.4 + (along / PROJECTOR.z) * (H * 0.55)
      const lit = THREE.MathUtils.clamp(1 - off / radius, 0, 1) * light
      col.setXYZ(n, LAMP.r * lit, LAMP.g * lit * 0.85, LAMP.b * lit * 0.6)
    }
    pts.needsUpdate = true
    col.needsUpdate = true
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 60, 170]} />
      <ambientLight intensity={0.04} />
      <pointLight ref={refs.light} color="#FFB45E" position={[0, 8, 4]} decay={1.6} distance={0} />

      {/* Room */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, ROOM_D / 2]}>
        <planeGeometry args={[ROOM_W, ROOM_D + 2]} />
        <meshLambertMaterial color="#120e0b" />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * ROOM_W) / 2, 9, ROOM_D / 2]} rotation-y={(-side * Math.PI) / 2}>
          <planeGeometry args={[ROOM_D + 2, 18]} />
          <meshLambertMaterial color="#17110d" />
        </mesh>
      ))}
      <mesh position={[0, 9, -0.8]}>
        <planeGeometry args={[ROOM_W, 18]} />
        <meshLambertMaterial color="#0b0807" />
      </mesh>

      {/* Screen */}
      <mesh ref={refs.glow} position={[0, 10, -0.6]}>
        <planeGeometry />
        <meshBasicMaterial map={glowTex} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={refs.surface} position={[0, 10, 0]}>
        <planeGeometry />
        <meshBasicMaterial color="#15120f" />
      </mesh>
      <mesh ref={refs.image} position={[0, 10, 0.02]} material={imageMat}>
        <planeGeometry />
      </mesh>
      <mesh ref={refs.chart} position={[0, 10, 0.045]} visible={false}>
        <planeGeometry />
        <meshBasicMaterial map={chartTex} transparent />
      </mesh>
      <mesh ref={refs.blank} position={[0, 10, 0.03]}>
        <planeGeometry />
        <meshBasicMaterial transparent />
      </mesh>
      {GUIDE_RATIOS.map((r, n) => (
        <lineLoop key={r} ref={refs.guides[n]} geometry={unitRect} position-z={0.06}>
          <lineBasicMaterial color={n === 0 ? '#F3EEE4' : '#FFA531'} transparent />
        </lineLoop>
      ))}
      {beams.map((m, n) => (
        <primitive key={n} object={m} />
      ))}

      {/* A person, for scale */}
      <mesh ref={refs.person} position={[7, 0.88, 1.2]}>
        <capsuleGeometry args={[0.22, 1.3, 4, 8]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      <instancedMesh
        ref={(m) => {
          refs.seats.current = m
          if (m) seatLayout.forEach((mat, n) => m.setMatrixAt(n, mat))
        }}
        args={[undefined, undefined, seatLayout.length]}
      >
        <boxGeometry args={[0.62, 0.9, 0.62]} />
        <meshLambertMaterial color="#2a1c15" transparent />
      </instancedMesh>

      <instancedMesh ref={refs.speakers} args={[undefined, undefined, 64]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshBasicMaterial />
      </instancedMesh>
      <mesh ref={refs.orb}>
        <sphereGeometry args={[0.7, 20, 20]} />
        <meshBasicMaterial color="#F3EEE4" />
      </mesh>

      <points geometry={dust}>
        <pointsMaterial vertexColors size={0.07} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </>
  )
}

export default function Stage({ src }: { src: string }) {
  return (
    <div className="stage" aria-hidden="true">
      <Canvas flat camera={{ fov: FOV, near: 0.1, far: 200, position: [0, 10.5, 37] }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
        <Suspense fallback={null}>
          <Theater src={src} />
        </Suspense>
      </Canvas>
    </div>
  )
}

