import { Fragment, type ReactNode } from 'react'

/**
 * Подсвечивает заданные слова в строке (цвет бренда по умолчанию).
 * Пример: highlightWords('Стиль как база', ['Стиль', 'база'])
 */
export function highlightWords(
  text: string,
  words: string[],
  accentClass = 'text-[#E10600]'
): ReactNode {
  if (!words.length) return text

  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${escaped.join('|')})`, 'gi')
  const parts = text.split(re)

  return parts.map((part, i) => {
    const isMatch = words.some((w) => w.toLowerCase() === part.toLowerCase())
    if (isMatch) {
      return (
        <span key={i} className={accentClass}>
          {part}
        </span>
      )
    }
    return <Fragment key={i}>{part}</Fragment>
  })
}
