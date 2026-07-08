import React from 'react'
import Banner from '../components/Banner'
import LocationSelector from '../components/LocationSelector'
import CardList from '../components/CardList'
import { fetchNearbySmokingAreas } from '../api'
import { useAppContext } from '../context/AppContext'

const homeIcons = [
  { emoji: '🚬', label: '흡연부스' },
  { emoji: '🅿️', label: '주차장' },
  { emoji: '☕', label: '휴식공간' },
  { emoji: '🚌', label: '대중교통' }
]

export default function HomePage() {
  const [spots, setSpots] = React.useState([])
  const [selectedRegion, setSelectedRegion] = React.useState('대구')
  const [showRegionList, setShowRegionList] = React.useState(false)
  const [mascotError, setMascotError] = React.useState(false)
  const { selected, setSelected } = useAppContext()
  const mascotSvg = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="28" fill="#f6faff"/><circle cx="60" cy="52" r="24" fill="#0A86F3"/><circle cx="52" cy="50" r="3" fill="#fff"/><circle cx="68" cy="50" r="3" fill="#fff"/><path d="M48 68c4 6 20 6 24 0" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`)}`

  const regions = [
    '서울','경기','인천','강원','충남',
    '대전','충북','세종','부산','울산',
    '대구','경북','경남','전남','광주',
    '전북','제주','전국'
  ]

  React.useEffect(() => {
    const lat = 36.116
    const lng = 128.344
    fetchNearbySmokingAreas(lat, lng).then(setSpots)
  }, [])

  const safeRegion = selectedRegion || '대구'

  return (
    <div>
      <div className="home-address-bar">
        <button
          className={`home-address-chip ${showRegionList ? 'active' : ''}`}
          onClick={() => setShowRegionList((prev) => !prev)}
          type="button"
        >
          <span className="home-address-icon">📍</span>
          <strong>{safeRegion}</strong>
        </button>
        <button
          className={`home-address-chip ${safeRegion === '전체' ? 'active' : ''}`}
          onClick={() => {
            setSelectedRegion('전체')
            setShowRegionList(false)
          }}
          type="button"
        >
          전체
        </button>
      </div>

      <div className={`region-grid ${showRegionList ? '' : 'hidden'}`}>
        {regions.map((region) => (
          <button
            key={region}
            className={`region-chip ${region === safeRegion ? 'active' : ''}`}
            onClick={() => {
              setSelectedRegion(region)
              setShowRegionList(false)
            }}
            type="button"
          >
            {region}
          </button>
        ))}
      </div>

      <Banner />
      <div className="icons-row">
        {homeIcons.map((item) => (
          <div key={item.label} className="icon-item">
            <div className="icon-circle">{item.emoji}</div>
            <div className="icon-label">{item.label}</div>
          </div>
        ))}
      </div>
      <section className="recommendation-section" style={{ padding: 12 }}>
        <div className="recommendation-header">
          <h3>{safeRegion} AI 추천 흡연구역</h3>
          {safeRegion === '구미' && !mascotError && (
            <img
              src={mascotSvg}
              alt="마스코트"
              className="mascot-recommendation"
              onError={() => setMascotError(true)}
            />
          )}
        </div>
        <CardList spots={spots} activeId={selected && selected.id} onSelect={(s) => setSelected && setSelected(s)} />
      </section>
    </div>
  )
}
