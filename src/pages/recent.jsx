import React from 'react'
import { useAppContext } from '../context/AppContext'

const fallbackImg = 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60'

export default function RecentPage() {
  const { recentSpots, clearRecent } = useAppContext()

  return (
    <div className="recent-page">
      <div className="recent-header">
        <div>
          <h2>최근기록</h2>
          <p className="recent-subtitle">최근에 확인한 흡연구역</p>
        </div>
        <button onClick={clearRecent} className="recent-clear-btn" type="button">
          전체삭제
        </button>
      </div>

      {recentSpots.length === 0 ? (
        <p className="recent-empty">최근 선택한 장소가 없습니다.</p>
      ) : (
        <div className="recent-list">
          {recentSpots.map((spot) => (
            <div key={spot.id} className="card">
              <img src={spot.img || fallbackImg} alt="thumb" />
              <div className="card-body">
                <div className="card-title">{spot.name}</div>
                <div className="card-meta">{spot.address}</div>
              </div>
              <span className="card-chevron" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
