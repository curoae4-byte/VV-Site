/**
 * изогнутая стрелка к иконке Instagram + дисклеймер (Meta признана экстремистской в РФ).
 */
export function InstagramBannedNote() {
  return (
    <div className="flex w-full flex-col items-center">
      <svg
        className="h-11 w-7 shrink-0 text-[#E10600] drop-shadow-[0_0_12px_rgba(235,0,0,0.35)]"
        viewBox="0 0 28 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M14 50 C14 34 6 22 6 14 C6 8 10 4 14 2"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M9 5 L14 1 L19 5"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="max-w-[7.5rem] text-center font-['Bounded'] text-[7px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#E10600] sm:max-w-[8.5rem] sm:text-[8px] sm:tracking-[0.16em]">
        ЗАПРЕЩЕНО В РФ
      </p>
    </div>
  )
}
