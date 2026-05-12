import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { createPortal } from 'react-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CookieBanner from '../components/CookieBanner'
import { PageShell } from '../components/PageShell'
import CustomVideoPlayer from '../components/CustomVideoPlayer'
import { worksProjects, type WorkProject } from '../data/worksProjects'

gsap.registerPlugin(ScrollTrigger)

// Углы наклона марки на листе рандомные
const STAMP_ROTATIONS_DEG = [-5.5, 3.8, -2.4, 6.2, -4.1, 2.6, -3.3, 4.4] as const

type WorksProjectCardProps = {
  project: WorkProject
  index: number
  isActive: boolean
  onActivate: () => void
  onDeactivate: () => void
  onOpen: () => void
  stampRotate: number
}

// Наклон от курсора 
const WorksProjectCard = ({
  project,
  index,
  isActive,
  onActivate,
  onDeactivate,
  onOpen,
  stampRotate,
}: WorksProjectCardProps) => {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const mouseXSpring = useSpring(mx, { stiffness: 260, damping: 38, restDelta: 0.0005 })
  const mouseYSpring = useSpring(my, { stiffness: 260, damping: 38, restDelta: 0.0005 })

  // Лёгкий наклон
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['-2.5deg', '2.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['2.5deg', '-2.5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const normalizedX = (mouseX / w - 0.5) * 2
    const normalizedY = (mouseY / h - 0.5) * 2
    mx.set((-normalizedX) / 2)
    my.set((-normalizedY) / 2)
  }

  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
    onDeactivate()
  }

  return (
    <motion.article
      className="group relative overflow-hidden rounded-sm border border-[#F5F7F6]/[0.09] bg-[#111] shadow-[0_8px_40px_rgba(0,0,0,0.55)] [perspective:1000px] cursor-pointer"
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      initial={false}
      animate={
        isActive
          ? {
              y: -8,
              scale: 1.02,
              boxShadow:
                '0 28px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(235,0,0,0.15)',
            }
          : {
              y: 0,
              scale: 1,
              boxShadow: '0 8px 40px rgba(0,0,0,0.55)',
            }
      }
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 36,
        mass: 0.85,
        bounce: 0,
      }}
      onMouseEnter={onActivate}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* Марка типа наклейка с фото */}
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <div
          className="relative border-[4px] border-[#F5F7F6] bg-[#F5F7F6] p-0.5 shadow-[12px_15px_40px_rgba(0,0,0,0.5)]"
          style={{
            transform: `rotate(${stampRotate}deg)`,
          }}
        >
          {/* Main Image (background) */}
          <div className="overflow-hidden h-16 w-16 sm:h-28 sm:w-28">
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover grayscale sepia-[0.1] contrast-[1.1]"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div
        id={`project-${project.id}`}
        className="relative z-10 px-5 pb-8 pt-7 pr-28 sm:px-8 sm:pb-10 sm:pt-9 sm:pr-36"
        style={{
          transform: 'translateZ(28px)',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        <p className="mb-2 font-['Bounded'] text-[10px] uppercase tracking-[0.35em] text-[#E10600]/90">
          {String(index + 1).padStart(2, '0')}.
        </p>
        <p className="mb-3 max-w-[85%] font-['Bounded'] text-[11px] leading-relaxed text-[#F5F7F6]/45 sm:text-sm">
          {project.tagline}
        </p>
        <h2 className="font-bounded text-[clamp(1.35rem,3.8vw,2.75rem)] leading-[0.98] tracking-tighter transition-colors duration-300 group-hover:text-[#E10600]">
          {project.title}
        </h2>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 font-['Bounded'] text-[9px] uppercase tracking-[0.16em] text-[#F5F7F6]/30 sm:mt-8 sm:grid-cols-4 sm:text-[10px] sm:tracking-[0.2em]">
          <div>
            <dt className="mb-1 text-[#E10600]/80">Клиент</dt>
            <dd className="text-[#F5F7F6]/50">{project.client}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[#E10600]/80">Тип</dt>
            <dd className="text-[#F5F7F6]/50">{project.type}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[#E10600]/80">Агентство</dt>
            <dd className="text-[#F5F7F6]/50">{project.agency}</dd>
          </div>
          <div>
            <dt className="mb-1 text-[#E10600]/80">Дата</dt>
            <dd className="text-[#F5F7F6]/50">{project.release}</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#F5F7F6]/10 pt-5 sm:mt-8">
          <span className="font-['Bounded'] text-[9px] uppercase tracking-[0.22em] text-[#F5F7F6]/25 sm:text-[10px]">
            {project.category}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#F5F7F6]/12 text-[#F5F7F6]/35 transition-all duration-300 group-hover:border-[#E10600] group-hover:bg-[#E10600] group-hover:text-black sm:h-10 sm:w-10">
            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </motion.article>
  )
}

/**
 * Страница портфолио, карточки в колонку на всю ширину PageShell,
 * наклон карточки от курсора как на главной стр
 */
const PortfolioWorksPage = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null)
  const [modalPhase, setModalPhase] = useState<'idle' | 'lettersIn' | 'lettersOut' | 'video'>('idle')
  const lenisRef = useRef<Lenis | null>(null)
  const phaseTimersRef = useRef<number[]>([])

  const clearPhaseTimers = () => {
    phaseTimersRef.current.forEach((id) => window.clearTimeout(id))
    phaseTimersRef.current = []
  }

  const openProject = (project: WorkProject) => {
    clearPhaseTimers()
    setSelectedProject(project)
    setModalPhase('lettersIn')

    const outTimer = window.setTimeout(() => {
      setModalPhase('lettersOut')
    }, 900)

    const videoTimer = window.setTimeout(() => {
      setModalPhase('video')
    }, 1500)

    phaseTimersRef.current.push(outTimer, videoTimer)
  }

  const closeProject = () => {
    clearPhaseTimers()
    setModalPhase('idle')
    setSelectedProject(null)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    const lenis = new Lenis({
      duration: 1.55,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 0.95,
      syncTouch: true,
    })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove(onTick)
    }
  }, [])

  useEffect(() => {
    return () => {
      clearPhaseTimers()
    }
  }, [])

  useEffect(() => {
    if (!selectedProject) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProject()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedProject])

  useEffect(() => {
    if (!selectedProject) return

    const scrollY = window.scrollY
    const prevBodyOverflow = document.body.style.overflow
    const prevBodyPosition = document.body.style.position
    const prevBodyTop = document.body.style.top
    const prevBodyWidth = document.body.style.width
    const prevHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    document.documentElement.style.overflow = 'hidden'

    const preventDefault = (e: Event) => {
      e.preventDefault()
    }

    const preventScrollKeys = (e: KeyboardEvent) => {
      const blocked = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar']
      if (blocked.includes(e.key)) e.preventDefault()
    }

    window.addEventListener('wheel', preventDefault, { passive: false })
    window.addEventListener('touchmove', preventDefault, { passive: false })
    window.addEventListener('keydown', preventScrollKeys)

    const onFullscreenChange = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)

    return () => {
      window.removeEventListener('wheel', preventDefault)
      window.removeEventListener('touchmove', preventDefault)
      window.removeEventListener('keydown', preventScrollKeys)
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.body.style.overflow = prevBodyOverflow
      document.body.style.position = prevBodyPosition
      document.body.style.top = prevBodyTop
      document.body.style.width = prevBodyWidth
      document.documentElement.style.overflow = prevHtmlOverflow
      window.scrollTo(0, scrollY)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }
  }, [selectedProject])

  useEffect(() => {
    const shouldUseNativeCursor = Boolean(selectedProject && modalPhase === 'video')
    document.body.classList.toggle('video-modal-open', shouldUseNativeCursor)

    return () => {
      document.body.classList.remove('video-modal-open')
    }
  }, [selectedProject, modalPhase])

  const modalContent = (
    <AnimatePresence>
      {selectedProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeProject()
          }}
        >
          <AnimatePresence mode="wait">
            {modalPhase !== 'video' ? (
              <motion.div
                key="letters"
                className="pointer-events-none flex max-w-[92vw] flex-wrap items-center justify-center gap-x-[0.04em] gap-y-1 text-center font-bounded text-[clamp(2rem,10vw,7rem)] uppercase leading-[0.9] text-[#F5F7F6]"
              >
                {Array.from(selectedProject.title).map((char, index) => (
                  <motion.span
                    key={`${index}-${char}`}
                    initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                    animate={
                      modalPhase === 'lettersOut'
                        ? { opacity: 0, y: -20, filter: 'blur(6px)' }
                        : { opacity: 1, y: 0, filter: 'blur(0px)' }
                    }
                    transition={{
                      duration: 0.42,
                      delay: index * 0.026,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="video"
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.98, opacity: 0 }}
                className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden bg-black border border-[#F5F7F6]/10 shadow-2xl"
              >
                <CustomVideoPlayer 
                  url={selectedProject.video} 
                  title={selectedProject.title}
                  onClose={closeProject}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <main className="min-h-screen bg-[#080808] text-[#F5F7F6] selection:bg-[#E10600] selection:text-[#F5F7F6]">
      <Header />

      <div className="min-w-0 bg-[#080808]">
        {/* вступление */}
        <section className="border-b border-[#F5F7F6]/10 pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
          <PageShell>
          <div className="max-w-[900px]">
            <p className="mb-4 font-['Bounded'] text-[10px] uppercase tracking-[0.45em] text-[#E10600] sm:text-xs sm:tracking-[0.5em]">
              ОЦЕНИШЬ?
            </p>
            <h1 className="font-bounded font-black text-[clamp(2rem,6vw,4.25rem)] leading-[0.95] tracking-tighter">
              ПОРТФОЛИО
            </h1>
            <p className="mt-6 max-w-2xl font-['Bounded'] text-sm leading-relaxed text-[#F5F7F6]/45 sm:text-base">
              Каждый проект — отдельная карточка.
            </p>
            <Link
              to="/"
              className="mt-10 inline-flex items-center gap-2 font-['Bounded'] text-[13px] uppercase tracking-[0.28em] text-[#F5F7F6]/50 transition-colors hover:text-[#E10600]"
            >
              <span className="inline-block rotate-180">←</span> На главную
            </Link>
          </div>
          </PageShell>
        </section>

        {/* Карточки */}
        <section className="pb-28 pt-10 sm:pb-32">
          <PageShell>
          <div
            className="w-full [perspective:1400px]"
            onMouseLeave={() => setHoveredId(null)}
          >
            <ul className="relative flex flex-col gap-8 sm:gap-10 lg:gap-12">
              {worksProjects.map((project, index) => {
                const isActive = hoveredId === project.id
                const stampRotate =
                  STAMP_ROTATIONS_DEG[index % STAMP_ROTATIONS_DEG.length]

                return (
                  <motion.li
                    key={project.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-6%' }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                    style={{
                      zIndex: isActive ? 20 : 1,
                    }}
                  >
                    <WorksProjectCard
                      project={project}
                      index={index}
                      isActive={isActive}
                      onActivate={() => setHoveredId(project.id)}
                      onDeactivate={() => setHoveredId(null)}
                      onOpen={() => openProject(project)}
                      stampRotate={stampRotate}
                    />
                  </motion.li>
                )
              })}
            </ul>
          </div>
          </PageShell>
        </section>
      </div>

      <Footer />
      {typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null}

      {/* SVG Filters for Lens Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="glass-lens-distortion">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="100" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <CookieBanner />
    </main>
  )
}

export default PortfolioWorksPage
