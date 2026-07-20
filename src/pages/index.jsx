import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { LoadScript } from '@react-google-maps/api'
import CardList from '../components/CardList'
import { fetchNearbySmokingAreas } from '../api'
import { useAppContext } from '../context/AppContext'

const GoogleMapView = dynamic(() => import('../components/GoogleMapView'), { ssr: false })

export default function HomePage() {
  const [permissionState, setPermissionState] = useState('idle')
  const [position, setPosition] = useState(null)
  const [spots, setSpots] = useState([])
  const [spotsLoading, setSpotsLoading] = useState(false)
  const { selected, setSelected } = useAppContext()
  const [isFilterOpen, setFilterOpen] = useState(false)

  useEffect(() => {
    if (!position) return
    setSpotsLoading(true)
    fetchNearbySmokingAreas(position.lat, position.lng).then((data) => {
      setSpots(data)
      setSpotsLoading(false)
    })
  }, [position])

  const requestLocation = () => {
    setPermissionState('requesting')
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setPermissionState('denied')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPermissionState('granted')
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => setPermissionState('denied'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      {/* 배너와 필터 (권한 없을 때만 표시) */}
      {permissionState !== 'granted' && (
        <>
          <div style={{ padding: 12, background: '#f0f8ff', textAlign: 'center', fontSize: 14 }}>
            폭염주의보! 지붕이 있는 시원한 흡연구역을 찾아보세요.
          </div>
          <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => setFilterOpen(true)} style={{ background: '#eee', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>
              스마트 필터
            </button>
            <div style={{ position: 'relative' }}>
              <span>⭐</span>
              <span style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', width: 16, height: 16, borderRadius: '50%', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>N</span>
            </div>
          </div>
          {isFilterOpen && (
            <div style={{ padding: 12, border: '1px solid #ddd', margin: 12 }}>
              <h3>스마트 필터 (구현 예정)</h3>
              <button onClick={() => setFilterOpen(false)}>닫기</button>
            </div>
          )}
        </>
      )}

      <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {permissionState !== 'granted' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 16px' }}>
            <div className="map-permission">
              <div className="map-permission-icon" aria-hidden="true">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 21s-7-5.7-7-11a7 7 0 0114 0c0 5.3-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
              <p>
                위치 권한을 허용하면
                <br />
                주변 흡연구역을 확인할 수 있습니다.
              </p>
              <button onClick={requestLocation} className="map-permission-btn" type="button">
                위치 허용
              </button>
            </div>
          </div>
        )}

        {permissionState === 'granted' && position && (
          <>
            <div className="map-wrap" style={{ flex: '0 0 45%', position: 'relative', margin: 0, borderRadius: '0 0 20px 20px' }}>
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                <GoogleMapView center={position} spots={spots} onSelect={(s) => setSelected && setSelected(s)} activeId={selected && selected.id} />
              </LoadScript>
              <button className="map-locate-btn" type="button" onClick={requestLocation} aria-label="현재 위치로 이동">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                </svg>
              </button>
            </div>
            <div style={{ flex: '1', overflow: 'auto', background: 'white', borderRadius: '20px 20px 0 0', marginTop: '-20px', paddingTop: '20px' }}>
              {spotsLoading ? (
                <p className="list-loading">불러오는 중...</p>
              ) : (
                <CardList spots={spots} activeId={selected && selected.id} onSelect={(s) => setSelected && setSelected(s)} />
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
