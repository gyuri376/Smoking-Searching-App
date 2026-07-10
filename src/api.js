// Mock API for nearby smoking areas
export async function fetchNearbySmokingAreas(lat, lng, radiusMeters = 1000){
  // Return some mocked locations near given coord
  const spots = [
    {id:1, title:'인동동 행정복지센터 앞 흡연부스', lat: lat + 0.002, lng: lng + 0.0012, distance:'도보 3분', status:'운영중', crowd:'혼잡도 낮음', info:'깨끗하게 관리되고 있어요!', img:'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=800&q=60'},
    {id:2, title:'동락공원 흡연쉼터', lat: lat - 0.0015, lng: lng - 0.001, distance:'도보 5분', status:'운영중', crowd:'혼잡도 낮음', info:'자연 속에서 쾌적해요!', img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60'}
  ]
  // simulate network delay
  await new Promise(r=>setTimeout(r,400))
  return spots
}

export function createAuthHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
