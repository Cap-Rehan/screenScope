import { lazy, Suspense, useMemo } from 'react'
import { EnvContext } from './components/ui'
import { hasWebGL, useMasterImage, useReducedMotion } from './lib/hooks'
import { stage } from './scene/state'
import Hook from './sections/Hook'
import Frame from './sections/Frame'
import Imax from './sections/Imax'
import Films from './sections/Films'
import Pixels from './sections/Pixels'
import Sound from './sections/Sound'
import Formats from './sections/Formats'
import Takeaway from './sections/Takeaway'
import Sources from './sections/Sources'

// three.js loads in its own chunk so the page's text arrives first.
const Stage = lazy(() => import('./scene/Stage'))

export default function App() {
  const reduced = useReducedMotion()
  const still = useMasterImage()
  const webgl = useMemo(hasWebGL, [])
  stage.reduced = reduced

  return (
    <EnvContext value={{ webgl, reduced, still }}>
      {webgl ? (
        <Suspense fallback={null}>
          <Stage src={still.src} />
        </Suspense>
      ) : (
        <div className="no-webgl-glow" aria-hidden="true" />
      )}
      <main>
        <Hook />
        <Frame />
        <Imax />
        <Films />
        <Pixels />
        <Sound />
        <Formats />
        <Takeaway />
        <Sources />
      </main>
    </EnvContext>
  )
}
