import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

const STORAGE_KEY = 'vv-fps-visible'

function isTypingTarget(target: EventTarget | null) {
  const t = target as HTMLElement | null
  if (!t) return false
  return t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable
}

export default function FpsOverlay() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      if (new URLSearchParams(window.location.search).get('fps') === '1') return true
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })

  const toggle = useCallback(() => {
    setVisible((v) => {
      const next = !v
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      } catch {
        /* скипаем */
      }
      return next
    })
  }, [])

  const [fps, setFps] = useState<number>(0)
  const rafIdRef = useRef<number | null>(null)

  const stateRef = useRef({
    lastTs: 0,
    frames: 0,
    lastFpsTs: 0,
    ema: 0,
  })

  const loop = useCallback((ts: number) => {
    const s = stateRef.current
    if (!s.lastTs) s.lastTs = ts
    if (!s.lastFpsTs) s.lastFpsTs = ts

    s.frames += 1

    const elapsed = ts - s.lastFpsTs
    if (elapsed >= 500) {
      const instant = (s.frames * 1000) / elapsed
      s.frames = 0
      s.lastFpsTs = ts

      // лёгкое сглаживание, чтобы цифра не прыгала
      s.ema = s.ema ? s.ema * 0.7 + instant * 0.3 : instant
      setFps(Math.round(s.ema))
    }

    rafIdRef.current = window.requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') {
        if (isTypingTarget(e.target)) return
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggle])

  useEffect(() => {
    if (!visible) {
      if (rafIdRef.current) window.cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
      stateRef.current = { lastTs: 0, frames: 0, lastFpsTs: 0, ema: 0 }
      return
    }

    rafIdRef.current = window.requestAnimationFrame(loop)
    return () => {
      if (rafIdRef.current) window.cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [visible, loop])

  const fpsColor = useMemo(() => {
    if (fps >= 55) return 'text-emerald-300'
    if (fps >= 40) return 'text-amber-300'
    return 'text-[#E10600]'
  }, [fps])

  return (
    <>
      <div
        className={`fixed bottom-5 right-5 z-[12000] flex items-end gap-2 ${
          visible ? 'pointer-events-auto' : 'pointer-events-auto'
        }`}
      >
        {visible && (
          <div className="rounded border border-[#F5F7F6]/15 bg-black/60 px-3 py-2 backdrop-blur-md">
            <div className="font-['Bounded'] text-[9px] uppercase tracking-[0.22em] text-[#F5F7F6]/45">
              FPS
            </div>
            <div className={`font-bounded text-lg leading-none ${fpsColor}`}>{fps || '—'}</div>
          </div>
        )}

        <button
          type="button"
          onClick={toggle}
          className={`rounded border px-3 py-2 font-['Bounded'] text-[10px] uppercase tracking-[0.2em] transition-colors ${
            visible
              ? 'border-[#E10600] bg-[#E10600]/20 text-[#F5F7F6]'
              : 'border-[#F5F7F6]/20 bg-black/50 text-[#F5F7F6]/60 hover:border-[#E10600]/60 hover:text-[#F5F7F6]'
          }`}
          title="FPS: вкл/выкл (F)"
          aria-pressed={visible}
        >
          F
        </button>
      </div>
    </>
  )
}

