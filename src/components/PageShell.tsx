import type { ReactNode } from 'react'

type PageShellProps = {
  children: ReactNode
  /** Дополнительные классы (flex, text-center и т.д.) */
  className?: string
}

/**
 * Единая контентная ширина и горизонтальные поля для всего сайта.
 * max-w-7xl (1280px) + px-4 sm:px-6 lg:px-8 — линия шапки совпадает с секциями.
 */
export function PageShell({ children, className = '' }: PageShellProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`.trim()}>
      {children}
    </div>
  )
}

export default PageShell
