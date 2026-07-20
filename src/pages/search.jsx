import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CardList from '../components/CardList'
import { fetchNearbySmokingAreas, SPOT_FEATURES } from '../api'
import { useAppContext } from '../context/AppContext'

export default function SearchPage() {
  const router = useRouter()
  const { selected, setSelected } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [spots, setSpots] = useState([])
  const [filteredSpots, setFilteredSpots] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // 초기 데이터 로드 (더미 데이터)
  useEffect(() => {
    const loadAllSpots = async () => {
      const data = await fetchNearbySmokingAreas(35.88, 128.59)
      setSpots(data)
      setFilteredSpots(data)
    }
    loadAllSpots()
  }, [])

  // 검색 및 필터링 로직
  useEffect(() => {
    let results = spots

    // 검색어 필터링
    if (searchQuery.trim()) {
      results = results.filter(spot =>
        spot.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // 피처 필터링 (선택된 피처가 있을 때)
    if (selectedFeatures.length > 0) {
      results = results.filter(spot =>
        selectedFeatures.some(feature => spot.info?.includes(feature))
      )
    }

    setFilteredSpots(results)
  }, [searchQuery, selectedFeatures, spots])

  const handleFeatureClick = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'white', position: 'relative' }}>
      {/* 검색 헤더 */}
      <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 100, padding: '12px 16px', borderBottom: '1px solid #eee' }}>
        {/* 뒤로가기 및 검색창 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            aria-label="뒤로가기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="장소, 주소, 흡연부스 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '20px',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
            autoFocus
          />
          <button
            onClick={() => setSearchQuery('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: searchQuery ? 'flex' : 'none',
              alignItems: 'center',
              color: '#999'
            }}
          >
            ✕
          </button>
        </div>

        {/* 필터 탭 */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}>
          <button
            onClick={() => setSelectedFeatures([])}
            style={{
              padding: '6px 14px',
              border: selectedFeatures.length === 0 ? '2px solid #14b89a' : '1px solid #ddd',
              borderRadius: '16px',
              background: selectedFeatures.length === 0 ? '#f0faf9' : 'white',
              color: selectedFeatures.length === 0 ? '#14b89a' : '#666',
              cursor: 'pointer',
              fontWeight: selectedFeatures.length === 0 ? 600 : 500,
              fontSize: '13px',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit'
            }}
          >
            전체
          </button>
          {SPOT_FEATURES.map(feature => (
            <button
              key={feature}
              onClick={() => handleFeatureClick(feature)}
              style={{
                padding: '6px 14px',
                border: selectedFeatures.includes(feature) ? '2px solid #14b89a' : '1px solid #ddd',
                borderRadius: '16px',
                background: selectedFeatures.includes(feature) ? '#f0faf9' : 'white',
                color: selectedFeatures.includes(feature) ? '#14b89a' : '#666',
                cursor: 'pointer',
                fontWeight: selectedFeatures.includes(feature) ? 600 : 500,
                fontSize: '13px',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit'
              }}
            >
              {feature}
            </button>
          ))}
        </div>
      </div>

      {/* 검색 결과 */}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: '70px' }}>
        {filteredSpots.length === 0 && searchQuery ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#999'
          }}>
            <p style={{ fontSize: '14px', margin: 0 }}>"{searchQuery}"에 대한 검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div style={{ padding: '0 0 12px' }}>
            <CardList
              spots={filteredSpots}
              activeId={selected?.id}
              onSelect={(s) => setSelected && setSelected(s)}
            />
          </div>
        )}
      </div>
    </div>
  )
}