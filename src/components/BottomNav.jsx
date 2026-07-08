import React from 'react'
import { useRouter } from 'next/router'

export default function BottomNav() {
  const router = useRouter()

  const handleNav = (path) => {
    if (router.pathname === path) return
    router.push(path)
  }

  return (
    <div className="bottom-nav">
      <div className="bottom-inner">
        <div className="nav-item" onClick={() => handleNav('/')} style={{ cursor: 'pointer' }}>🏠<div>홈</div></div>
        <div className="nav-item" onClick={() => handleNav('/map')} style={{ cursor: 'pointer' }}>🗺️<div>지도</div></div>
        <div className="ai-button" onClick={() => handleNav('/ai')} style={{ cursor: 'pointer' }}>AI<br />추천</div>
        <div className="nav-item" onClick={() => handleNav('/report')} style={{ cursor: 'pointer' }}>📣<div>제보</div></div>
        <div className="nav-item" onClick={() => handleNav('/recent')} style={{ cursor: 'pointer' }}>🕘<div>최근기록</div></div>
      </div>
    </div>
  )
}
