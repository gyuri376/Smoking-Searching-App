import React, { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [selected, setSelected] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(window.localStorage.getItem('favorites') || '[]')
    } catch {
      return []
    }
  })
  const [recentSpots, setRecentSpots] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      return JSON.parse(window.localStorage.getItem('recentSpots') || '[]')
    } catch {
      return []
    }
  })
  const [authToken, setAuthToken] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const savedToken = window.localStorage.getItem('authToken')
      const savedUser = window.localStorage.getItem('authUser')
      if (savedToken) setAuthToken(savedToken)
      if (savedUser) setUser(JSON.parse(savedUser))
    } catch {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (authToken) {
      window.localStorage.setItem('authToken', authToken)
    } else {
      window.localStorage.removeItem('authToken')
    }
  }, [authToken])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      window.localStorage.setItem('authUser', JSON.stringify(user))
    } else {
      window.localStorage.removeItem('authUser')
    }
  }, [user])

  useEffect(() => {
    if (!selected) return
    setRecentSpots((prev) => {
      const filtered = prev.filter((item) => item.id !== selected.id)
      return [selected, ...filtered].slice(0, 8)
    })
  }, [selected])

  const addFavorite = (spot) => {
    if (favorites.find((f) => f.id === spot.id)) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: '이미 즐겨찾기에 추가되어 있습니다.', type: 'info' } }))
      }
      return
    }
    setFavorites((prev) => [spot, ...prev])
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: '즐겨찾기에 추가되었습니다.', type: 'success' } }))
    }
  }

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  const clearRecent = () => {
    setRecentSpots([])
  }

  const login = (token, userData) => {
    setAuthToken(token)
    setUser(userData || null)
  }

  const logout = () => {
    setAuthToken(null)
    setUser(null)
  }

  return (
    <AppContext.Provider
      value={{
        selected,
        setSelected,
        favorites,
        addFavorite,
        removeFavorite,
        recentSpots,
        clearRecent,
        authToken,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider')
  }
  return context
}
