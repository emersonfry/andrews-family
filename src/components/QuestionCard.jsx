import { useState } from 'react'
import { MICRO_RESPONSES } from '../data/defaultConfig.js'

// tier: 'high' (top score), 'mid' (middle), 'low' (bottom)
function getRandomResponse(tier) {
  const pool = MICRO_RESPONSES[tier] || MICRO_RESPONSES.mid
  return pool[Math.floor(Math.random() * pool.length)]
}

// Determine tier from selected index and total options
function getTier(selectedIndex, totalOptions) {
  if (selectedIndex === totalOptions - 1) return 'high'
  if (selectedIndex === 0) return 'low'
  return 'mid'
}

function FivePointScale({ question, onAnswer, childColor }) {
  const [selected, setSelected] = useState(null)
  const [showResponse, setShowResponse] = useState(false)
  const [response, setResponse] = useState('')

  const handleSelect = (index) => {
    setSelected(index)
    setResponse(getRandomResponse(getTier(index, question.labels.length)))
    setShowResponse(true)
    setTimeout(() => {
      onAnswer(index + 1, 5) // score is 1-5
    }, 1200)
  }

  const colorVar = `var(--color-${childColor})`
  const lightVar = `var(--color-${childColor}-light)`

  return (
    <div className="space-y-3">
      {question.labels.map((label, i) => {
        const score = i + 1
        const isSelected = selected === i
        return (
          <button
            key={i}
            onClick={() => !selected && selected !== 0 && handleSelect(i)}
            disabled={selected !== null}
            className={`touch-target w-full text-left px-5 py-4 rounded-2xl border-2 transition-all font-body text-base md:text-lg ${
              isSelected
                ? 'border-current shadow-md scale-[1.02]'
                : selected !== null
                ? 'opacity-40 border-gray-200'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm active:scale-[0.98]'
            }`}
            style={isSelected ? { borderColor: colorVar, backgroundColor: lightVar } : {}}
          >
            <div className="flex items-center gap-3">
              <span
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: isSelected ? colorVar : '#cbd5e1' }}
              >
                {score}
              </span>
              <span>{label}</span>
            </div>
          </button>
        )
      })}
      {showResponse && (
        <div className="text-center text-lg font-semibold animate-slide-up py-2" style={{ color: colorVar }}>
          {response}
        </div>
      )}
    </div>
  )
}

function ThreeEmojiScale({ question, onAnswer, childColor }) {
  const [selected, setSelected] = useState(null)
  const [showResponse, setShowResponse] = useState(false)
  const [response, setResponse] = useState('')

  const emojis = ['😢', '😐', '😄']

  const handleSelect = (index) => {
    setSelected(index)
    setResponse(getRandomResponse(getTier(index, 3)))
    setShowResponse(true)
    setTimeout(() => {
      onAnswer(index + 1, 3) // score is 1-3
    }, 1200)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4 md:gap-6">
        {emojis.map((emoji, i) => {
          const isSelected = selected === i
          return (
            <button
              key={i}
              onClick={() => selected === null && handleSelect(i)}
              disabled={selected !== null}
              className={`touch-target flex flex-col items-center gap-2 p-4 md:p-6 rounded-3xl border-3 transition-all ${
                isSelected
                  ? `animate-bounce-select border-[var(--color-${childColor})] bg-[var(--color-${childColor}-light)] shadow-lg`
                  : selected !== null
                  ? 'opacity-30 border-gray-200'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md active:scale-95 bg-white'
              }`}
            >
              <span className="text-5xl md:text-6xl">{emoji}</span>
              <span className="text-xs md:text-sm font-semibold text-gray-600 max-w-[100px] text-center leading-tight">
                {question.labels[i]}
              </span>
            </button>
          )
        })}
      </div>
      {showResponse && (
        <div className="text-center text-lg font-semibold animate-slide-up py-2" style={{ color: `var(--color-${childColor})` }}>
          {response}
        </div>
      )}
    </div>
  )
}

function YesNotYetScale({ onAnswer, childColor }) {
  const [selected, setSelected] = useState(null)
  const [showResponse, setShowResponse] = useState(false)
  const [response, setResponse] = useState('')

  const handleSelect = (isYes) => {
    setSelected(isYes ? 'yes' : 'no')
    setResponse(getRandomResponse(isYes ? 'high' : 'low'))
    setShowResponse(true)
    setTimeout(() => {
      onAnswer(isYes ? 1 : 0, 1) // 1=100%, 0=0%
    }, 1200)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4 md:gap-6">
        <button
          onClick={() => selected === null && handleSelect(true)}
          disabled={selected !== null}
          className={`touch-target flex-1 max-w-[200px] py-6 px-6 rounded-3xl border-3 font-display text-2xl font-bold transition-all ${
            selected === 'yes'
              ? `animate-bounce-select border-[var(--color-${childColor})] bg-[var(--color-${childColor}-light)] shadow-lg`
              : selected !== null
              ? 'opacity-30 border-gray-200'
              : `border-gray-200 hover:border-[var(--color-${childColor})] hover:shadow-md active:scale-95 bg-white`
          }`}
        >
          <span className="text-4xl block mb-1">✅</span>
          Yes!
        </button>
        <button
          onClick={() => selected === null && handleSelect(false)}
          disabled={selected !== null}
          className={`touch-target flex-1 max-w-[200px] py-6 px-6 rounded-3xl border-3 font-display text-2xl font-bold transition-all ${
            selected === 'no'
              ? 'animate-bounce-select border-warm-400 bg-warm-50 shadow-lg'
              : selected !== null
              ? 'opacity-30 border-gray-200'
              : 'border-gray-200 hover:border-warm-400 hover:shadow-md active:scale-95 bg-white'
          }`}
        >
          <span className="text-4xl block mb-1">🌅</span>
          Not yet — tomorrow!
        </button>
      </div>
      {showResponse && (
        <div className="text-center text-lg font-semibold animate-slide-up py-2" style={{ color: `var(--color-${childColor})` }}>
          {response}
        </div>
      )}
    </div>
  )
}

export default function QuestionCard({ question, onAnswer, childColor, intention, previousIntention }) {
  return (
    <div className="animate-slide-up">
      {previousIntention && (
        <div className="mb-4 bg-white/80 rounded-2xl p-4 border-2 border-amber-200">
          <p className="text-sm font-semibold text-amber-700">
            Yesterday you said: &ldquo;{previousIntention}&rdquo; — how did it go?
          </p>
        </div>
      )}

      <h3 className="font-display text-xl md:text-2xl font-bold text-gray-800 mb-6 text-center">
        {question.text}
      </h3>

      {question.type === 'five_point' && (
        <FivePointScale question={question} onAnswer={onAnswer} childColor={childColor} />
      )}
      {question.type === 'three_emoji' && (
        <ThreeEmojiScale question={question} onAnswer={onAnswer} childColor={childColor} />
      )}
      {question.type === 'yes_not_yet' && (
        <YesNotYetScale onAnswer={onAnswer} childColor={childColor} />
      )}
    </div>
  )
}
