import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ReportPageRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/community')
  }, [router])

  return null
}