import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { AnalyticsData } from '@/types/Analytics'

export const fetchAnalytics = async (limitCount: number = 100): Promise<AnalyticsData[]> => {
  const q = query(
    collection(db, 'analytics'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  )

  const snap = await getDocs(q)

  return snap.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp?.toDate() || new Date(data.timestamp),
    } as AnalyticsData
  })
}

