import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import PortfolioWorksPage from './pages/PortfolioWorksPage'
import CookiePolicyPage from './pages/CookiePolicyPage'
import LayoutGridOverlay from './components/LayoutGridOverlay'
import FpsOverlay from './components/FpsOverlay'
import CursorFx from './components/CursorFx'
import './index.css'

function isTypingTarget(target: EventTarget | null) {
  const t = target as HTMLElement | null
  if (!t) return false
  return t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable
}

function Root() {
  const [debugOverlaysVisible, setDebugOverlaysVisible] = React.useState(false)

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'l') return
      if (isTypingTarget(e.target)) return
      e.preventDefault()
      setDebugOverlaysVisible((v) => !v)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/portfolio" element={<PortfolioWorksPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        </Routes>
        <CursorFx />
        {/* Служебные оверлеи: скрыть/показать клавишей L */}
        {debugOverlaysVisible && (
          <>
            <LayoutGridOverlay />
            <FpsOverlay />
          </>
        )}
      </>
    </BrowserRouter>
  )
}

// точка входа: роутинг + глобальные оверлеи 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
