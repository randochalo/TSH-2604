'use client'

import { useState, useEffect } from 'react'
import { DocumentUpload } from '@/components/document-upload'
import { DocumentList } from '@/components/document-list'

interface DocumentStats {
  totalDocuments: number
  totalSize: number
  byType: Array<{
    entityType: string
    _count: { id: number }
    _sum: { size: number | null }
  }>
  recentUploads: Array<{
    id: string
    originalName: string
    entityType: string
    uploadedAt: string
  }>
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'upload'>('all')
  const [stats, setStats] = useState<DocumentStats | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/documents/stats/overview')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const handleUploadComplete = () => {
    setActiveTab('all')
    setRefreshKey(prev => prev + 1)
    fetchStats()
  }

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getEntityLabel = (type: string): string => {
    const labels: Record<string, string> = {
      job: 'Jobs',
      shipment: 'Shipments',
      invoice: 'Invoices',
      customer: 'Customers',
      vendor: 'Vendors',
      general: 'General'
    }
    return labels[type] || type
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-gray-600 mt-1">Manage and organize your files</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Documents
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upload New
          </button>
        </div>
      </div>

      {activeTab === 'all' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-semibold">All Documents</h2>
              </div>
              <div className="p-4">
                <DocumentList key={refreshKey} />
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold mb-4">Overview</h3>
              {stats ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Files</span>
                    <span className="font-semibold text-lg">{stats.totalDocuments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Storage Used</span>
                    <span className="font-semibold text-lg">{formatSize(stats.totalSize)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.min((stats.totalSize / (1024 * 1024 * 1024)) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatSize(stats.totalSize)} of 1 GB used
                  </p>
                </div>
              ) : (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded" />
                </div>
              )}
            </div>

            {/* By Type */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold mb-4">By Category</h3>
              {stats ? (
                <div className="space-y-2">
                  {stats.byType.map(type => (
                    <div
                      key={type.entityType}
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <span className="text-gray-600">{getEntityLabel(type.entityType)}</span>
                      <div className="text-right">
                        <div className="font-medium">{type._count.id} files</div>
                        <div className="text-xs text-gray-500">
                          {formatSize(type._sum.size || 0)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-8 bg-gray-100 rounded" />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Uploads */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="font-semibold mb-4">Recent Uploads</h3>
              {stats ? (
                <div className="space-y-2">
                  {stats.recentUploads.map(doc => (
                    <div
                      key={doc.id}
                      className="text-sm py-2 border-b last:border-0"
                    >
                      <div className="font-medium truncate">{doc.originalName}</div>
                      <div className="text-xs text-gray-500">
                        {getEntityLabel(doc.entityType)} • {new Date(doc.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-10 bg-gray-100 rounded" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="font-semibold mb-4">Upload Documents</h2>
            <DocumentUpload
              onUploadComplete={handleUploadComplete}
              onUploadError={(error) => alert(error)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
