import { useEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Runs `apply` whenever the section is in the middle of the viewport, and again when deps change while it is. */
export function useWhileActive(ref: RefObject<HTMLElement | null>, apply: () => void, deps: unknown[]) {
  const applyRef = useRef(apply)
  applyRef.current = apply
  const active = useRef(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        active.current = self.isActive
        if (self.isActive) applyRef.current()
      },
    })
    return () => st.kill()
  }, [ref])

  useEffect(() => {
    if (active.current) applyRef.current()
  }, deps)
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

export function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

const LOCAL_STILL = '/stills/master.jpg'
// Phones get the smaller copy of the NASA frame.
const DEFAULT_STILL = window.innerWidth < 800 ? '/media/launch-1000.jpg' : '/media/launch-2000.jpg'

/** Uses a still you dropped into public/stills/ if there is one, otherwise the NASA photo. */
export function useMasterImage() {
  const [still, setStill] = useState({ src: DEFAULT_STILL, local: false })
  useEffect(() => {
    const img = new Image()
    img.onload = () => setStill({ src: LOCAL_STILL, local: true })
    img.src = LOCAL_STILL
  }, [])
  return still
}
