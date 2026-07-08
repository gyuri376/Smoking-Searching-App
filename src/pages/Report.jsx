import React, { useState } from 'react'

export default function Report() {
  const [desc, setDesc] = useState('')
  const [type, setType] = useState('운영 여부')
  const [address, setAddress] = useState('')
  const [imagePreview, setImagePreview] = useState('')

  const submit = () => {
    const reports = JSON.parse(window.localStorage.getItem('reports') || '[]')
    reports.unshift({
      id: Date.now(),
      type,
      desc,
      address,
      image: imagePreview,
      created: new Date().toISOString(),
    })
    window.localStorage.setItem('reports', JSON.stringify(reports))
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message: '제보가 접수되었습니다. 감사합니다.', type: 'success' } }))
    setDesc('')
    setAddress('')
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
      <div style={{ background: 'linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%)', borderRadius: 16, padding: 16, border: '1px solid #dcecff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#0a86f3', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>📣</div>
          <div>
            <h3 style={{ margin: 0 }}>장소 제보</h3>
            <div style={{ color: '#6b778c', fontSize: 13 }}>새로 찾은 흡연구역의 이미지와 주소를 공유해주세요</div>
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>제보 종류</label>
          <select value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcecff', borderRadius: 10, background: 'white' }}>
            <option>운영 여부</option>
            <option>혼잡도</option>
            <option>장소 상태</option>
          </select>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>장소 주소</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="예: 대구광역시 구미시 인동동 123" style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcecff', borderRadius: 10, background: 'white' }} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>설명</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="예: 주변에 쓰레기가 많아요 / 시설이 파손되었어요" style={{ width: '100%', padding: '10px 12px', border: '1px solid #dcecff', borderRadius: 10, resize: 'vertical', background: 'white' }} />
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>장소 사진</label>
          <label style={{ display: 'block', border: imagePreview ? '1px solid #dcecff' : '1px dashed #9ec8ff', borderRadius: 12, padding: 16, textAlign: 'center', background: 'white', cursor: 'pointer', transition: 'all 0.2s ease', overflow: 'hidden' }}>
            {imagePreview ? (
              <div style={{ position: 'relative' }}>
                <img src={imagePreview} alt="preview" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 12 }} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setImagePreview('')
                  }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: 999, padding: '6px 8px', cursor: 'pointer' }}
                  aria-label="이미지 삭제"
                >✕</button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 26 }}>📷</div>
                <div style={{ fontSize: 13, color: '#6b778c', marginTop: 6, lineHeight: 1.5 }}>이미지 추가 (권장) — 장소 식별에 도움이 됩니다</div>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ marginTop: 14 }}>
          <button onClick={submit} style={{ width: '100%', padding: 12, background: '#0a86f3', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700 }}>제보 제출</button>
        </div>
      </div>
    </div>
  )
}
