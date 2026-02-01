import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '@logisticspro/database'

const router = Router()

// Ensure uploads directory exists
const uploadsDir = process.env.UPLOADS_DIR || './uploads'
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Organize by entity type
    const entityType = req.body.entityType || 'general'
    const entityDir = path.join(uploadsDir, entityType)
    if (!fs.existsSync(entityDir)) {
      fs.mkdirSync(entityDir, { recursive: true })
    }
    cb(null, entityDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

// File filter
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimes = [
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
    'text/plain', 'text/csv',
    // Archives
    'application/zip', 'application/x-zip-compressed'
  ]
  
  const allowedExts = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', 
    '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.zip']
  
  const ext = path.extname(file.originalname).toLowerCase()
  
  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype || ext}`), false)
  }
}

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 10 // Max 10 files per upload
  }
})

// GET /api/documents - List documents
router.get('/', async (req, res) => {
  try {
    const { entityType, entityId, page = 1, limit = 20 } = req.query
    
    const where: any = {}
    if (entityType) where.entityType = entityType
    if (entityId) where.entityId = entityId

    const skip = (Number(page) - 1) * Number(limit)
    
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.document.count({ where })
    ])

    res.json({
      documents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
})

// GET /api/documents/:id - Get single document
router.get('/:id', async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id }
    })

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    res.json(document)
  } catch (error) {
    console.error('Error fetching document:', error)
    res.status(500).json({ error: 'Failed to fetch document' })
  }
})

// GET /api/documents/:id/download - Download document
router.get('/:id/download', async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id }
    })

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    if (!fs.existsSync(document.path)) {
      return res.status(404).json({ error: 'File not found on server' })
    }

    res.setHeader('Content-Type', document.mimeType)
    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`)
    
    const fileStream = fs.createReadStream(document.path)
    fileStream.pipe(res)
  } catch (error) {
    console.error('Error downloading document:', error)
    res.status(500).json({ error: 'Failed to download document' })
  }
})

// GET /api/documents/:id/view - View document inline
router.get('/:id/view', async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id }
    })

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    if (!fs.existsSync(document.path)) {
      return res.status(404).json({ error: 'File not found on server' })
    }

    // For images and PDFs, show inline
    const inlineTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
    const disposition = inlineTypes.includes(document.mimeType) ? 'inline' : 'attachment'
    
    res.setHeader('Content-Type', document.mimeType)
    res.setHeader('Content-Disposition', `${disposition}; filename="${document.originalName}"`)
    
    const fileStream = fs.createReadStream(document.path)
    fileStream.pipe(res)
  } catch (error) {
    console.error('Error viewing document:', error)
    res.status(500).json({ error: 'Failed to view document' })
  }
})

// POST /api/documents/upload - Upload documents
router.post('/upload', upload.array('files', 10), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[]
    const { entityType, entityId, shipmentId } = req.body
    const uploadedBy = (req as any).user?.id || 'system'

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' })
    }

    // Create document records in database
    const documents = await Promise.all(
      files.map(file =>
        prisma.document.create({
          data: {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            entityType: entityType || 'general',
            entityId: entityId || '',
            shipmentId: shipmentId || null,
            uploadedBy,
          }
        })
      )
    )

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'UPLOAD',
        entityType: 'Document',
        entityId: documents.map(d => d.id).join(','),
        description: `Uploaded ${files.length} file(s)`,
        newValues: { files: files.map(f => f.originalname) }
      }
    })

    res.status(201).json({
      success: true,
      documents,
      uploaded: files.length
    })
  } catch (error) {
    console.error('Error uploading documents:', error)
    res.status(500).json({ error: 'Failed to upload documents' })
  }
})

// DELETE /api/documents/:id - Delete document
router.delete('/:id', async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id }
    })

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    // Delete file from filesystem
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path)
    }

    // Delete from database
    await prisma.document.delete({
      where: { id: req.params.id }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'DELETE',
        entityType: 'Document',
        entityId: document.id,
        description: `Deleted document: ${document.originalName}`,
        oldValues: document
      }
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    res.status(500).json({ error: 'Failed to delete document' })
  }
})

// PATCH /api/documents/:id - Update document metadata
router.patch('/:id', async (req, res) => {
  try {
    const { entityType, entityId } = req.body

    const document = await prisma.document.update({
      where: { id: req.params.id },
      data: {
        entityType,
        entityId,
      }
    })

    res.json(document)
  } catch (error) {
    console.error('Error updating document:', error)
    res.status(500).json({ error: 'Failed to update document' })
  }
})

// POST /api/documents/link - Link document to entity
router.post('/link', async (req, res) => {
  try {
    const { documentId, entityType, entityId } = req.body

    const document = await prisma.document.update({
      where: { id: documentId },
      data: {
        entityType,
        entityId,
      }
    })

    res.json({ success: true, document })
  } catch (error) {
    console.error('Error linking document:', error)
    res.status(500).json({ error: 'Failed to link document' })
  }
})

// GET /api/documents/stats - Get document statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalDocuments = await prisma.document.count()
    
    const totalSize = await prisma.document.aggregate({
      _sum: { size: true }
    })

    const byType = await prisma.document.groupBy({
      by: ['entityType'],
      _count: { id: true },
      _sum: { size: true }
    })

    const recentUploads = await prisma.document.findMany({
      orderBy: { uploadedAt: 'desc' },
      take: 5
    })

    res.json({
      totalDocuments,
      totalSize: totalSize._sum.size || 0,
      byType,
      recentUploads
    })
  } catch (error) {
    console.error('Error fetching document stats:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export { router as documentsRouter }
