'use client'

import { useEffect } from 'react'

/**
 * Fires a silent analytics beacon on page mount.
 * Does not block rendering, never throws to the user.
 */
export default function AnalyticsTracker({ page }: { page: string }) {
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'page', page }),
    }).catch(() => {})
  }, [page])

  return null
}
