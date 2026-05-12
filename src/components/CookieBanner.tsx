import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { X } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'vv-cookie-consent'

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Проверяем, давал ли пользователь уже согласие
    const itemStr = localStorage.getItem(COOKIE_CONSENT_KEY)
    let hasConsented = false

    if (itemStr) {
      try {
        const item = JSON.parse(itemStr)
        if (Date.now() < item.expiry) {
          hasConsented = true
        } else {
          localStorage.removeItem(COOKIE_CONSENT_KEY)
        }
      } catch (e) {
        // Поддержка старого формата, если он был
        if (itemStr === 'accepted' || itemStr === 'declined') {
          hasConsented = true
        }
      }
    }

    if (!hasConsented) {
      // Небольшая задержка перед показом для плавности
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const setConsent = (value: string) => {
    const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 дней в миллисекундах
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({ value, expiry }))
    setIsVisible(false)
  }

  const handleAccept = () => setConsent('accepted')
  const handleDecline = () => setConsent('declined')

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-4 right-4 z-[9000] max-w-sm sm:bottom-8 sm:right-8"
        >
          <div className="relative overflow-hidden rounded-xl border border-[#F5F7F6]/10 bg-black/80 p-6 backdrop-blur-xl shadow-2xl">
            {/* Декоративный шум */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-0" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: '180px 180px',
              }}
            />

            <button 
              onClick={handleDecline}
              className="absolute top-4 right-4 text-[#F5F7F6]/40 hover:text-[#F5F7F6] transition-colors z-10"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="relative z-10">
              <h3 className="font-bounded text-sm uppercase tracking-widest text-[#E10600] mb-2">
                Cookie Files
              </h3>
              <p className="text-[#F5F7F6]/60 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                Мы используем файлы cookie для улучшения работы сайта и аналитики. Оставаясь с нами, вы соглашаетесь с их использованием. Подробнее в{' '}
                <Link to="/cookie-policy" className="text-[#F5F7F6] hover:text-[#E10600] underline underline-offset-4 decoration-[#F5F7F6]/30 hover:decoration-[#E10600] transition-colors">
                  политике обработки cookie
                </Link>.
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 bg-[#E10600] hover:bg-[#F5F7F6] text-black font-bounded text-[10px] sm:text-xs uppercase tracking-widest py-3 px-4 rounded-sm transition-colors duration-300"
                >
                  Принять
                </button>
                <button
                  onClick={handleDecline}
                  className="flex-1 bg-transparent border border-[#F5F7F6]/20 hover:border-[#F5F7F6] text-[#F5F7F6] font-bounded text-[10px] sm:text-xs uppercase tracking-widest py-3 px-4 rounded-sm transition-colors duration-300"
                >
                  Отклонить
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CookieBanner
