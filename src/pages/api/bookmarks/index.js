export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  try {
    const backendRes = await fetch(`${backendUrl}/api/bookmarks`, {
      headers: { Authorization: req.headers.authorization || '' },
    })
    const data = await backendRes.json().catch(() => ({}))
    res.status(backendRes.status).json(data)
  } catch (error) {
    res.status(502).json({ message: '백엔드 서버에 연결하지 못했습니다.' })
  }
}
