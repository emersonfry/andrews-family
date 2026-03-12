import { useState } from 'react'
import confetti from 'canvas-confetti'
import QuestionCard from './QuestionCard.jsx'
import SessionSummary from './SessionSummary.jsx'

function calculateScore(answers) {
  if (answers.length === 0) return 0
  const totalPercent = answers.reduce((sum, a) => {
    if (a.maxScore === 1) {
      // yes_not_yet: 1=100%, 0=0%
      return sum + (a.rawScore === 1 ? 100 : 0)
    } else if (a.maxScore === 3) {
      // three_emoji: 1=33%, 2=67%, 3=100%
      const pct = Math.round((a.rawScore / a.maxScore) * 100)
      return sum + pct
    } else {
      // five_point: 1=20%, 2=40%, 3=60%, 4=80%, 5=100%
      const pct = Math.round((a.rawScore / a.maxScore) * 100)
      return sum + pct
    }
  }, 0)
  return Math.round(totalPercent / answers.length)
}

function isWeekend() {
  const day = new Date().getDay()
  return day === 0 || day === 6
}

export default function ChildSession({
  child,
  config,
  appData,
  onComplete,
}) {
  const [phase, setPhase] = useState('welcome') // welcome | questions | intention | summary
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [intentionText, setIntentionText] = useState('')
  const [intentionQuestionId, setIntentionQuestionId] = useState(null)

  const weekend = isWeekend()
  const questions = config.questions[child.id]?.[weekend ? 'weekend' : 'weekday'] || []
  const threshold = config.earningThreshold || 80

  const handleAnswer = (rawScore, maxScore) => {
    const question = questions[currentQ]
    const newAnswers = [...answers, { questionId: question.id, rawScore, maxScore }]
    setAnswers(newAnswers)

    // Check for implementation intention trigger
    const recentScores = appData.getRecentScores(child.id, question.id, 2)
    // If scored 2 or 3 out of 5 for 2+ consecutive nights
    const lowScoreStreak = question.type === 'five_point' &&
      rawScore <= 3 && rawScore >= 2 &&
      recentScores.length >= 1 &&
      recentScores.every(s => s >= 2 && s <= 3)

    if (lowScoreStreak) {
      const prevIntention = appData.getIntention(child.id, question.id)
      setIntentionQuestionId(question.id)
      if (currentQ < questions.length - 1) {
        setTimeout(() => {
          setPhase('intention')
        }, 200)
      } else {
        setTimeout(() => {
          setPhase('intention')
        }, 200)
      }
      return
    }

    advanceAfterAnswer(newAnswers)
  }

  const advanceAfterAnswer = (currentAnswers) => {
    if (currentQ < questions.length - 1) {
      setTimeout(() => {
        setCurrentQ(prev => prev + 1)
      }, 200)
    } else {
      finishSession(currentAnswers)
    }
  }

  const handleIntentionSubmit = () => {
    if (intentionText.trim()) {
      appData.saveIntention(child.id, intentionQuestionId, intentionText.trim())
    }
    setIntentionQuestionId(null)
    setIntentionText('')
    setPhase('questions')
    advanceAfterAnswer(answers)
  }

  const handleIntentionSkip = () => {
    setIntentionQuestionId(null)
    setIntentionText('')
    setPhase('questions')
    advanceAfterAnswer(answers)
  }

  const finishSession = (finalAnswers) => {
    const scorePercent = calculateScore(finalAnswers)
    const meetsThreshold = scorePercent >= threshold

    let minutesEarned = 0
    let bonusPointsEarned = 0

    if (weekend) {
      if (meetsThreshold) {
        bonusPointsEarned = 1
      }
    } else {
      if (meetsThreshold) {
        minutesEarned = config.weekdayMinutes || 15
        if (scorePercent === 100) {
          bonusPointsEarned = 1
        }
      }
    }

    // Apply earnings
    if (minutesEarned > 0) appData.addNintendoMinutes(child.id, minutesEarned)
    if (bonusPointsEarned > 0) appData.addBonusPoints(child.id, bonusPointsEarned)

    // Save session
    appData.saveSessionResult(child.id, {
      answers: finalAnswers,
      scorePercent,
      minutesEarned,
      bonusPointsEarned,
      isWeekend: weekend,
    })

    // Confetti on 100%
    if (scorePercent === 100) {
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f49344', '#476de9', '#10b981', '#e879a8', '#fbbf24'],
        })
      }, 300)
    }

    setTimeout(() => {
      setPhase('summary')
    }, 200)

    // Store result for parent to use
    window.__lastSessionResult = {
      scorePercent,
      minutesEarned,
      bonusPointsEarned,
    }
  }

  const colorVar = `var(--color-${child.color})`

  if (phase === 'welcome') {
    return (
      <div className="text-center animate-slide-up max-w-lg mx-auto">
        <div className="text-7xl mb-4">{child.emoji}</div>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3" style={{ color: colorVar }}>
          Hey {child.name}!
        </h2>
        <p className="text-lg text-gray-600 mb-2">
          Let&apos;s see how today went.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          We&apos;re thinking about everything since last night&apos;s check-in.
        </p>
        {weekend && (
          <div className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🌈 Weekend Session — Bonus Points Today!
          </div>
        )}
        <div>
          <button
            onClick={() => setPhase('questions')}
            className="touch-target text-white font-display text-2xl font-bold px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: colorVar }}
          >
            Ready! Let&apos;s go! ✨
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'intention') {
    const prevIntention = appData.getIntention(child.id, intentionQuestionId)
    return (
      <div className="text-center animate-slide-up max-w-lg mx-auto">
        <div className="text-5xl mb-4">💭</div>
        <h3 className="font-display text-2xl font-bold text-gray-800 mb-4">
          What&apos;s the one thing that would make tomorrow a perfect score?
        </h3>
        {prevIntention && (
          <div className="mb-4 bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <p className="text-sm text-amber-700">
              Last time you said: &ldquo;{prevIntention}&rdquo;
            </p>
          </div>
        )}
        <textarea
          value={intentionText}
          onChange={(e) => setIntentionText(e.target.value)}
          placeholder="Type your plan here..."
          className="w-full p-4 rounded-2xl border-2 border-gray-200 focus:border-[var(--color-sunset-400)] focus:outline-none text-lg font-body resize-none h-24 mb-4"
        />
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleIntentionSkip}
            className="touch-target px-6 py-3 rounded-full border-2 border-gray-300 text-gray-500 font-semibold transition-all hover:bg-gray-50"
          >
            Skip
          </button>
          <button
            onClick={handleIntentionSubmit}
            className="touch-target px-8 py-3 rounded-full text-white font-semibold transition-all hover:scale-105"
            style={{ backgroundColor: colorVar }}
          >
            Save my plan! 📝
          </button>
        </div>
      </div>
    )
  }

  if (phase === 'summary') {
    const result = window.__lastSessionResult
    return (
      <SessionSummary
        child={child}
        scorePercent={result.scorePercent}
        minutesEarned={result.minutesEarned}
        bonusPointsEarned={result.bonusPointsEarned}
        totalMinutes={appData.getNintendoMinutes(child.id)}
        totalPoints={appData.getBonusPoints(child.id)}
        isWeekend={weekend}
        threshold={threshold}
        onContinue={onComplete}
      />
    )
  }

  // Questions phase
  const question = questions[currentQ]
  const prevIntention = question ? appData.getIntention(child.id, question.id) : null
  const recentScores = question ? appData.getRecentScores(child.id, question.id, 1) : []
  const showPrevIntention = prevIntention && recentScores.length > 0

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-500">
            Question {currentQ + 1} of {questions.length}
          </span>
          <span className="text-2xl">{child.emoji}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentQ) / questions.length) * 100}%`,
              backgroundColor: colorVar,
            }}
          />
        </div>
      </div>

      <QuestionCard
        key={question.id}
        question={question}
        onAnswer={handleAnswer}
        childColor={child.color}
        previousIntention={showPrevIntention ? prevIntention : null}
      />
    </div>
  )
}
