import React, { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [selected, setSelected] = useState(null)
  const [favorites, setFavorites] = useState([])
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
    try {
      setFavorites(JSON.parse(window.localStorage.getItem('favorites') || '[]'))
    } catch {
      setFavorites([])
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

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

  const notify = (message, type) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }))
    }
  }

  const addFavorite = (spot) => {
    if (favorites.find((f) => f.id === spot.id)) {
      notify('이미 즐겨찾기에 추가되어 있습니다.', 'info')
      return
    }
    setFavorites((prev) => [spot, ...prev])
    notify('즐겨찾기에 추가되었습니다.', 'success')
  }

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
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
