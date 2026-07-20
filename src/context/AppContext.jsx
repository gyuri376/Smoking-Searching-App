import React, { createContext, useContext, useEffect, useState } from 'react'
import { addBookmark, removeBookmark, fetchFavoriteSmokingAreas } from '../api'

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
  }, [])

  useEffect(() => {
    if (!authToken) {
      setFavorites([])
      return
    }
    fetchFavoriteSmokingAreas(authToken)
      .then(setFavorites)
      .catch(() => setFavorites([]))
  }, [authToken])

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

  const addFavorite = async (spot) => {
    if (!authToken) {
      notify('로그인 후 이용해주세요.', 'info')
      return
    }
    if (favorites.find((f) => f.id === spot.id)) {
      notify('이미 즐겨찾기에 추가되어 있습니다.', 'info')
      return
    }
    try {
      await addBookmark(authToken, spot.id)
      setFavorites((prev) => [spot, ...prev])
      notify('즐겨찾기에 추가되었습니다.', 'success')
    } catch {
      notify('즐겨찾기 추가에 실패했습니다.', 'error')
    }
  }

  const removeFavorite = async (id) => {
    if (!authToken) return
    try {
      await removeBookmark(authToken, id)
      setFavorites((prev) => prev.filter((f) => f.id !== id))
    } catch {
      notify('즐겨찾기 삭제에 실패했습니다.', 'error')
    }
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
