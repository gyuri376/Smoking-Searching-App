export const SPOT_FEATURES = ['지붕 있음', '의자 있음', '재떨이 있음', '환기 잘됨', '콘센트 있음']

// Mock API for nearby smoking areas
export async function fetchNearbySmokingAreas(lat, lng, radiusMeters = 1000){
  // Return some mocked locations near given coord
  const spots = [
    {id:1, title:'인동동 행정복지센터 앞 흡연부스', lat: lat + 0.002, lng: lng + 0.0012, distance:'도보 3분', status:'운영중', crowd:'혼잡도 낮음', info:'깨끗하게 관리되고 있어요!', img:'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60'},
    {id:2, title:'동락공원 흡연쉼터', lat: lat - 0.0015, lng: lng - 0.001, distance:'도보 5분', status:'운영중', crowd:'혼잡도 낮음', info:'자연 속에서 쾌적해요!', img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60'},
    {id:3, title:'구미역 앞 흡연부스', lat: lat + 0.0008, lng: lng - 0.0018, distance:'도보 7분', status:'혼잡', crowd:'혼잡도 높음', info:'출퇴근 시간엔 붐빌 수 있어요.', img:'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=60'}
  ]
  // simulate network delay
  await new Promise(r=>setTimeout(r,400))
  return spots
}

export function createAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
