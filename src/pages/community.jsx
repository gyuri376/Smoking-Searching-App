import React, { useState } from 'react'
import { submitReport, attachReportImage, getUserIdFromToken } from '../api'
import { useAppContext } from '../context/AppContext'

function notify(message, type) {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }))
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('위치 정보를 사용할 수 없습니다.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => reject(new Error('위치 권한이 필요합니다.')),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

function readImageAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('이미지를 읽지 못했습니다.'))
    reader.readAsDataURL(file)
  })
}

// 새 흡연구역 제보 폼. 현재는 신규 장소 제보(NEW_SMOKING_AREA)만 지원합니다.
// /api/reports, /api/reports/{id}/image 프록시(우리 도메인의 서버리스 API 라우트)를 거쳐 실제 백엔드에 등록되고,
// 관리자 승인 전에도 바로 확인할 수 있도록 로컬에도 함께 저장합니다.
function ReportForm() {
  const { authToken } = useAppContext()
  const [place, setPlace] = useState('')
  const [address, setAddress] = useState('')
  const [image, setImage] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    if (!authToken) {
      notify('로그인 후 이용해주세요.', 'info')
      return
    }
    if (!place.trim() || !address.trim()) {
      notify('장소명과 주소를 입력해 주세요.', 'error')
      return
    }
    const userId = getUserIdFromToken(authToken)
    setSubmitting(true)
    try {
      const position = await getCurrentPosition()
      const report = await submitReport(authToken, userId, {
        reportType: 'NEW_SMOKING_AREA',
        suggestedName: place,
        address,
        latitude: position.lat,
        longitude: position.lng,
        reporterLatitude: position.lat,
        reporterLongitude: position.lng,
      })

      const imageDataUrl = image ? await readImageAsDataUrl(image) : ''
      if (image) {
        await attachReportImage(authToken, userId, report.reportId, image)
      }

      // 관리자 승인 전에도 바로 홈 목록에서 확인할 수 있도록 로컬에도 저장
      const localReports = JSON.parse(window.localStorage.getItem('reports') || '[]')
      localReports.unshift({
        id: report.reportId,
        place,
        address,
        latitude: position.lat,
        longitude: position.lng,
        image: imageDataUrl,
        created: new Date().toISOString(),
      })
      window.localStorage.setItem('reports', JSON.stringify(localReports))

      notify('제보가 등록되었습니다. 감사합니다!', 'success')
      setPlace('')
      setAddress('')
      setImage(null)
    } catch (error) {
      notify(error.message || '제보 등록 중 오류가 발생했습니다.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="report-card" style={{ marginBottom: 24 }}>
      <h3 className="report-title">신규 흡연구역 제보</h3>
      <p className="report-subtitle">현재 위치를 해당 흡연구역의 위치로 등록합니다.</p>
      <div className="form-group">
        <label className="form-label">장소명</label>
        <input className="form-input" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="예: 구미역 앞 흡연부스" />
      </div>
      <div className="form-group">
        <label className="form-label">주소</label>
        <input className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="예: 경상북도 구미시 원평동 123" />
      </div>
      <div className="form-group">
        <label className="form-label">사진 업로드 (선택)</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
      </div>
      <button onClick={submit} className="report-submit-btn" type="button" disabled={submitting}>
        {submitting ? '등록 중...' : '등록하기'}
      </button>
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