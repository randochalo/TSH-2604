'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function HMSError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('HMS error:', error)
  }, [error])

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg border shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚛</span>
        </div>
        
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Haulage Management Error
        </h1>
        
        <p className="text-gray-600 mb-4">
          There was a problem loading the haulage management module.
        </p>

        {error.message && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-left">
            <p className="text-sm text-red-700 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
          <Link
            href="/hms"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Back to HMS
          </Link>
        </div>
      </div>
    </div>
  )
}
