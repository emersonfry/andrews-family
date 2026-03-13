import { useState, useCallback, useEffect } from 'react'
import { defaultConfig } from '../data/defaultConfig.js'

const STORAGE_KEYS = {
  CONFIG: 'familycheckin_config',
  BALANCES: 'familycheckin_balances',
  SESSIONS: 'familycheckin_sessions',
  INTENTIONS: 'familycheckin_intentions',
  LAST_RESET: 'familycheckin_last_reset',
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

function getMonday(d) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date.toISOString().split('T')[0]
}

export function useAppData() {
  const [config, setConfig] = useState(() => {
    return loadJSON(STORAGE_KEYS.CONFIG, defaultConfig)
  })

  const [balances, setBalances] = useState(() => {
    return loadJSON(STORAGE_KEYS.BALANCES, {
      reid: { nintendoMinutes: 0, bonusPoints: 0 },
      bennett: { nintendoMinutes: 0, bonusPoints: 0 },
      isla: { nintendoMinutes: 0, bonusPoints: 0 },
    })
  })

  const [sessions, setSessions] = useState(() => {
    return loadJSON(STORAGE_KEYS.SESSIONS, [])
  })

  const [intentions, setIntentions] = useState(() => {
    return loadJSON(STORAGE_KEYS.INTENTIONS, {})
  })

  // Check for Monday reset on load
  useEffect(() => {
    const today = new Date()
    const day = today.getDay()
    // Monday = 1
    if (day === 1) {
      const thisMonday = getMonday(today)
      const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_RESET)
      if (lastReset !== thisMonday) {
        // Reset all Nintendo minutes
        setBalances(prev => {
          const updated = { ...prev }
          for (const childId of Object.keys(updated)) {
            updated[childId] = { ...updated[childId], nintendoMinutes: 0 }
          }
          saveJSON(STORAGE_KEYS.BALANCES, updated)
          return updated
        })
        localStorage.setItem(STORAGE_KEYS.LAST_RESET, thisMonday)
      }
    }
  }, [])

  // Persist on changes
  useEffect(() => { saveJSON(STORAGE_KEYS.BALANCES, balances) }, [balances])
  useEffect(() => { saveJSON(STORAGE_KEYS.SESSIONS, sessions) }, [sessions])
  useEffect(() => { saveJSON(STORAGE_KEYS.INTENTIONS, intentions) }, [intentions])
  useEffect(() => { saveJSON(STORAGE_KEYS.CONFIG, config) }, [config])

  const getNintendoMinutes = useCallback((childId) => {
    return balances[childId]?.nintendoMinutes ?? 0
  }, [balances])

  const getBonusPoints = useCallback((childId) => {
    return balances[childId]?.bonusPoints ?? 0
  }, [balances])

  const addNintendoMinutes = useCallback((childId, amount) => {
    setBalances(prev => {
      const child = prev[childId] || { nintendoMinutes: 0, bonusPoints: 0 }
      const childBank = config.childBank?.[childId]
      const maxWeekly = childBank?.weeklyCap ?? config.maxWeeklyMinutes ?? 75
      const newMinutes = Math.min(child.nintendoMinutes + amount, maxWeekly)
      return { ...prev, [childId]: { ...child, nintendoMinutes: newMinutes } }
    })
  }, [config.childBank, config.maxWeeklyMinutes])

  const addBonusPoints = useCallback((childId, amount) => {
    setBalances(prev => {
      const child = prev[childId] || { nintendoMinutes: 0, bonusPoints: 0 }
      return { ...prev, [childId]: { ...child, bonusPoints: child.bonusPoints + amount } }
    })
  }, [])

  const spendBonusPoints = useCallback((childId, amount) => {
    const current = balances[childId]?.bonusPoints ?? 0
    if (current < amount) return false
    setBalances(prev => {
      const child = prev[childId]
      return { ...prev, [childId]: { ...child, bonusPoints: child.bonusPoints - amount } }
    })
    return true
  }, [balances])

  const resetWeeklyMinutes = useCallback(() => {
    setBalances(prev => {
      const updated = { ...prev }
      for (const childId of Object.keys(updated)) {
        updated[childId] = { ...updated[childId], nintendoMinutes: 0 }
      }
      return updated
    })
  }, [])

  const getRecentScores = useCallback((childId, questionId, n = 2) => {
    return sessions
      .filter(s => s.childId === childId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, n)
      .map(s => {
        const answer = s.answers?.find(a => a.questionId === questionId)
        return answer ? answer.score : null
      })
      .filter(s => s !== null)
  }, [sessions])

  const saveSessionResult = useCallback((childId, sessionData) => {
    setSessions(prev => [...prev, { childId, ...sessionData, date: new Date().toISOString() }])
  }, [])

  const getIntention = useCallback((childId, questionId) => {
    const key = `${childId}_${questionId}`
    return intentions[key] || null
  }, [intentions])

  const saveIntention = useCallback((childId, questionId, text) => {
    setIntentions(prev => ({ ...prev, [`${childId}_${questionId}`]: text }))
  }, [])

  const getConfig = useCallback(() => config, [config])

  const saveConfig = useCallback((newConfig) => {
    setConfig(newConfig)
  }, [])

  const setBalanceDirect = useCallback((childId, field, value) => {
    setBalances(prev => ({
      ...prev,
      [childId]: { ...prev[childId], [field]: Math.max(0, value) },
    }))
  }, [])

  return {
    getNintendoMinutes,
    getBonusPoints,
    addNintendoMinutes,
    addBonusPoints,
    spendBonusPoints,
    resetWeeklyMinutes,
    getRecentScores,
    saveSessionResult,
    getIntention,
    saveIntention,
    getConfig,
    saveConfig,
    setBalanceDirect,
    config,
    balances,
  }
}
