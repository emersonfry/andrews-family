import { useState, useRef } from 'react'

const COLORS = ['#476de9', '#10b981', '#e879a8']
const SEGMENT_COLORS = [
  ['#476de9', '#5b7fef'],
  ['#10b981', '#34d399'],
  ['#e879a8', '#f0a0c0'],
]

export default function Spinner({ children, onOrderDecided }) {
  const [spinning, setSpinning] = useState(false)
  const [order, setOrder] = useState(null)
  const wheelRef = useRef(null)
  const [rotation, setRotation] = useState(0)

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setOrder(null)

    // Random rotation: 5-8 full spins + random offset
    const extraSpins = 5 + Math.random() * 3
    const totalDeg = extraSpins * 360 + Math.random() * 360
    setRotation(prev => prev + totalDeg)

    // Shuffle children for random order
    const shuffled = [...children].sort(() => Math.random() - 0.5)

    setTimeout(() => {
      setSpinning(false)
      setOrder(shuffled)
    }, 3000)
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-slide-up">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-jewel-800">
        Who goes first? 🎡
      </h2>

      {/* Wheel */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 text-3xl">
          ▼
        </div>

        <svg
          ref={wheelRef}
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          }}
        >
          {children.map((child, i) => {
            const angle = (360 / children.length) * i
            const endAngle = (360 / children.length) * (i + 1)
            const startRad = (angle - 90) * (Math.PI / 180)
            const endRad = (endAngle - 90) * (Math.PI / 180)
            const x1 = 100 + 95 * Math.cos(startRad)
            const y1 = 100 + 95 * Math.sin(startRad)
            const x2 = 100 + 95 * Math.cos(endRad)
            const y2 = 100 + 95 * Math.sin(endRad)
            const largeArc = endAngle - angle > 180 ? 1 : 0
            const midRad = ((angle + endAngle) / 2 - 90) * (Math.PI / 180)
            const textX = 100 + 55 * Math.cos(midRad)
            const textY = 100 + 55 * Math.sin(midRad)
            const textAngle = (angle + endAngle) / 2

            return (
              <g key={child.id}>
                <path
                  d={`M100,100 L${x1},${y1} A95,95 0 ${largeArc},1 ${x2},${y2} Z`}
                  fill={COLORS[i]}
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                >
                  {child.emoji} {child.name}
                </text>
              </g>
            )
          })}
          <circle cx="100" cy="100" r="18" fill="white" stroke="#ddd" strokeWidth="2" />
          <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="16">
            🎯
          </text>
        </svg>
      </div>

      {!order && (
        <button
          onClick={spin}
          disabled={spinning}
          className="touch-target bg-sunset-500 hover:bg-sunset-600 text-white font-display text-2xl font-bold px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {spinning ? 'Spinning... ✨' : 'Spin! 🎰'}
        </button>
      )}

      {order && (
        <div className="animate-slide-up text-center">
          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            {order.map((child, i) => (
              <div key={child.id} className="flex items-center gap-2">
                <span className="bg-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sunset-600 shadow">
                  {i + 1}
                </span>
                <span className="font-display text-xl font-bold" style={{ color: COLORS[children.findIndex(c => c.id === child.id)] }}>
                  {child.name}
                </span>
                {i < order.length - 1 && <span className="text-gray-400 mx-1">·</span>}
              </div>
            ))}
          </div>
          <button
            onClick={() => onOrderDecided(order)}
            className="touch-target bg-emerald-500 hover:bg-emerald-600 text-white font-display text-2xl font-bold px-10 py-4 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            Let&apos;s go! 🚀
          </button>
        </div>
      )}
    </div>
  )
}
