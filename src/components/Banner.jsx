import React from 'react'

export default function Banner(){
  return (
    <div className="banner">
      <div className="text">
        <span className="banner-badge" aria-hidden="true">⚡ AI 추천 · 실시간</span>
        <h2>구미 흡연구역 추천</h2>
        <p>깨끗한 공간, 모두가 편안한 흡연 문화</p>
        <button type="button" className="banner-cta">
          바로 가기
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  )
}
