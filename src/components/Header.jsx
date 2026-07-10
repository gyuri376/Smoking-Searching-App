import React from 'react'
import Link from 'next/link'

export default function Header(){
  return (
    <header className="topbar">
      <div className="menu" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>
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
            style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', color: 'inherit' }}
            aria-label="마이페이지"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          </button>
        </Link>
      </div>
    </header>
  )
}
