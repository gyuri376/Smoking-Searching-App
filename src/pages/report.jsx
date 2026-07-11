import React, { useState } from 'react'

const availableFeatures = ['지붕 있음', '의자 있음', '재떨이 있음', '환기 잘됨', '콘센트 있음']

export default function Report() {
  const [place, setPlace] = useState('')
  const [status, setStatus] = useState('운영중')
  const [imagePreview, setImagePreview] = useState('')
  const [features, setFeatures] = useState([])

  const handleFeatureChange = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    )
  }

  const submit = () => {
    if (!place.trim()) {
      window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: '흡연 장소 위치를 입력해 주세요.', type: 'error' } }))
      return
    }
    const reports = JSON.parse(window.localStorage.getItem('reports') || '[]')
    reports.unshift({
      id: Date.now(),
      place,
      status,
      features,
      image: imagePreview,
      created: new Date().toISOString(),
    })
    window.localStorage.setItem('reports', JSON.stringify(reports))
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: '제보가 접수되었습니다. 감사합니다.', type: 'success' } }))
    setPlace('')
    setStatus('운영중')
    setImagePreview('')
    setFeatures([])
  }

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="report-page">
      <div className="report-card">
        <div className="report-header">
          <div className="report-icon" aria-hidden="true">📍</div>
          <div>
            <h3 className="report-title">새로운 흡연 장소 제보</h3>
            <div className="report-subtitle">발견하신 흡연 장소의 정보를 공유해 주세요.</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">흡연 장소 위치</label>
          <input
            className="form-input"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="예: 인동동 행정복지센터 앞 흡연부스"
          />
        </div>

        <div className="form-group">
          <label className="form-label">흡연 장소 상태</label>
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>운영중</option>
            <option>폐쇄됨</option>
            <option>혼잡</option>
            <option>청결하지 않음</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">특징 (중복 선택 가능)</label>
          <div className="report-feature-row">
            {availableFeatures.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => handleFeatureChange(feature)}
                className={`report-feature-btn${features.includes(feature) ? ' active' : ''}`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">흡연 장소 이미지</label>
          <label className={`report-photo${imagePreview ? ' has-image' : ''}`}>
            {imagePreview ? (
              <div className="report-photo-preview">
                <img src={imagePreview} alt="preview" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImagePreview('')
                  }}
                  className="report-photo-remove"
                  aria-label="이미지 삭제"
                >✕</button>
              </div>
            ) : (
              <>
                <div className="report-photo-icon" aria-hidden="true">📷</div>
                <div className="report-photo-hint">장소를 더 정확하게 전달하려면 사진을 추가하세요.</div>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>
        </div>

        <button onClick={submit} className="report-submit-btn" type="button">제보하기</button>
      </div>
    </div>
  )
}