'use client'

import { useState, useRef, useCallback } from 'react'

interface FileWithPreview extends File {
  preview?: string
  id: string
}

interface DocumentUploadProps {
  entityType?: string
  entityId?: string
  shipmentId?: string
  onUploadComplete?: (documents: any[]) => void
  onUploadError?: (error: string) => void
  maxFiles?: number
  maxSize?: number // in MB
  accept?: string
}

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_TYPES = [
  // Images
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/tiff',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  // Text
  'text/plain', 'text/csv'
]

export function DocumentUpload({
  entityType = 'general',
  entityId,
  shipmentId,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  maxSize = 50,
  accept = '.pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv'
}: DocumentUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File ${file.name} exceeds ${maxSize}MB limit`
    }
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|jpe?g|png|gif|webp|tiff|doc|docx|xls|xlsx|ppt|pptx|txt|csv)$/i)) {
      return `File type not supported: ${file.name}`
    }
    return null
  }

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return

    const validFiles: FileWithPreview[] = []
    const errors: string[] = []

    Array.from(newFiles).forEach(file => {
      if (files.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`)
        return
      }

      const error = validateFile(file)
      if (error) {
        errors.push(error)
        return
      }

      const fileWithPreview = Object.assign(file, {
        id: Math.random().toString(36).substring(7),
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      })
      validFiles.push(fileWithPreview)
    })

    if (errors.length > 0 && onUploadError) {
      onUploadError(errors.join(', '))
    }

    setFiles(prev => [...prev, ...validFiles])
  }, [files.length, maxFiles, onUploadError])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }, [handleFiles])

  const removeFile = useCallback((id: string) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }, [])

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    
    files.forEach(file => {
      formData.append('files', file)
    })
    
    formData.append('entityType', entityType)
    if (entityId) formData.append('entityId', entityId)
    if (shipmentId) formData.append('shipmentId', shipmentId)

    try {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      
      // Clear previews
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview)
      })
      setFiles([])
      
      if (onUploadComplete) {
        onUploadComplete(result.documents)
      }
    } catch (error) {
      if (onUploadError) {
        onUploadError(error instanceof Error ? error.message : 'Upload failed')
      }
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const icons: Record<string, string> = {
      pdf: '📄',
      doc: '📝', docx: '📝',
      xls: '📊', xlsx: '📊',
      ppt: '📽️', pptx: '📽️',
      jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️',
      txt: '📃', csv: '📃',
      zip: '📦'
    }
    return icons[ext || ''] || '📎'
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="text-4xl mb-2">📁</div>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PDF, images, documents up to {maxSize}MB each
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <span className="text-2xl">{getFileIcon(file.name)}</span>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>

              {uploading ? (
                <div className="w-20">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress[file.id] || 0}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  disabled={uploading}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && (
        <button
          onClick={uploadFiles}
          disabled={uploading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}
