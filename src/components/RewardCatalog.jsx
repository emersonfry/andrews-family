import { useState } from 'react'

export default function RewardCatalog({ config, appData, onBack }) {
  const [selectedChild, setSelectedChild] = useState(null)
  const [confirmReward, setConfirmReward] = useState(null)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  const [redeemed, setRedeemed] = useState(null)

  const children = config.children || []
  const rewards = config.rewards || []

  const handleRedeem = (reward) => {
    if (!selectedChild) return
    setConfirmReward(reward)
    setPinInput('')
    setPinError(false)
  }

  const handleConfirm = () => {
    if (pinInput !== config.pin) {
      setPinError(true)
      return
    }

    const success = appData.spendBonusPoints(selectedChild.id, confirmReward.cost)
    if (success) {
      setRedeemed(confirmReward)
      setTimeout(() => setRedeemed(null), 3000)
    }
    setConfirmReward(null)
    setPinInput('')
  }

  return (
    <div className="animate-slide-up max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="touch-target px-4 py-2 rounded-full border-2 border-gray-300 text-gray-500 font-semibold hover:bg-gray-50 transition-all"
        >
          ← Back
        </button>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-jewel-800">
          Reward Store ⭐
        </h2>
        <div className="w-20" />
      </div>

      {/* Child selector */}
      <div className="flex justify-center gap-3 mb-8">
        {children.map(child => {
          const isActive = selectedChild?.id === child.id
          return (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`touch-target px-5 py-3 rounded-2xl border-2 font-display text-lg font-bold transition-all ${
                isActive
                  ? 'shadow-md scale-105'
                  : 'border-gray-200 bg-white hover:shadow-sm'
              }`}
              style={isActive ? {
                borderColor: `var(--color-${child.color})`,
                backgroundColor: `var(--color-${child.color}-light)`,
                color: `var(--color-${child.color})`,
              } : {}}
            >
              {child.emoji} {child.name}
              {isActive && (
                <span className="ml-2 text-sm">
                  ({appData.getBonusPoints(child.id)} pts)
                </span>
              )}
            </button>
          )
        })}
      </div>

      {!selectedChild && (
        <p className="text-center text-gray-400 text-lg">
          Pick who&apos;s shopping! ☝️
        </p>
      )}

      {selectedChild && (
        <div className="space-y-3">
          {rewards.map(reward => {
            const canAfford = appData.getBonusPoints(selectedChild.id) >= reward.cost
            return (
              <div
                key={reward.id}
                className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border-2 bg-white transition-all ${
                  canAfford ? 'border-gray-200 hover:shadow-md' : 'border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{reward.emoji}</span>
                  <div>
                    <div className="font-semibold text-gray-800 text-lg">{reward.name}</div>
                    <div className="text-sm text-amber-600 font-bold">⭐ {reward.cost} points</div>
                  </div>
                </div>
                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford}
                  className={`touch-target px-5 py-2 rounded-full font-bold transition-all ${
                    canAfford
                      ? 'bg-amber-400 hover:bg-amber-500 text-white hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Get it!' : 'Need more'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Redeemed toast */}
      {redeemed && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-xl font-display text-xl font-bold animate-slide-up z-50">
          🎉 {redeemed.emoji} Redeemed!
        </div>
      )}

      {/* Confirm modal */}
      {confirmReward && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setConfirmReward(null)}>
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{confirmReward.emoji}</div>
              <h3 className="font-display text-xl font-bold text-gray-800">
                {confirmReward.name}
              </h3>
              <p className="text-amber-600 font-bold mt-1">⭐ {confirmReward.cost} points</p>
            </div>

            <p className="text-center text-gray-500 text-sm mb-4">
              Parent: enter PIN to confirm
            </p>

            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value)
                setPinError(false)
              }}
              placeholder="PIN"
              className={`w-full text-center text-2xl font-mono py-3 rounded-xl border-2 mb-3 ${
                pinError ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
            />

            {pinError && (
              <p className="text-red-400 text-sm text-center mb-3">Incorrect PIN</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReward(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-500 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all"
              >
                Confirm ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
