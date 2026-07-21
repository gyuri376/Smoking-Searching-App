import React from 'react'
import { useAppContext } from '../context/AppContext'
import CardList from '../components/CardList'

export default function FavoritesPage() {
  const { favorites, selected, setSelected } = useAppContext()

  return (
    <div style={{ padding: 12, paddingBottom: '70px' }}>
      <h2>즐겨찾기</h2>
      <p>저장한 흡연구역 목록과 알림을 관리합니다.</p>

      {/* 알림 히스토리 (Placeholder) */}
      <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 8, margin: '12px 0' }}>
        <h4>알림 히스토리</h4>
        <ul>
          <li>어제 '구미역 앞 흡연부스'가 폐쇄되었습니다.</li>
          <li>3일 전 '동락공원 흡연쉼터'의 운영 정보가 변경되었습니다.</li>
        </ul>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4, background: 'white', cursor: 'pointer' }}>
            순서 편집
          </button>
      </div>

      {favorites.length === 0 ? (
        <p className="recent-empty">즐겨찾기한 흡연구역이 없습니다.</p>
      ) : (
        <CardList spots={favorites} activeId={selected?.id} onSelect={setSelected} />
      )}
    </div>
  )
}