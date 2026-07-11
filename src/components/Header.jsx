import React, { useState } from 'react'
import Link from 'next/link'
import { useAppContext } from '../context/AppContext'

const menuLinks = [
  { href: '/', label: '홈' },
  { href: '/map', label: '지도' },
  { href: '/ai', label: 'AI 추천' },
  { href: '/report', label: '제보' },
  { href: '/recent', label: '최근기록' },
  { href: '/mypage', label: '마이페이지' },
]

export default function Header(){
  const { user } = useAppContext()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="topbar">
      <button
        className="menu"
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="메뉴 열기"
        style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: 'inherit' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="logo">
        <div className="logo-text">여기흡연</div>
      </div>
      <div className="icons">
        <span aria-hidden="true">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </span>
        <Link href="/mypage" passHref>
          <button
            style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
            aria-label="마이페이지"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            {user?.nickname && <span style={{ fontSize: 13, fontWeight: 700 }}>{user.nickname}</span>}
          </button>
        </Link>
      </div>

      {menuOpen && (
        <div className="side-menu-overlay" onClick={() => setMenuOpen(false)}>
          <nav className="side-menu" onClick={(e) => e.stopPropagation()}>
            <div className="side-menu-header">
              <span className="side-menu-title">여기흡연</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="메뉴 닫기"
                style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: 'var(--ink)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul className="side-menu-list">
              {menuLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="side-menu-link" onClick={() => setMenuOpen(false)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
