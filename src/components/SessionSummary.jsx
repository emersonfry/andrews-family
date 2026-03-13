export default function SessionSummary({
  child,
  scorePercent,
  minutesEarned,
  bonusPointsEarned,
  totalMinutes,
  totalPoints,
  isWeekend,
  threshold,
  onContinue,
  bankConfig,
}) {
  const colorVar = `var(--color-${child.color})`
  const isPerfect = scorePercent === 100
  const meetsThreshold = scorePercent >= threshold
  const bankName = bankConfig?.bankName || 'Nintendo Minutes'
  const unitLabel = bankConfig?.unitLabel || 'min'

  return (
    <div className="text-center animate-slide-up max-w-lg mx-auto">
      <div className="text-6xl mb-3">
        {isPerfect ? '🎉' : meetsThreshold ? '⭐' : '💛'}
      </div>

      <h2 className="font-display text-3xl md:text-4xl font-bold mb-2" style={{ color: colorVar }}>
        {isPerfect ? 'Perfect Score!' : meetsThreshold ? 'Great job!' : 'Nice work tonight!'}
      </h2>

      <p className="text-gray-500 mb-6">
        {child.name}&apos;s check-in is complete
      </p>

      {/* Score circle */}
      <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 mb-6" style={{ borderColor: colorVar }}>
        <div>
          <div className="font-display text-4xl font-bold" style={{ color: colorVar }}>
            {scorePercent}%
          </div>
          <div className="text-xs text-gray-400 font-semibold">tonight</div>
        </div>
      </div>

      {/* Earnings */}
      <div className="space-y-3 mb-8">
        {!isWeekend && (
          <div className="bg-white/80 rounded-2xl p-4 border border-gray-200">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🎮</span>
              <span className="font-display text-2xl font-bold" style={{ color: colorVar }}>
                {minutesEarned > 0 ? `+${minutesEarned} ${unitLabel} earned!` : `No ${unitLabel} tonight`}
              </span>
            </div>
            {minutesEarned === 0 && (
              <p className="text-sm text-gray-400 mt-1">
                Need {threshold}% to earn {unitLabel} — you&apos;ll get there! 💪
              </p>
            )}
          </div>
        )}

        {bonusPointsEarned > 0 && (
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">⭐</span>
              <span className="font-display text-2xl font-bold text-amber-600">
                +{bonusPointsEarned} bonus point!
              </span>
            </div>
          </div>
        )}

        {/* Bank totals */}
        <div className="bg-white/60 rounded-2xl p-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            {child.name}&apos;s Bank
          </h4>
          <div className="flex justify-center gap-8">
            {!isWeekend && (
              <div>
                <div className="text-2xl">🎮</div>
                <div className="font-display text-2xl font-bold" style={{ color: colorVar }}>
                  {totalMinutes}
                </div>
                <div className="text-xs text-gray-400">{unitLabel} this week</div>
              </div>
            )}
            <div>
              <div className="text-2xl">⭐</div>
              <div className="font-display text-2xl font-bold" style={{ color: colorVar }}>
                {totalPoints}
              </div>
              <div className="text-xs text-gray-400">bonus points</div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onContinue}
        className="touch-target text-white font-display text-xl font-bold px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
        style={{ backgroundColor: colorVar }}
      >
        Continue ➡️
      </button>
    </div>
  )
}
