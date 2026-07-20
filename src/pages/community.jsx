import React, { useState } from 'react'
import { SPOT_FEATURES } from '../api'

// report.jsx의 제보 폼을 여기에 통합합니다.
function ReportForm() {
  const [place, setPlace] = useState('')
  const [status, setStatus] = useState('운영중')
  const [features, setFeatures] = useState([])

  const handleFeatureChange = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    )
  }

  const submit = () => {
    alert('리뷰/제보가 등록되었습니다 (구현 예정).')
  }

  return (
    <div className="report-card" style={{ marginBottom: 24 }}>
      <h3 className="report-title">리뷰 작성 / 신규 장소 제보</h3>
      <div className="form-group">
        <label className="form-label">장소</label>
        <input className="form-input" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="예: 구미역 앞" />
      </div>
      <div className="form-group">
        <label className="form-label">평점</label>
        <div>⭐⭐⭐⭐⭐</div>
      </div>
      <div className="form-group">
        <label className="form-label">특징</label>
        <div className="report-feature-row">
          {SPOT_FEATURES.map((feature) => (
            <button key={feature} type="button" onClick={() => handleFeatureChange(feature)} className={`report-feature-btn${features.includes(feature) ? ' active' : ''}`}>
              {feature}
            </button>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">사진 업로드</label>
        <input type="file" accept="image/*" />
      </div>
      <button onClick={submit} className="report-submit-btn" type="button">등록하기</button>
    </div>
  )
}

export default function CommunityPage() {
  return (
    <div style={{ padding: 12, paddingBottom: '70px' }}>
      <h2>커뮤니티</h2>
      <p>사용자들이 공유하는 흡연구역 리뷰와 혼잡도 정보를 확인하세요.</p>

      <ReportForm />

      {/* 리뷰 피드 (Placeholder) */}
      <div className="review-feed">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4>리뷰 피드</h4>
          <select style={{ padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4, background: 'white' }}>
            <option>최신순</option>
            <option>평점 높은 순</option>
            <option>평점 낮은 순</option>
          </select>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, margin: '8px 0' }}>
          <strong>구미역 앞 흡연부스</strong>
          <p>⭐⭐⭐⭐⭐ "관리가 잘 되고 있어서 좋아요." - user123</p>
          <p>실시간 혼잡도: <span style={{ color: 'green' }}>낮음</span></p>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, margin: '8px 0' }}>
          <strong>인동동 행정복지센터</strong>
          <p>⭐⭐ "사람이 너무 많고 환기가 잘 안돼요." - smoker99</p>
          <p>실시간 혼잡도: <span style={{ color: 'red' }}>높음</span></p>
        </div>
      </div>
    </div>
  )
}