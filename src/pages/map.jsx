import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import CardList from '../components/CardList'
import LocationSelector from '../components/LocationSelector'
import { fetchNearbySmokingAreas } from '../api'
import { useAppContext } from '../context/AppContext'

const MapView = dynamic(() => import('../components/MapView'), { ssr: false })

export default function MapPage() {
  const [permissionState, setPermissionState] = useState('idle')
  const [position, setPosition] = useState(null)
  const [spots, setSpots] = useState([])
  const [spotsLoading, setSpotsLoading] = useState(false)
  const { selected, setSelected } = useAppContext()

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
    <div>
      <LocationSelector />
      <section style={{ padding: '0 0 12px' }}>
        {permissionState !== 'granted' && (
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
        )}

        {permissionState === 'granted' && position && (
          <>
            <div className="map-wrap">
              <MapView center={position} spots={spots} onSelect={(s) => setSelected && setSelected(s)} activeId={selected && selected.id} />
              <button className="map-locate-btn" type="button" onClick={requestLocation} aria-label="현재 위치로 이동">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                </svg>
              </button>
            </div>
            {spotsLoading ? (
              <p className="list-loading">불러오는 중...</p>
            ) : (
              <CardList spots={spots} activeId={selected && selected.id} onSelect={(s) => setSelected && setSelected(s)} />
            )}
          </>
        )}
      </section>
    </div>
  )
}
