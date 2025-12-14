export interface AnalyticsData {
  id?: string
  timestamp: Date
  userAgent: string
  browser: string
  os: string
  city?: string
  country?: string
  referrer: string
  path: string
  ip?: string
}

