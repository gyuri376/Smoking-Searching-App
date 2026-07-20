import React, { useEffect, useState } from 'react'
import CardList from '../components/CardList'
import { fetchNearbySmokingAreas } from '../api'
import { useAppContext } from '../context/AppContext'

const SORT_OPTIONS = {
  DISTANCE: '거리순',
  RATING: '평점순',
  CONGESTION: '혼잡도순',
}

export default function ListPage() {
  const [spots, setSpots] = useState([])
  const [spotsLoading, setSpotsLoading] = useState(true)
  const { selected, setSelected } = useAppContext()
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DISTANCE)

  useEffect(() => {
    // TODO: 실제 위치 기반 또는 선택 지역 기반 데이터 호출
    const lat = 36.116
    const lng = 128.344
    setSpotsLoading(true)
    fetchNearbySmokingAreas(lat, lng).then((data) => {
      // 정렬을 위한 임시 데이터 처리 (평점, 혼잡도, 거리)
      const processedData = data.map(spot => ({
        ...spot,
        rating: 5 - (spot.id * 0.5), // 임시 평점
        congestion: spot.crowd.includes('낮음') ? 1 : (spot.crowd.includes('높음') || spot.status === '혼잡' ? 3 : 2), // 혼잡도 수치화
        distance_m: parseInt(spot.distance.replace(/[^0-9]/g, '')) * 80, // '도보 3분' -> 240m (1분당 80m 가정)
      }));

      // 정렬 로직
      const sortedData = [...processedData].sort((a, b) => {
        if (sortBy === SORT_OPTIONS.RATING) {
          return b.rating - a.rating;
        }
        if (sortBy === SORT_OPTIONS.CONGESTION) {
          return a.congestion - b.congestion;
        }
        if (sortBy === SORT_OPTIONS.DISTANCE) {
          return a.distance_m - b.distance_m;
        }
        return a.id - b.id; // 기본 정렬
      });

      setSpots(sortedData)
      setSpotsLoading(false)
    })
  }, [sortBy])

  return (
    <div style={{ padding: 12, paddingBottom: '70px' }}>
      <h2>전체 흡연구역 리스트</h2>
      <p>선택된 지역의 모든 흡연구역을 확인합니다.</p>

      {/* 고급 필터 (UI Placeholder) */}
      <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, margin: '12px 0' }}>
        <h4>고급 필터</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          <select>
            <option>운영 상태</option>
            <option>운영중</option>
            <option>폐쇄</option>
          </select>
          <select>
            <option>혼잡도</option>
            <option>낮음</option>
            <option>중간</option>
            <option>높음</option>
          </select>
          <label><input type="checkbox" /> 지붕 있음</label>
          <label><input type="checkbox" /> 의자 있음</label>
        </div>
      </div>

      {/* 정렬 옵션 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, margin: '12px 0' }}>
        {Object.values(SORT_OPTIONS).map(option => (
          <button
            key={option}
            onClick={() => setSortBy(option)}
            style={{
              fontWeight: sortBy === option ? 'bold' : 'normal',
              border: '1px solid #ccc',
              background: sortBy === option ? '#e0e0e0' : 'white',
              padding: '4px 8px',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {spotsLoading ? <p>목록을 불러오는 중...</p> : <CardList spots={spots} activeId={selected?.id} onSelect={setSelected} />}
    </div>
  )
}