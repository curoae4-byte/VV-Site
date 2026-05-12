import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import gsap from 'gsap'
import './Preloader.css'

interface PreloaderProps {
  onComplete: () => void
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  // три стадии: прогресс → разъезд → финальное открытие
  const [stage, setStage] = useState<'intro' | 'veil' | 'enter'>('intro')
  const [progress, setProgress] = useState(0)
  const [isEntering, setIsEntering] = useState(false)
  const leftCurtainRef = useRef<HTMLDivElement>(null)
  const rightCurtainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // имитация загрузки (проценты для ритма)
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 1
      })
    }, 20)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // на 100% даём паузу и переходим к "щели"
    if (progress === 100) {
      setTimeout(() => setStage('veil'), 500)
    }
  }, [progress])

  useEffect(() => {
    if (stage === 'veil') {
      // слегка раздвигаем занавес, чтобы появился маскот
      gsap.to(leftCurtainRef.current, {
        xPercent: -10,
        duration: 2.5,
        ease: 'power2.inOut',
      })
      gsap.to(rightCurtainRef.current, {
        xPercent: 10,
        duration: 2.5,
        ease: 'power2.inOut',
      })
    }
  }, [stage])

  const handleEnter = () => {
    if (isEntering) return
    setIsEntering(true)
    setStage('enter')

    const leftCurtain = leftCurtainRef.current
    const rightCurtain = rightCurtainRef.current
    if (!leftCurtain || !rightCurtain) return

    // чистим анимации ховера перед финальным открытием
    ;[leftCurtain, rightCurtain].forEach((curtain) => {
      gsap.killTweensOf(curtain)
      gsap.set(curtain, { rotateY: 0, rotateZ: 0, skewY: 0 })

      const spot = curtain.querySelector('.curtain-spot') as HTMLDivElement | null
      if (spot) {
        gsap.killTweensOf(spot)
        gsap.set(spot, { opacity: 0 })
      }
    })

    // открываем занавес полностью и отдаём управление приложению
    gsap.to(leftCurtain, {
      xPercent: -100,
      duration: 1.5,
      ease: 'power4.inOut',
      overwrite: 'auto',
    })
    gsap.to(rightCurtain, {
      xPercent: 100,
      duration: 1.5,
      ease: 'power4.inOut',
      overwrite: 'auto',
      onComplete: () => onComplete(),
    })
  }

  const handleCurtainHover = (e: React.MouseEvent) => {
    if (stage !== 'veil' || isEntering) return

    const target = e.currentTarget as HTMLDivElement
    const rect = target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const isLeft = target === leftCurtainRef.current

    // "тяжёлый" эффект от близости к внутреннему краю
    const innerEdgeDist = isLeft ? (rect.width - x) : x
    const edgeEffect = Math.max(0, 1 - innerEdgeDist / 450)
    const pushAmount = edgeEffect * (isLeft ? -15 : 15)

    // вертикаль нужна для лёгкого перекоса
    const yRel = (y / rect.height - 0.5)

    // 3d слайд занавеса + небольшой наклон
    gsap.to(target, {
      xPercent: (isLeft ? -10 : 10) + pushAmount,
      rotateY: (isLeft ? 8 : -8) * edgeEffect,
      rotateZ: (isLeft ? -1 : 1) * edgeEffect * 2, // лёгкий наклон от "тяжести"
      skewY: yRel * (isLeft ? 4 : -4) * edgeEffect, // тянем ткань за курсором
      duration: 0.7,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    // двигаем локальный "свет" за курсором
    const spot = target.querySelector('.curtain-spot') as HTMLDivElement
    if (spot) {
      gsap.to(spot, {
        x: x,
        y: y,
        opacity: 0.4 * edgeEffect + 0.1,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
  }

  const handleCurtainLeave = (e: React.MouseEvent) => {
    if (stage !== 'veil' || isEntering) return

    const target = e.currentTarget as HTMLDivElement
    const isLeft = target === leftCurtainRef.current
    
    // возвращаем занавес в базу с "оседанием"
    gsap.to(target, {
      xPercent: isLeft ? -10 : 10,
      rotateY: 0,
      rotateZ: 0,
      skewY: 0,
      duration: 1.8,
      ease: 'elastic.out(1, 0.5)', // чуть "оседает" обратно
      overwrite: 'auto',
    })
    
    const spot = target.querySelector('.curtain-spot') as HTMLDivElement
    if (spot) {
      // гасим подсветку
      gsap.to(spot, {
        opacity: 0,
        duration: 0.8,
        overwrite: 'auto',
      })
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-[#080808] overflow-hidden">
      {/* фон за занавесами */}
      <div className="absolute inset-0 bg-[#000000] flex flex-col items-center justify-center z-0">
        <AnimatePresence>
          {(stage === 'veil' || stage === 'enter') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col items-center"
            >
              {/* маскот за занавесами */}
              <div className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px] lg:w-[500px] lg:h-[500px] mb-8 sm:mb-10 md:mb-12 flex items-center justify-center">
                
                {/* силуэт маскота */}
                <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
                  <defs>
                    <radialGradient id="veilBodyGradient" cx="50%" cy="40%" r="60%" fx="50%" fy="30%">
                      <stop offset="0%" stopColor="#0f0f0f" />
                      <stop offset="100%" stopColor="#000000" />
                    </radialGradient>
                  </defs>
                  
                  {/* Высокий «капюшонный» силуэт ближе к референсу */}
                  <path
                    fill="url(#veilBodyGradient)"
                    d="M100 10C66 10 40 30 34 70L20 184C20 190 26 194 34 194H166C174 194 180 190 180 184L166 70C160 30 134 10 100 10Z"
                  />
                  
                  {/* очки (svg) */}
                  <image
                    href="/viswhite.svg"
                    x="36"
                    y="66"
                    width="128"
                    height="42"
                    preserveAspectRatio="xMidYMid meet"
                  />

                  {/* Минималистичные черты лица */}
                  <path
                    d="M100 100 L100 124"
                    stroke="#121212"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    fill="none"
                  />
                  
                  <path
                    d="M94 145 L106 145"
                    stroke="#101010"
                    strokeWidth="1.35"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                
                {/* шум для "киношности" */}
                <div 
                  className="absolute inset-0 z-20 pointer-events-none opacity-20 mix-blend-overlay" 
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    backgroundSize: '180px 180px',
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* слой занавесов */}
      <div className="absolute inset-0 z-10 pointer-events-none perspective-[2500px]">
        {/* левый занавес */}
        <div
          ref={leftCurtainRef}
          onMouseMove={handleCurtainHover}
          onMouseLeave={handleCurtainLeave}
          className="curtain-panel curtain-panel--left pointer-events-auto origin-left shadow-[20px_0_100px_rgba(0,0,0,0.8)]"
        >
          <div className="curtain-fabric" />
          <div className="curtain-folds" />
          <div className="curtain-edge" />
          <div className="curtain-spot absolute w-[800px] h-[800px] bg-red-600/20 blur-[150px] rounded-full pointer-events-none opacity-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
        </div>
        
        {/* правый занавес */}
        <div
          ref={rightCurtainRef}
          onMouseMove={handleCurtainHover}
          onMouseLeave={handleCurtainLeave}
          className="curtain-panel curtain-panel--right pointer-events-auto origin-right shadow-[-20px_0_100px_rgba(0,0,0,0.8)]"
        >
          <div className="curtain-fabric" />
          <div className="curtain-folds curtain-folds--mirror" />
          <div className="curtain-edge curtain-edge--right" />
          <div className="curtain-spot absolute w-[800px] h-[800px] bg-red-600/20 blur-[150px] rounded-full pointer-events-none opacity-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen" />
        </div>
      </div>

      {/* ui поверх всего */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* проценты + полоска */}
              <div className="text-3xl sm:text-4xl font-bounded text-[#E10600] mb-4 tracking-tighter">
                {progress}%
              </div>
              <div className="w-40 sm:w-48 h-[1px] bg-[#F5F7F6]/10 relative">
                <motion.div className="absolute inset-0 bg-[#E10600]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
              </div>
            </motion.div>
          )}
          {/* кнопка "войти" появляется на veil/enter */}
          {(stage === 'veil' || stage === 'enter') && (
            <motion.div
              key="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-28 sm:mt-36 md:mt-52 lg:mt-64" // опускаем кнопку ниже маскота
            >
              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.1, textShadow: '0 0 15px rgba(235,0,0,1)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-7 sm:px-9 md:px-12 py-3 sm:py-4 text-lg sm:text-xl md:text-2xl font-bounded tracking-[0.2em] sm:tracking-widest text-[#F5F7F6] overflow-hidden pointer-events-auto"
              >
                <span className="relative z-10">ВОЙТИ</span>
                <div className="absolute inset-0 border border-[#E10600] opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-[#E10600]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Preloader
