import React from 'react'
import { useRouter } from 'next/router'

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const HomeIcon = () => (
  <svg {...iconProps}>
    <path d="M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-8.5z" />
  </svg>
)

const MapIcon = () => (
  <svg {...iconProps}>
    <path d="M9 4L4 6.5v13L9 17l6 2.5 5-2.5v-13L15 6l-6-2z" />
    <path d="M9 4v13M15 6v13.5" />
  </svg>
)

const InfoIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8h.01" />
    <path d="M11 11h1v5h1" />
  </svg>
)

const ClockIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v4l3 2" />
  </svg>
)

const SparkleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
  </svg>
)

export default function BottomNav() {
  const router = useRouter()

  const handleNav = (path) => {
    if (router.pathname === path) return
    router.push(path)
  }

  const isActive = (path) => router.pathname === path

  return (
    <div className="bottom-nav">
      <div className="bottom-inner">
        <div className={`nav-item ${isActive('/') ? 'active' : ''}`} onClick={() => handleNav('/')} style={{ cursor: 'pointer' }}>
          <HomeIcon />
          <div>홈</div>
        </div>
        <div className={`nav-item ${isActive('/map') ? 'active' : ''}`} onClick={() => handleNav('/map')} style={{ cursor: 'pointer' }}>
          <MapIcon />
          <div>지도</div>
        </div>
        <div className="nav-item" onClick={() => handleNav('/ai')} style={{ cursor: 'pointer' }}>
          <div className="ai-button">
            <SparkleIcon />
            <span className="ai-label">AI 추천</span>
          </div>
        </div>
        <div className={`nav-item ${isActive('/report') ? 'active' : ''}`} onClick={() => handleNav('/report')} style={{ cursor: 'pointer' }}>
          <InfoIcon />
          <div>정보</div>
        </div>
        <div className={`nav-item ${isActive('/recent') ? 'active' : ''}`} onClick={() => handleNav('/recent')} style={{ cursor: 'pointer' }}>
          <ClockIcon />
          <div>최근기록</div>
        </div>
      </div>
    </div>
  )
}
