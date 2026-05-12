import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { PageShell } from '../components/PageShell'

const CookiePolicyPage = () => {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    })
    lenisRef.current = lenis

    const onTick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(onTick)

    return () => {
      lenis.destroy()
      lenisRef.current = null
      gsap.ticker.remove(onTick)
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#080808] text-[#F5F7F6] selection:bg-[#E10600] selection:text-[#F5F7F6] flex flex-col">
      <Header />

      <div className="flex-1 min-w-0 bg-[#080808] border-b border-[#F5F7F6]/10 pb-20 pt-32 sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-48">
        <PageShell>
          <div className="max-w-3xl mx-auto">
            <p className="mb-4 font-['Bounded'] text-[10px] uppercase tracking-[0.45em] text-[#E10600] sm:text-xs sm:tracking-[0.5em]">
              ПРАВИЛА И УСЛОВИЯ
            </p>
            <h1 className="font-bounded text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tighter mb-12 sm:mb-16">
              ПОЛИТИКА COOKIE
            </h1>

            <div className="space-y-12 sm:space-y-16 text-[#F5F7F6]/60 text-sm sm:text-base font-light leading-relaxed">
              
              <section>
                <h2 className="font-bounded text-xl sm:text-2xl uppercase tracking-tight text-[#F5F7F6] mb-4 sm:mb-6">
                  1. Что такое файлы cookie?
                </h2>
                <p className="mb-4">
                  Файлы cookie (куки) — это небольшие текстовые файлы, которые сохраняются на вашем устройстве (компьютере, планшете или смартфоне) при посещении нашего сайта. Мы также используем схожие технологии, такие как Local Storage и Session Storage, для обеспечения корректной работы сайта и сохранения ваших настроек.
                </p>
              </section>

              <section>
                <h2 className="font-bounded text-xl sm:text-2xl uppercase tracking-tight text-[#F5F7F6] mb-4 sm:mb-6">
                  2. Как мы используем данные
                </h2>
                <p className="mb-6">
                  Наш сайт использует минимальное количество данных исключительно для обеспечения базового функционала и удобства взаимодействия с интерфейсом. Мы не передаем эти данные третьим лицам и не используем их для рекламного отслеживания.
                </p>

                <div className="overflow-x-auto border border-[#F5F7F6]/10 rounded-lg bg-[#F5F7F6]/[0.02]">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-[#F5F7F6]/10 font-bounded text-[10px] sm:text-xs tracking-widest uppercase text-[#E10600]">
                        <th className="p-4 sm:p-5 font-normal">Название / Ключ</th>
                        <th className="p-4 sm:p-5 font-normal">Назначение</th>
                        <th className="p-4 sm:p-5 font-normal">Тип данных</th>
                        <th className="p-4 sm:p-5 font-normal">Срок хранения</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs sm:text-sm divide-y divide-white/5">
                      <tr className="hover:bg-[#F5F7F6]/[0.02] transition-colors">
                        <td className="p-4 sm:p-5 font-mono text-[#F5F7F6]/80">vv-cookie-consent</td>
                        <td className="p-4 sm:p-5">Запоминает ваш выбор (согласие или отказ) в баннере использования файлов cookie, чтобы не показывать его повторно.</td>
                        <td className="p-4 sm:p-5">Local Storage</td>
                        <td className="p-4 sm:p-5">30 дней</td>
                      </tr>
                      <tr className="hover:bg-[#F5F7F6]/[0.02] transition-colors">
                        <td className="p-4 sm:p-5 font-mono text-[#F5F7F6]/80">vv-preloader-done</td>
                        <td className="p-4 sm:p-5">Отслеживает, был ли показан стартовый загрузочный экран, чтобы не проигрывать длинную анимацию при каждом переходе по страницам.</td>
                        <td className="p-4 sm:p-5">Local Storage</td>
                        <td className="p-4 sm:p-5">24 часа</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="font-bounded text-xl sm:text-2xl uppercase tracking-tight text-[#F5F7F6] mb-4 sm:mb-6">
                  3. Управление файлами cookie
                </h2>
                <p className="mb-4">
                  Вы можете в любой момент изменить настройки своего браузера, чтобы блокировать использование файлов cookie или удалять уже сохраненные данные. Обратите внимание, что при очистке локального хранилища (Local Storage) сайт снова покажет вам стартовую анимацию и баннер согласия.
                </p>
                <p>
                  Для быстрого сброса настроек на нашем сайте вы можете нажать клавишу <kbd className="px-2 py-1 bg-[#F5F7F6]/10 rounded font-mono text-[#F5F7F6] text-xs border border-[#F5F7F6]/20 mx-1">[</kbd> (на английской раскладке).
                </p>
              </section>

              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 font-['Bounded'] text-[11px] sm:text-[13px] uppercase tracking-[0.28em] text-[#F5F7F6]/50 transition-colors hover:text-[#E10600]"
              >
                <span className="inline-block rotate-180">←</span> На главную
              </Link>
            </div>
          </div>
        </PageShell>
      </div>

      <Footer />
    </main>
  )
}

export default CookiePolicyPage
