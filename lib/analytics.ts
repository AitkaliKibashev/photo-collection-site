export const trackPageView = async (path: string) => {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct',
        path,
      }),
    })
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

