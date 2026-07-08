import React from 'react'
import { useAppContext } from '../context/AppContext'

export default function RecentPage() {
  const { recentSpots, clearRecent } = useAppContext()

  return (
    <div style={{ padding: 16 }}>
      <h2>최근 기록</h2>
      {recentSpots.length === 0 ? (
        <p>최근 선택한 장소가 없습니다.</p>
      ) : (
        <div className="card-list">
          {recentSpots.map((spot) => (
            <div key={spot.id} className="recent-card">
              <div>
                <strong>{spot.name}</strong>
                <p>{spot.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <button onClick={clearRecent} style={{ marginTop: 16, padding: 10, borderRadius: 10, background: '#0a86f3', color: 'white', border: 'none' }}>
        최근 기록 초기화
      </button>
    </div>
  )
}
