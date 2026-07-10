import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from '../context/AppContext'

export default function MyPage() {
  const router = useRouter()
  const { authToken, user, login, logout } = useAppContext()
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('카카오 로그인을 통해 제보 및 개인정보 기능을 사용할 수 있습니다.')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [rememberId, setRememberId] = useState(false)
  const [keepLogin, setKeepLogin] = useState(false)
  const hasHandledCode = useRef(false)

  const redirectUri = useMemo(() => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
    return `${baseUrl.replace(/\/$/, '')}/mypage`
  }, [])

  const kakaoAuthUrl = useMemo(() => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || ''
    return `https://kauth.kakao.com/oauth/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
  }, [redirectUri])

  useEffect(() => {
    if (!router.isReady) return
    const code = router.query.code
    if (!code || authToken || hasHandledCode.current) return

    const authorizationCode = Array.isArray(code) ? code[0] : code
    if (!authorizationCode) return

    hasHandledCode.current = true
    setStatus('loading')
    setMessage('카카오 인가 코드를 처리 중입니다...')

    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || ''
    const endpoint = backendBase ? `${backendBase.replace(/\/$/, '')}/api/auth/kakao` : '/api/auth/kakao'

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: authorizationCode, redirectUri }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || '카카오 로그인 처리에 실패했습니다.')
        }
        return response.json()
      })
      .then((data) => {
        if (!data.token) {
          throw new Error('백엔드가 JWT를 반환하지 않았습니다.')
        }
        login(data.token, data.user || null)
        setStatus('success')
        setMessage('로그인에 성공했습니다. 이제 JWT를 사용해 보호된 API를 호출할 수 있습니다.')
        router.replace('/mypage', undefined, { shallow: true })
      })
      .catch((error) => {
        console.error(error)
        setStatus('error')
        setMessage(error.message || '카카오 로그인 중 오류가 발생했습니다.')
      })
  }, [authToken, login, redirectUri, router])

  const isLoggedIn = Boolean(authToken)

  return (
    <div style={{ padding: '24px 16px 40px', minHeight: 'calc(100vh - 90px)', background: '#f2fbf7' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 28px', fontSize: 28, fontWeight: 800, textAlign: 'center' }}>로그인</h1>

        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 18px 40px rgba(8,34,60,0.08)', padding: 24, border: '1px solid rgba(16,24,40,0.05)' }}>
          {isLoggedIn ? (
            <>
              <div style={{ marginBottom: 20, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>환영합니다!</div>
              <div style={{ marginBottom: 12, color: '#475569' }}>카카오 닉네임</div>
              <div style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>{user?.nickname || '알 수 없음'}</div>
              <div style={{ marginBottom: 20, color: '#475569' }}>카카오 ID</div>
              <div style={{ marginBottom: 22, fontSize: 16 }}>{user?.id || '알 수 없음'}</div>
              <button
                onClick={() => logout()}
                style={{ width: '100%', padding: '14px 0', borderRadius: 14, background: '#ef4444', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gap: 14 }}>
                <input
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="아이디"
                  style={{ width: '100%', padding: '16px 14px', borderRadius: 14, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 15 }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호"
                  style={{ width: '100%', padding: '16px 14px', borderRadius: 14, border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 15 }}
                />
              </div>

              <button
                type="button"
                disabled
                style={{
                  width: '100%', marginTop: 16, padding: '16px 0', borderRadius: 14, border: '1px solid rgba(16,24,40,0.12)',
                  background: '#f8fafc', color: '#94a3b8', fontWeight: 700, cursor: 'not-allowed'
                }}
              >
                로그인
              </button>

              <button
                type="button"
                style={{ width: '100%', marginTop: 12, padding: '16px 0', borderRadius: 14, border: '1px solid rgba(16,24,40,0.12)', background: '#fff', color: '#111827', fontWeight: 700, cursor: 'pointer' }}
              >
                회원가입
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, color: '#64748b', fontSize: 13 }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={rememberId} onChange={() => setRememberId((prev) => !prev)} />
                  아이디저장
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={keepLogin} onChange={() => setKeepLogin((prev) => !prev)} />
                  로그인유지
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, color: '#94a3b8', fontSize: 13 }}>
                <button type="button" style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>아이디 찾기</button>
                <button type="button" style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}>비밀번호 찾기</button>
              </div>

              <div style={{ marginTop: 26, borderTop: '1px solid #e2e8f0', paddingTop: 18, color: '#475569', fontSize: 13, textAlign: 'center' }}>
                간편한 회원가입/로그인
              </div>

              <a
                href={kakaoAuthUrl}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', marginTop: 12, padding: '16px 0', borderRadius: 14, background: '#fee500', color: '#191919', fontWeight: 700, textDecoration: 'none' }}
              >
                <span style={{ fontSize: 18 }}>💬</span>
                카카오로 시작하기
              </a>
            </>
          )}
        </div>

        {status !== 'idle' && (
          <div style={{ marginTop: 18, padding: 16, borderRadius: 16, background: '#f8fbff', border: '1px solid #dcecff', color: '#334155' }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{status === 'loading' ? '처리 중입니다...' : status === 'success' ? '로그인 완료' : '오류'}</div>
            <div>{message}</div>
          </div>
        )}
      </div>
    </div>
  )
}
