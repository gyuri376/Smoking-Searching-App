import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navItems = [
  {
    href: '/',
    label: '홈',
    icon: (isActive) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    href: '/recent',
    label: '최근기록',
    icon: (isActive) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  },
  {
    href: '/favorites',
    label: '즐겨찾기',
    icon: (isActive) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    )
  },
  {
    href: '/community',
    label: '커뮤니티',
    icon: (isActive) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  },
];

export default function BottomNav() {
  const router = useRouter();

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '56px',
      background: 'white',
      borderTop: '1px solid #eee',
      zIndex: 1000,
      maxWidth: '420px',
      margin: '0 auto',
    }}>
      {navItems.map(item => {
        const isActive = router.pathname === item.href;
        return (
          <Link key={item.href} href={item.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            color: isActive ? 'var(--primary-color, #0A86F3)' : '#333',
            textDecoration: 'none',
          }}>
            {item.icon(isActive)}
            <span style={{ fontSize: '11px', fontWeight: isActive ? 'bold' : 'normal' }}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  );
}