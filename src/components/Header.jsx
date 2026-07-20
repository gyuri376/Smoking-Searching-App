import React from 'react'
import Link from 'next/link'
import { useAppContext } from '../context/AppContext'

export default function Header(){
  const { user } = useAppContext()

  return (
    <header className="topbar">
      {/* 메뉴 버튼을 제거하고 로고 중앙 정렬을 위한 빈 공간을 추가합니다. */}
      <div style={{ width: '19px' }} />
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
    </header>
  )
}
