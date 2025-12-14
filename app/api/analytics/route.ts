import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

// Обработка OPTIONS для CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// Функция для определения браузера
function getBrowser(userAgent: string): string {
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg'))
    return 'Chrome'
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
    return 'Safari'
  if (userAgent.includes('Edg')) return 'Edge'
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera'
  return 'Unknown'
}

// Функция для определения ОС
function getOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac OS X') || userAgent.includes('Macintosh'))
    return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (
    userAgent.includes('iOS') ||
    userAgent.includes('iPhone') ||
    userAgent.includes('iPad')
  )
    return 'iOS'
  return 'Unknown'
}

// Функция для получения геолокации по IP (неблокирующая)
async function getLocationFromIP(
  ip: string,
): Promise<{ city?: string; country?: string }> {
  try {
    // Используем бесплатный API ip-api.com с таймаутом
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 секунды таймаут

    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=city,country`,
      {
        signal: controller.signal,
      },
    )
    clearTimeout(timeoutId)

    if (!response.ok) {
      return {}
    }

    const data = await response.json()
    return {
      city: data.city || undefined,
      country: data.country || undefined,
    }
  } catch {
    // Игнорируем ошибки геолокации, не блокируем сохранение
    return {}
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userAgent, referrer, path } = body

    if (!userAgent) {
      return NextResponse.json(
        { success: false, error: 'Missing userAgent' },
        { status: 400 },
      )
    }

    // Получаем IP адрес
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    // Определяем браузер и ОС
    const browser = getBrowser(userAgent)
    const os = getOS(userAgent)

    // Получаем геолокацию с таймаутом (максимум 2 секунды)
    let city: string | undefined
    let country: string | undefined

    if (
      ip &&
      ip !== 'unknown' &&
      !ip.startsWith('127.') &&
      !ip.startsWith('::1') &&
      !ip.includes('localhost')
    ) {
      try {
        const locationPromise = getLocationFromIP(ip)
        const timeoutPromise = new Promise<{ city?: string; country?: string }>(
          (resolve) => setTimeout(() => resolve({}), 2000),
        )
        const location = await Promise.race([locationPromise, timeoutPromise])
        city = location.city
        country = location.country
      } catch {
        // Игнорируем ошибки геолокации
      }
    }

    // Сохраняем данные в Firestore (убираем undefined поля)
    const analyticsData: Record<string, unknown> = {
      timestamp: new Date(),
      userAgent,
      browser,
      os,
      referrer: referrer || 'Direct',
      path: path || '/',
    }

    // Добавляем опциональные поля только если они определены
    if (city) {
      analyticsData.city = city
    }
    if (country) {
      analyticsData.country = country
    }
    if (ip && ip !== 'unknown') {
      analyticsData.ip = ip
    }

    await addDoc(collection(db, 'analytics'), analyticsData)

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      },
    )
  } catch (error) {
    console.error('Error saving analytics:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save analytics',
        details: errorMessage,
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      },
    )
  }
}
