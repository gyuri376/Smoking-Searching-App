import React, { useState } from 'react'
import Link from 'next/link'
import { useAppContext } from '../context/AppContext'

export default function Header(){
  const [imgError, setImgError] = useState(false)
  const { user } = useAppContext()
  const logoSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#0A86F3"/><circle cx="60" cy="52" r="24" fill="#fff"/><path d="M43 72c8 8 26 8 34 0" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M52 36c8-6 16-6 24 0" stroke="#0A86F3" stroke-width="8" stroke-linecap="round"/></svg>`)}`

  return (
    <header className="topbar">
      <div className="menu">☰</div>
      <div className={`logo ${imgError ? 'no-image' : ''}`}>
        <div className="mark">
          {!imgError && (
            <img
              src={logoSvg}
              alt="여기흡연"
              className="app-logo"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div className="logo-text">여기흡연</div>
      </div>
      <div className="icons">
        <span style={{fontSize:18}}>🔍</span>
        <Link href="/mypage" passHref>
          <button style={{border:'none',background:'transparent',fontSize:18,cursor:'pointer'}}>
            {user?.nickname ? `👤 ${user.nickname}` : '👤'}
          </button>
        </Link>
      </div>
    </header>
  )
}
