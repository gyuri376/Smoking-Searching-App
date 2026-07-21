export const SPOT_FEATURES = ['지붕 있음', '의자 있음', '재떨이 있음', '환기 잘됨', '콘센트 있음']

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || ''

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60'

const OPERATION_STATUS_LABEL = {
  OPEN: '운영중',
  CLOSED: '폐쇄됨',
  UNKNOWN: '확인불가',
}

const CONGESTION_LABEL = {
  LOW: '혼잡도 낮음',
  MEDIUM: '혼잡도 보통',
  HIGH: '혼잡도 높음',
}

function distanceLabel(fromLat, fromLng, toLat, toLng) {
  const R = 6371000
  const dLat = (toLat - fromLat) * Math.PI / 180
  const dLng = (toLng - fromLng) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(fromLat * Math.PI / 180) * Math.cos(toLat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  const meters = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const minutes = Math.max(1, Math.round(meters / 80))
  return `도보 ${minutes}분`
}

function mapArea(area, fromLat, fromLng) {
  return {
    id: area.id,
    title: area.name,
    address: area.address,
    lat: area.latitude,
    lng: area.longitude,
    distance: fromLat != null && fromLng != null ? distanceLabel(fromLat, fromLng, area.latitude, area.longitude) : '',
    status: OPERATION_STATUS_LABEL[area.operationStatus] || '확인불가',
    crowd: CONGESTION_LABEL[area.congestionLevel] || '정보 없음',
    info: area.description || '',
    img: area.imageUrl || FALLBACK_IMG,
  }
}

async function fetchAllAreas() {
  const response = await fetch(`${BACKEND_BASE_URL}/api/smoking-areas`)
  if (!response.ok) {
    throw new Error('흡연구역 목록을 불러오지 못했습니다.')
  }
  return response.json()
}

// 흡연구역 목록 조회 (GET /api/smoking-areas, 인증 불필요)
export async function fetchNearbySmokingAreas(lat, lng) {
  const areas = await fetchAllAreas()
  const localSpots = getLocalReportSpots(lat, lng)
  return [...localSpots, ...areas.map((area) => mapArea(area, lat, lng))]
}

// 로컬(localStorage)에 저장된 제보를 목록/지도에 표시할 spot 형태로 변환
export function getLocalReportSpots(fromLat, fromLng) {
  if (typeof window === 'undefined') return []
  let reports = []
  try {
    reports = JSON.parse(window.localStorage.getItem('reports') || '[]')
  } catch {
    return []
  }
  return reports.map((r) => ({
    id: `report-${r.id}`,
    title: r.place,
    address: r.address,
    lat: r.latitude,
    lng: r.longitude,
    distance: fromLat != null && fromLng != null && r.latitude != null && r.longitude != null
      ? distanceLabel(fromLat, fromLng, r.latitude, r.longitude)
      : '',
    status: '제보됨',
    crowd: '정보 없음',
    info: r.address || '',
    img: r.image || FALLBACK_IMG,
  }))
}

export function createAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// JWT의 subject(sub) 클레임에 담긴 내부 유저 PK를 꺼낸다. 서명 검증은 서버가 하므로 여기선 payload만 읽는다.
export function getUserIdFromToken(token) {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return json.sub ? Number(json.sub) : null
  } catch {
    return null
  }
}

// 내 즐겨찾기 흡연구역 ID 목록 (GET /api/bookmarks, JWT 필요)
export async function fetchMyBookmarkIds(token) {
  const response = await fetch(`${BACKEND_BASE_URL}/api/bookmarks`, {
    headers: createAuthHeaders(token),
  })
  if (!response.ok) {
    throw new Error('즐겨찾기 목록을 불러오지 못했습니다.')
  }
  const data = await response.json()
  return data.smokingAreaIds || []
}

// 내 즐겨찾기 흡연구역 전체 정보 (bookmark ID + 전체 목록 교차 매칭)
export async function fetchFavoriteSmokingAreas(token) {
  const [ids, areas] = await Promise.all([fetchMyBookmarkIds(token), fetchAllAreas()])
  const idSet = new Set(ids)
  return areas.filter((area) => idSet.has(area.id)).map((area) => mapArea(area))
}

export async function addBookmark(token, smokingAreaId) {
  const response = await fetch(`${BACKEND_BASE_URL}/api/bookmarks/${smokingAreaId}`, {
    method: 'POST',
    headers: createAuthHeaders(token),
  })
  if (!response.ok) {
    throw new Error('즐겨찾기 추가에 실패했습니다.')
  }
}

export async function removeBookmark(token, smokingAreaId) {
  const response = await fetch(`${BACKEND_BASE_URL}/api/bookmarks/${smokingAreaId}`, {
    method: 'DELETE',
    headers: createAuthHeaders(token),
  })
  if (!response.ok) {
    throw new Error('즐겨찾기 삭제에 실패했습니다.')
  }
}

// 제보 등록 (POST /api/reports, JWT + userId 쿼리파라미터 둘 다 필요)
export async function submitReport(token, userId, reportRequest) {
  const response = await fetch(`${BACKEND_BASE_URL}/api/reports?userId=${userId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...createAuthHeaders(token),
    },
    body: JSON.stringify(reportRequest),
  })
  if (!response.ok) {
    throw new Error('제보 등록에 실패했습니다.')
  }
  return response.json()
}

// 제보에 사진 첨부 (POST /api/reports/{reportId}/image, multipart/form-data)
export async function attachReportImage(token, userId, reportId, imageFile) {
  const formData = new FormData()
  formData.append('image', imageFile)
  const response = await fetch(`${BACKEND_BASE_URL}/api/reports/${reportId}/image?userId=${userId}`, {
    method: 'POST',
    headers: createAuthHeaders(token),
    body: formData,
  })
  if (!response.ok) {
    throw new Error('사진 첨부에 실패했습니다.')
  }
  return response.json()
}
