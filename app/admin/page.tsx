'use client'

import { useContext, useEffect } from 'react'
import { AuthContext } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/ImageUploader'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Home, BarChart3 } from 'lucide-react'

export default function AdminPage() {
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [loading, user])

  if (loading)
    return (
      <div className={'flex min-h-[600px] w-full items-center justify-center'}>
        <Spinner className={'size-6'} />
      </div>
    )

  if (!user) return null

  const handleHomeClick = () => {
    router.push('/')
  }

  return (
    <div className="p-3 sm:p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl">Admin Panel</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push('/admin/analytics')}
            variant="outline"
            className="flex w-full items-center gap-2 sm:w-auto"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </Button>
          <Button
            onClick={handleHomeClick}
            variant="outline"
            className="flex w-full items-center gap-2 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Главная</span>
            <span className="sm:hidden">Home</span>
          </Button>
        </div>
      </div>
      <ImageUploader />
    </div>
  )
}
