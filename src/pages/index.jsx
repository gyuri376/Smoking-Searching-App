import React from 'react'
import { useRouter } from 'next/router'
import Banner from '../components/Banner'
import LocationSelector from '../components/LocationSelector'
import CardList from '../components/CardList'
import { fetchNearbySmokingAreas } from '../api'
import { useAppContext } from '../context/AppContext'

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const homeShortcuts = [
  {
    label: '지도에서 보기',
    path: '/map',
    icon: (
      <svg {...iconProps}>
        <path d="M9 4L4 6.5v13L9 17l6 2.5 5-2.5v-13L15 6l-6-2z" />
        <path d="M9 4v13M15 6v13.5" />
      </svg>
    )
  },
  {
    label: '즐겨찾기',
    path: '/mypage',
    icon: (
      <svg {...iconProps} fill="currentColor" stroke="none">
        <path d="M12 3.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6-4.6-4.1 6.1-.6z" />
      </svg>
    )
  },
  {
    label: '제보하기',
    path: '/report',
    icon: (
      <svg {...iconProps}>
        <path d="M12 21s-7-5.7-7-11a7 7 0 0114 0c0 5.3-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    )
  },
  {
    label: '최근기록',
    path: '/recent',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </svg>
    )
  }
]

export default function HomePage() {
  const router = useRouter()
  const [spots, setSpots] = React.useState([])
  const [spotsLoading, setSpotsLoading] = React.useState(true)
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
    setSpotsLoading(true)
    fetchNearbySmokingAreas(lat, lng).then((data) => {
      setSpots(data)
      setSpotsLoading(false)
    })
  }, [])

  const safeRegion = selectedRegion || '대구'

  return (
    <div>
      <div className="home-address-bar">
        <button
          className={`home-address-chip location ${showRegionList ? 'active' : ''}`}
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
        {homeShortcuts.map((item) => (
          <div
            key={item.label}
            className="icon-item"
            onClick={() => router.push(item.path)}
            style={{ cursor: 'pointer' }}
          >
            <div className="icon-circle">{item.icon}</div>
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
        {spotsLoading ? (
          <p className="list-loading">불러오는 중...</p>
        ) : (
          <CardList spots={spots} activeId={selected && selected.id} onSelect={(s) => setSelected && setSelected(s)} />
        )}
      </section>
    </div>
  )
}
