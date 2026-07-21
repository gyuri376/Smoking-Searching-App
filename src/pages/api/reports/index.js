// 브라우저 -> (같은 도메인, CORS 없음) -> 이 서버리스 함수 -> (서버 대 서버, CORS 무관) -> 실제 백엔드
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { userId } = req.query
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  try {
    const backendRes = await fetch(`${backendUrl}/api/reports?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.authorization || '',
      },
      body: JSON.stringify(req.body),
    })
    const data = await backendRes.json().catch(() => ({}))
    res.status(backendRes.status).json(data)
  } catch (error) {
    res.status(502).json({ message: '백엔드 서버에 연결하지 못했습니다.' })
  }
}
