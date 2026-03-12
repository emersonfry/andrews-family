import { useState } from 'react'

export default function AdminPanel({ config, appData, onBack }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  const [activeTab, setActiveTab] = useState('questions')
  const [editConfig, setEditConfig] = useState(null)

  // Question editing state
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [editChildId, setEditChildId] = useState('reid')
  const [editDayType, setEditDayType] = useState('weekday')

  // Reward editing state
  const [editingReward, setEditingReward] = useState(null)
  const [newRewardName, setNewRewardName] = useState('')
  const [newRewardCost, setNewRewardCost] = useState(2)
  const [newRewardEmoji, setNewRewardEmoji] = useState('🎁')

  // Settings state
  const [newPin, setNewPin] = useState('')
  const [settingsSaved, setSettingsSaved] = useState(false)

  const handleLogin = () => {
    if (pinInput === config.pin) {
      setAuthenticated(true)
      setEditConfig(JSON.parse(JSON.stringify(config)))
      setPinError(false)
    } else {
      setPinError(true)
    }
  }

  const saveChanges = (updated) => {
    appData.saveConfig(updated)
    setEditConfig(updated)
  }

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto text-center animate-slide-up">
        <button
          onClick={onBack}
          className="touch-target mb-6 px-4 py-2 rounded-full border-2 border-gray-300 text-gray-500 font-semibold hover:bg-gray-50"
        >
          ← Back
        </button>
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="font-display text-2xl font-bold text-gray-700 mb-6">
          Parent Access
        </h2>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pinInput}
          onChange={(e) => { setPinInput(e.target.value); setPinError(false) }}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Enter PIN"
          className={`w-full text-center text-3xl font-mono py-4 rounded-xl border-2 mb-4 ${
            pinError ? 'border-red-300 bg-red-50' : 'border-gray-200'
          }`}
          autoFocus
        />
        {pinError && <p className="text-red-400 text-sm mb-4">Incorrect PIN</p>}
        <button
          onClick={handleLogin}
          className="touch-target w-full bg-jewel-600 text-white font-bold py-3 rounded-xl hover:bg-jewel-700 transition-all"
        >
          Enter →
        </button>
      </div>
    )
  }

  const tabs = [
    { id: 'questions', label: '📋 Questions' },
    { id: 'rewards', label: '🎁 Rewards' },
    { id: 'balances', label: '💰 Balances' },
    { id: 'settings', label: '⚙️ Settings' },
  ]

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="touch-target px-4 py-2 rounded-full border-2 border-gray-300 text-gray-500 font-semibold hover:bg-gray-50"
        >
          ← Back
        </button>
        <h2 className="font-display text-2xl font-bold text-gray-700">
          Admin Panel 🔧
        </h2>
        <div className="w-20" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`touch-target px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-jewel-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Questions Tab */}
      {activeTab === 'questions' && editConfig && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            {config.children.map(child => (
              <button
                key={child.id}
                onClick={() => setEditChildId(child.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  editChildId === child.id
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {child.emoji} {child.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            {['weekday', 'weekend'].map(dt => (
              <button
                key={dt}
                onClick={() => setEditDayType(dt)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  editDayType === dt
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dt === 'weekday' ? '📅 Weekday' : '🌈 Weekend'}
              </button>
            ))}
          </div>

          {editConfig.questions[editChildId]?.[editDayType]?.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-xl p-4 border border-gray-200">
              {editingQuestion === q.id ? (
                <div className="space-y-3">
                  <input
                    value={q.text}
                    onChange={(e) => {
                      const updated = { ...editConfig }
                      updated.questions[editChildId][editDayType][idx].text = e.target.value
                      setEditConfig({ ...updated })
                    }}
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  <div className="text-xs text-gray-400">Type: {q.type}</div>
                  {q.labels && q.labels.map((label, li) => (
                    <input
                      key={li}
                      value={label}
                      onChange={(e) => {
                        const updated = { ...editConfig }
                        updated.questions[editChildId][editDayType][idx].labels[li] = e.target.value
                        setEditConfig({ ...updated })
                      }}
                      className="w-full p-2 border rounded-lg text-xs"
                    />
                  ))}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        saveChanges(editConfig)
                        setEditingQuestion(null)
                      }}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditConfig(JSON.parse(JSON.stringify(config)))
                        setEditingQuestion(null)
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{q.text}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {q.type === 'five_point' ? '5-point scale' : q.type === 'three_emoji' ? '3-emoji scale' : 'Yes / Not Yet'}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingQuestion(q.id)}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && editConfig && (
        <div className="space-y-4">
          {editConfig.rewards.map((reward, idx) => (
            <div key={reward.id} className="bg-white rounded-xl p-4 border border-gray-200">
              {editingReward === reward.id ? (
                <div className="space-y-3">
                  <input
                    value={reward.name}
                    onChange={(e) => {
                      const updated = { ...editConfig }
                      updated.rewards[idx].name = e.target.value
                      setEditConfig({ ...updated })
                    }}
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      value={reward.emoji}
                      onChange={(e) => {
                        const updated = { ...editConfig }
                        updated.rewards[idx].emoji = e.target.value
                        setEditConfig({ ...updated })
                      }}
                      className="w-16 p-2 border rounded-lg text-center"
                    />
                    <input
                      type="number"
                      value={reward.cost}
                      onChange={(e) => {
                        const updated = { ...editConfig }
                        updated.rewards[idx].cost = parseInt(e.target.value) || 1
                        setEditConfig({ ...updated })
                      }}
                      className="w-20 p-2 border rounded-lg text-center"
                      min={1}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { saveChanges(editConfig); setEditingReward(null) }}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditConfig(JSON.parse(JSON.stringify(config))); setEditingReward(null) }}
                      className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg text-sm font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const updated = { ...editConfig }
                        updated.rewards = updated.rewards.filter(r => r.id !== reward.id)
                        saveChanges(updated)
                        setEditingReward(null)
                      }}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reward.emoji}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{reward.name}</div>
                      <div className="text-sm text-amber-600 font-bold">⭐ {reward.cost} pts</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingReward(reward.id)}
                    className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add new reward */}
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300">
            <h4 className="font-semibold text-gray-600 text-sm mb-3">Add New Reward</h4>
            <div className="space-y-2">
              <input
                value={newRewardName}
                onChange={(e) => setNewRewardName(e.target.value)}
                placeholder="Reward name"
                className="w-full p-2 border rounded-lg text-sm"
              />
              <div className="flex gap-2">
                <input
                  value={newRewardEmoji}
                  onChange={(e) => setNewRewardEmoji(e.target.value)}
                  className="w-16 p-2 border rounded-lg text-center"
                  placeholder="🎁"
                />
                <input
                  type="number"
                  value={newRewardCost}
                  onChange={(e) => setNewRewardCost(parseInt(e.target.value) || 1)}
                  className="w-20 p-2 border rounded-lg text-center"
                  min={1}
                  placeholder="Cost"
                />
                <button
                  onClick={() => {
                    if (!newRewardName.trim()) return
                    const updated = { ...editConfig }
                    const maxId = Math.max(0, ...updated.rewards.map(r => r.id))
                    updated.rewards.push({
                      id: maxId + 1,
                      name: newRewardName.trim(),
                      cost: newRewardCost,
                      emoji: newRewardEmoji || '🎁',
                    })
                    saveChanges(updated)
                    setNewRewardName('')
                    setNewRewardCost(2)
                    setNewRewardEmoji('🎁')
                  }}
                  className="px-4 py-2 bg-jewel-600 text-white rounded-lg text-sm font-semibold hover:bg-jewel-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balances Tab */}
      {activeTab === 'balances' && (
        <div className="space-y-4">
          {config.children.map(child => (
            <div key={child.id} className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="font-display text-lg font-bold text-gray-800 mb-3">
                {child.emoji} {child.name}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                    🎮 Nintendo Minutes
                  </label>
                  <input
                    type="number"
                    value={appData.getNintendoMinutes(child.id)}
                    onChange={(e) => appData.setBalanceDirect(child.id, 'nintendoMinutes', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded-lg text-center font-bold text-lg"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                    ⭐ Bonus Points
                  </label>
                  <input
                    type="number"
                    value={appData.getBonusPoints(child.id)}
                    onChange={(e) => appData.setBalanceDirect(child.id, 'bonusPoints', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border rounded-lg text-center font-bold text-lg"
                    min={0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && editConfig && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Change PIN</h4>
            <div className="flex gap-2">
              <input
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="New PIN"
                className="flex-1 p-2 border rounded-lg text-center font-mono text-lg"
                maxLength={6}
              />
              <button
                onClick={() => {
                  if (newPin.length >= 4) {
                    const updated = { ...editConfig, pin: newPin }
                    saveChanges(updated)
                    setNewPin('')
                    setSettingsSaved(true)
                    setTimeout(() => setSettingsSaved(false), 2000)
                  }
                }}
                className="px-4 py-2 bg-jewel-600 text-white rounded-lg font-semibold"
              >
                Update
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">Earning Threshold</h4>
            <p className="text-sm text-gray-500 mb-2">Minimum score % to earn Nintendo minutes</p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={100}
                step={5}
                value={editConfig.earningThreshold}
                onChange={(e) => {
                  const updated = { ...editConfig, earningThreshold: parseInt(e.target.value) }
                  setEditConfig(updated)
                  saveChanges(updated)
                }}
                className="flex-1"
              />
              <span className="font-bold text-lg w-12 text-center">{editConfig.earningThreshold}%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">Fair Rotation</h4>
                <p className="text-sm text-gray-500">Ensure fair spinner rotation</p>
              </div>
              <button
                onClick={() => {
                  const updated = { ...editConfig, fairRotation: !editConfig.fairRotation }
                  setEditConfig(updated)
                  saveChanges(updated)
                }}
                className={`w-14 h-8 rounded-full transition-all ${
                  editConfig.fairRotation ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  editConfig.fairRotation ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {settingsSaved && (
            <div className="text-center text-emerald-600 font-semibold animate-fade-in">
              ✓ Settings saved!
            </div>
          )}
        </div>
      )}
    </div>
  )
}
