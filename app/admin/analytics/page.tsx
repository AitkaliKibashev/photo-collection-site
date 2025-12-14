'use client'

import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'
import { fetchAnalytics } from '@/lib/fetchAnalytics'
import { AnalyticsData } from '@/types/Analytics'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function AnalyticsPage() {
  const { user, loading } = useContext(AuthContext)
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([])
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      loadAnalytics()
    }
  }, [user])

  const loadAnalytics = async () => {
    try {
      setLoadingAnalytics(true)
      const data = await fetchAnalytics(500)
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoadingAnalytics(false)
    }
  }

  const handleHomeClick = () => {
    router.push('/')
  }

  if (loading || loadingAnalytics)
    return (
      <div className={'flex min-h-[600px] w-full items-center justify-center'}>
        <Spinner className={'size-6'} />
      </div>
    )

  if (!user) return null

  // Статистика
  const totalVisits = analytics.length
  const uniqueBrowsers = new Set(analytics.map((a) => a.browser)).size
  const uniqueOS = new Set(analytics.map((a) => a.os)).size
  const uniqueCities = new Set(
    analytics.filter((a) => a.city).map((a) => a.city),
  ).size

  // Топ браузеры
  const browserStats = analytics.reduce(
    (acc, item) => {
      acc[item.browser] = (acc[item.browser] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Топ ОС
  const osStats = analytics.reduce(
    (acc, item) => {
      acc[item.os] = (acc[item.os] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Топ города
  const cityStats = analytics
    .filter((a) => a.city)
    .reduce(
      (acc, item) => {
        const key = `${item.city}, ${item.country || 'Unknown'}`
        acc[key] = (acc[key] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  return (
    <div className="p-3 sm:p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl">Analytics</h1>
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

      {/* Статистика */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Total Visits</p>
          <p className="text-2xl font-bold">{totalVisits}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Browsers</p>
          <p className="text-2xl font-bold">{uniqueBrowsers}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow">
          <p className="text-sm text-gray-600">OS Types</p>
          <p className="text-2xl font-bold">{uniqueOS}</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow">
          <p className="text-sm text-gray-600">Cities</p>
          <p className="text-2xl font-bold">{uniqueCities}</p>
        </div>
      </div>

      {/* Топ статистика */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {/* Топ браузеры */}
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="mb-3 font-semibold">Top Browsers</h3>
          <div className="space-y-2">
            {Object.entries(browserStats)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([browser, count]) => (
                <div key={browser} className="flex justify-between text-sm">
                  <span>{browser}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Топ ОС */}
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="mb-3 font-semibold">Top OS</h3>
          <div className="space-y-2">
            {Object.entries(osStats)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([os, count]) => (
                <div key={os} className="flex justify-between text-sm">
                  <span>{os}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Топ города */}
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="mb-3 font-semibold">Top Cities</h3>
          <div className="space-y-2">
            {Object.entries(cityStats)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([city, count]) => (
                <div key={city} className="flex justify-between text-sm">
                  <span>{city}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Таблица всех визитов */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Browser
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                OS
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                City
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Referrer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                IP
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Path
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {analytics.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">
                  {item.browser}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">
                  {item.os}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">
                  {item.city
                    ? `${item.city}, ${item.country || ''}`
                    : 'Unknown'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="max-w-xs truncate">{item.referrer}</span>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">
                  {item.ip}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">
                  {item.path}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {analytics.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No analytics data yet
          </div>
        )}
      </div>
    </div>
  )
}
