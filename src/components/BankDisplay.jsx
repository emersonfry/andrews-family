import { useState } from 'react'

const CHILD_STYLES = {
  reid: {
    bg: 'bg-[var(--color-reid-light)]',
    border: 'border-[var(--color-reid)]',
    accent: 'text-[var(--color-reid)]',
    ring: 'ring-[var(--color-reid)]',
  },
  bennett: {
    bg: 'bg-[var(--color-bennett-light)]',
    border: 'border-[var(--color-bennett)]',
    accent: 'text-[var(--color-bennett)]',
    ring: 'ring-[var(--color-bennett)]',
  },
  isla: {
    bg: 'bg-[var(--color-isla-light)]',
    border: 'border-[var(--color-isla)]',
    accent: 'text-[var(--color-isla)]',
    ring: 'ring-[var(--color-isla)]',
  },
}

export default function BankDisplay({ child, nintendoMinutes, bonusPoints }) {
  const [wiggle, setWiggle] = useState(false)
  const style = CHILD_STYLES[child.id] || CHILD_STYLES.reid

  return (
    <div
      className={`${style.bg} ${style.border} border-2 rounded-3xl p-5 text-center transition-all hover:scale-[1.02] hover:shadow-lg`}
      onClick={() => {
        setWiggle(true)
        setTimeout(() => setWiggle(false), 500)
      }}
    >
      <div className={`text-4xl mb-2 ${wiggle ? 'animate-wiggle' : ''}`}>
        {child.emoji}
      </div>
      <h3 className={`font-display text-2xl font-bold ${style.accent}`}>
        {child.name}
      </h3>
      <div className="mt-3 space-y-2">
        <div className="bg-white/70 rounded-2xl px-4 py-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            🎮 Nintendo Bank
          </div>
          <div className={`font-display text-3xl font-bold ${style.accent}`}>
            {nintendoMinutes}
            <span className="text-base font-body font-normal text-gray-500"> min</span>
          </div>
        </div>
        <div className="bg-white/70 rounded-2xl px-4 py-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            ⭐ Bonus Points
          </div>
          <div className={`font-display text-3xl font-bold ${style.accent}`}>
            {bonusPoints}
          </div>
        </div>
      </div>
    </div>
  )
}
