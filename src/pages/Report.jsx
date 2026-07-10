import React, { useState } from 'react'

export default function Report() {
  const [place, setPlace] = useState('')
  const [status, setStatus] = useState('운영중')
  const [imagePreview, setImagePreview] = useState('')

  const submit = () => {
    const reports = JSON.parse(window.localStorage.getItem('reports') || '[]')
    reports.unshift({
      id: Date.now(),
      place,
      status,
      image: imagePreview,
      created: new Date().toISOString(),
    })
    window.localStorage.setItem('reports', JSON.stringify(reports))
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: '제보가 접수되었습니다. 감사합니다.', type: 'success' } }))
    setPlace('')
    setStatus('운영중')
    setImagePreview('')
  }

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: 'linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%)', borderRadius: 20, padding: 20, border: '1px solid #dcecff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: '#0a86f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 22 }}>📍</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 20 }}>새로운 흡연 장소 제보</h3>
            <div style={{ color: '#52667a', fontSize: 14 }}>이미지, 장소, 상태를 채워서 발견한 장소를 공유해 주세요.</div>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: '#0a86f3' }}>장소 정보</label>
          <input
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="예: 인동동 행정복지센터 앞 흡연부스"
            style={{ width: '100%', padding: '14px 16px', border: '1px solid #dcecff', borderRadius: 14, background: 'white', fontSize: 15 }}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: '#0a86f3' }}>장소 상태</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', border: '1px solid #dcecff', borderRadius: 14, background: 'white', fontSize: 15 }}
          >
            <option>운영중</option>
            <option>폐쇄됨</option>
            <option>혼잡</option>
            <option>청결하지 않음</option>
          </select>
        </div>

        <div style={{ marginTop: 14 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 700, color: '#0a86f3' }}>이미지 추가</label>
          <label
            style={{
              display: 'block',
              border: imagePreview ? '1px solid #dcecff' : '1px dashed #9ec8ff',
              borderRadius: 16,
              padding: 18,
              textAlign: 'center',
              background: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: 160,
              overflow: 'hidden'
            }}
          >
            {imagePreview ? (
              <div style={{ position: 'relative' }}>
                <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', borderRadius: 14 }} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImagePreview('')
                  }}
                  style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0, 0, 0, 0.55)', color: 'white', border: 'none', borderRadius: 999, padding: '8px 10px', cursor: 'pointer' }}
                  aria-label="이미지 삭제"
                >✕</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 28 }}>📷</div>
                <div style={{ fontSize: 14, color: '#6b778c', marginTop: 8, lineHeight: 1.6 }}>
                  장소를 더 정확하게 전달하려면 사진을 추가하세요.
                </div>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ marginTop: 18 }}>
          <button
            onClick={submit}
            style={{ width: '100%', padding: '16px 18px', borderRadius: 16, border: 'none', background: '#0a86f3', color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
          >
            제보하기
          </button>
        </div>
      </div>
    </div>
  )
}
