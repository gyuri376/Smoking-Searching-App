import React from 'react'
import { useAppContext } from '../context/AppContext'
import CardList from '../components/CardList'

const aiRecommendations = [
  { id: 1, title: '인공지능 추천 흡연공간', description: '깨끗하고 안전한 흡연 공간을 AI가 추천합니다.' },
  { id: 2, title: '혼잡도 낮은 장소', description: 'AI 예측으로 혼잡도 낮은 구역을 제공합니다.' },
  { id: 3, title: '가장 가까운 실외 흡연구역', description: '근처 추천 흡연구역을 빠르게 보여줍니다.' }
]

export default function AiRecommendationPage() {
  const { selected } = useAppContext()

  return (
    <div className="ai-page">
      <section className="subtitle-card">
        <h2>AI 추천</h2>
        <p>AI 기반으로 최적의 흡연 구역을 제안합니다.</p>
      </section>
      <div className="card-scroll">
        {aiRecommendations.map((item) => (
          <article key={item.id} className="recommendation-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
      {selected && (
        <section className="selected-summary">
          <h3>현재 선택된 구역</h3>
          <div>{selected.name}</div>
          <div>{selected.address}</div>
        </section>
      )}
    </div>
  )
}
