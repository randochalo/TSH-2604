'use client'

import { useState, useEffect } from 'react'

interface Document {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  entityType: string
  entityId: string
  uploadedAt: string
  uploadedBy?: string
}

interface DocumentListProps {
  entityType?: string
  entityId?: string
  showActions?: boolean
  onDelete?: (doc: Document) => void
  compact?: boolean
}

export function DocumentList({
  entityType,
  entityId,
  showActions = true,
  onDelete,
  compact = false
}: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [entityType, entityId])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      let url = '/api/documents'
      const params = new URLSearchParams()
      if (entityType) params.append('entityType', entityType)
      if (entityId) params.append('entityId', entityId)
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch documents')
      
      const data = await response.json()
      setDocuments(data.documents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Delete "${doc.originalName}"?`)) return

    try {
      const response = await fetch(`/api/documents/${doc.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete')

      setDocuments(prev => prev.filter(d => d.id !== doc.id))
      if (onDelete) onDelete(doc)
    } catch (err) {
      alert('Failed to delete document')
    }
  }

  const handleDownload = (doc: Document) => {
    window.open(`/api/documents/${doc.id}/download`, '_blank')
  }

  const handleView = (doc: Document) => {
    if (doc.mimeType.startsWith('image/') || doc.mimeType === 'application/pdf') {
      setSelectedDoc(doc)
    } else {
      handleDownload(doc)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (mimeType: string, fileName: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType === 'application/pdf') return '📄'
    if (mimeType.includes('word') || fileName.endsWith('.doc') || fileName.endsWith('.docx')) return '📝'
    if (mimeType.includes('excel') || fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) return '📊'
    if (mimeType.includes('powerpoint') || fileName.endsWith('.ppt')) return '📽️'
    return '📎'
  }

  const getEntityLabel = (type: string): string => {
    const labels: Record<string, string> = {
      job: 'Job',
      shipment: 'Shipment',
      invoice: 'Invoice',
      customer: 'Customer',
      vendor: 'Vendor',
      general: 'General'
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className={`animate-pulse ${compact ? 'space-y-2' : 'space-y-3'}`}>
        {[1, 2, 3].map(i => (
          <div key={i} className={`bg-gray-100 rounded ${compact ? 'h-10' : 'h-16'}`} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
        Error: {error}
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-3xl mb-2">📂</div>
        <p className="text-sm">No documents found</p>
      </div>
    )
  }

  return (
    <>
      <div className={`space-y-2 ${compact ? '' : 'max-h-96 overflow-y-auto'}`}>
        {documents.map(doc => (
          <div
            key={doc.id}
            className={`group flex items-center gap-3 p-3 bg-white border rounded-lg hover:border-blue-300 hover:shadow-sm transition-all ${
              compact ? 'text-sm' : ''
            }`}
          >
            <span className="text-xl flex-shrink-0">
              {getFileIcon(doc.mimeType, doc.originalName)}
            </span>

            <div className="flex-1 min-w-0">
              <button
                onClick={() => handleView(doc)}
                className="text-left hover:text-blue-600"
              >
                <p className="font-medium truncate">{doc.originalName}</p>
              </button>
              
              {!compact && (
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{formatFileSize(doc.size)}</span>
                  <span>•</span>
                  <span>{getEntityLabel(doc.entityType)}</span>
                  <span>•</span>
                  <span>{formatDate(doc.uploadedAt)}</span>
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleView(doc)}
                  className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="View"
                >
                  👁️
                </button>
                <button
                  onClick={() => handleDownload(doc)}
                  className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                  title="Download"
                >
                  ⬇️
                </button>
                <button
                  onClick={() => handleDelete(doc)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium truncate">{selectedDoc.originalName}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedDoc)}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="h-[70vh] bg-gray-100">
              {selectedDoc.mimeType.startsWith('image/') ? (
                <img
                  src={`/api/documents/${selectedDoc.id}/view`}
                  alt={selectedDoc.originalName}
                  className="w-full h-full object-contain"
                />
              ) : selectedDoc.mimeType === 'application/pdf' ? (
                <iframe
                  src={`/api/documents/${selectedDoc.id}/view`}
                  className="w-full h-full"
                  title={selectedDoc.originalName}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📄</div>
                    <p>Preview not available</p>
                    <button
                      onClick={() => handleDownload(selectedDoc)}
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      Download to view
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
