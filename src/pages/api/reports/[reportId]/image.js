// 사진 첨부는 multipart/form-data라 body를 파싱하지 않고 그대로 전달한다.
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { reportId, userId } = req.query
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  try {
    const chunks = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks)

    const backendRes = await fetch(`${backendUrl}/api/reports/${reportId}/image?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'],
        Authorization: req.headers.authorization || '',
      },
      body,
    })
    const data = await backendRes.json().catch(() => ({}))
    res.status(backendRes.status).json(data)
  } catch (error) {
    res.status(502).json({ message: '이미지 업로드 중 오류가 발생했습니다.' })
  }
}
