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
  const { selected, setSelected } = useAppContext()

  useEffect(() => {
    if (!position) return
    fetchNearbySmokingAreas(position.lat, position.lng).then(setSpots)
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
      <section style={{ padding: 12 }}>
        {permissionState !== 'granted' && (
          <div>
            <p>위치 권한을 허용하면 주변 흡연구역을 확인할 수 있습니다.</p>
            <button
              onClick={requestLocation}
              style={{ padding: 10, background: '#0a86f3', color: 'white', border: 'none', borderRadius: 6 }}
            >
              위치 허용
            </button>
          </div>
        )}

        {permissionState === 'granted' && position && (
          <>
            <MapView center={position} spots={spots} onSelect={(s) => setSelected && setSelected(s)} activeId={selected && selected.id} />
            <div style={{ padding: '0 16px' }}>
              <CardList spots={spots} activeId={selected && selected.id} onSelect={(s) => setSelected && setSelected(s)} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}
