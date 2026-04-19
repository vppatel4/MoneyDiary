import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, duration = 500) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef(null)

  useEffect(() => {
    const from = fromRef.current
    const to = target
    if (from === to) return

    const start = performance.now()
    function tick(now) {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(from + (to - from) * eased)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return value
}
