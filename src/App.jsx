import { useState } from 'react'
import { useAppData } from './hooks/useAppData.js'
import BankDisplay from './components/BankDisplay.jsx'
import Spinner from './components/Spinner.jsx'
import ChildSession from './components/ChildSession.jsx'
import RewardCatalog from './components/RewardCatalog.jsx'
import AdminPanel from './components/AdminPanel.jsx'

export default function App() {
  const appData = useAppData()
  const { config } = appData

  const [screen, setScreen] = useState('home')
  // spinner | session | rewards | admin
  const [sessionOrder, setSessionOrder] = useState([])
  const [currentChildIndex, setCurrentChildIndex] = useState(0)

  const children = config.children || []

  const handleStartCheckin = () => {
    setScreen('spinner')
  }

  const handleOrderDecided = (order) => {
    setSessionOrder(order)
    setCurrentChildIndex(0)
    setScreen('session')
  }

  const handleSessionComplete = () => {
    if (currentChildIndex < sessionOrder.length - 1) {
      setCurrentChildIndex(prev => prev + 1)
    } else {
      setScreen('home')
      setSessionOrder([])
      setCurrentChildIndex(0)
    }
  }

  const isWeekend = () => {
    const day = new Date().getDay()
    return day === 0 || day === 6
  }

  return (
    <div className="min-h-screen pb-8">
      {/* Home Screen */}
      {screen === 'home' && (
        <div className="max-w-2xl mx-auto px-4 pt-8 md:pt-12">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-jewel-800 mb-2">
              Family Check-In ✨
            </h1>
            <p className="text-gray-500 text-lg">
              {isWeekend() ? '🌈 Weekend Mode' : '📅 Weekday Mode'}
            </p>
          </div>

          {/* Child Banks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up">
            {children.map(child => (
              <BankDisplay
                key={child.id}
                child={child}
                nintendoMinutes={appData.getNintendoMinutes(child.id)}
                bonusPoints={appData.getBonusPoints(child.id)}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center gap-4 animate-slide-up">
            <button
              onClick={handleStartCheckin}
              className="touch-target bg-sunset-500 hover:bg-sunset-600 text-white font-display text-2xl md:text-3xl font-bold px-12 py-5 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              Start Check-In! 🚀
            </button>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setScreen('rewards')}
                className="touch-target bg-white border-2 border-amber-300 text-amber-600 font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                ⭐ Reward Store
              </button>
              <button
                onClick={() => setScreen('admin')}
                className="touch-target bg-gray-100 border-2 border-gray-300 text-gray-500 font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105"
              >
                🔐 Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spinner */}
      {screen === 'spinner' && (
        <div className="max-w-2xl mx-auto px-4 pt-8 md:pt-12">
          <Spinner children={children} onOrderDecided={handleOrderDecided} />
        </div>
      )}

      {/* Child Session */}
      {screen === 'session' && sessionOrder[currentChildIndex] && (
        <div className="max-w-2xl mx-auto px-4 pt-8 md:pt-12">
          {/* Session header */}
          <div className="flex justify-center gap-2 mb-6">
            {sessionOrder.map((child, i) => (
              <div
                key={child.id}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                  i === currentChildIndex
                    ? 'bg-white shadow-md border-2'
                    : i < currentChildIndex
                    ? 'bg-gray-100 text-gray-400 line-through'
                    : 'bg-gray-100 text-gray-500'
                }`}
                style={i === currentChildIndex ? { borderColor: `var(--color-${child.color})`, color: `var(--color-${child.color})` } : {}}
              >
                {child.emoji} {child.name}
                {i < currentChildIndex && ' ✓'}
              </div>
            ))}
          </div>

          <ChildSession
            key={sessionOrder[currentChildIndex].id}
            child={sessionOrder[currentChildIndex]}
            config={config}
            appData={appData}
            onComplete={handleSessionComplete}
          />
        </div>
      )}

      {/* Rewards */}
      {screen === 'rewards' && (
        <div className="max-w-2xl mx-auto px-4 pt-8 md:pt-12">
          <RewardCatalog
            config={config}
            appData={appData}
            onBack={() => setScreen('home')}
          />
        </div>
      )}

      {/* Admin */}
      {screen === 'admin' && (
        <div className="max-w-3xl mx-auto px-4 pt-8 md:pt-12">
          <AdminPanel
            config={config}
            appData={appData}
            onBack={() => setScreen('home')}
          />
        </div>
      )}
    </div>
  )
}
