import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/maintenance - List all M&R records
router.get('/', async (req, res) => {
  try {
    const { status, type, containerNo, search } = req.query
    
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (containerNo) where.containerNo = { contains: containerNo as string, mode: 'insensitive' }
    if (search) {
      where.OR = [
        { mrNo: { contains: search as string, mode: 'insensitive' } },
        { containerNo: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const records = await prisma.maintenanceRepair.findMany({
      where,
      include: {
        vendor: { select: { name: true, code: true } },
        approvedBy: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(records)
  } catch (error) {
    console.error('Error fetching M&R records:', error)
    res.status(500).json({ error: 'Failed to fetch M&R records' })
  }
})

// GET /api/maintenance/stats - Get M&R statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalPending,
      totalInProgress,
      totalCompleted,
      totalCost,
      damageCount,
    ] = await Promise.all([
      prisma.maintenanceRepair.count({ where: { status: 'PENDING' } }),
      prisma.maintenanceRepair.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.maintenanceRepair.count({ where: { status: 'COMPLETED' } }),
      prisma.maintenanceRepair.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalCost: true },
      }),
      prisma.damageInspection.count({ where: { status: 'PENDING_ASSESSMENT' } }),
    ])

    res.json({
      pending: totalPending,
      inProgress: totalInProgress,
      completed: totalCompleted,
      totalCost: totalCost._sum.totalCost || 0,
      damageAssessments: damageCount,
    })
  } catch (error) {
    console.error('Error fetching M&R stats:', error)
    res.status(500).json({ error: 'Failed to fetch M&R stats' })
  }
})

// GET /api/maintenance/:id - Get single M&R record
router.get('/:id', async (req, res) => {
  try {
    const record = await prisma.maintenanceRepair.findUnique({
      where: { id: req.params.id },
      include: {
        vendor: true,
        approvedBy: { select: { name: true, email: true } },
        damageInspection: true,
        lineItems: true,
      },
    })
    if (!record) {
      return res.status(404).json({ error: 'M&R record not found' })
    }
    res.json(record)
  } catch (error) {
    console.error('Error fetching M&R record:', error)
    res.status(500).json({ error: 'Failed to fetch M&R record' })
  }
})

// POST /api/maintenance - Create new M&R record
router.post('/', async (req, res) => {
  try {
    const mrNo = `MR-${Date.now().toString(36).toUpperCase()}`
    
    const record = await prisma.maintenanceRepair.create({
      data: {
        mrNo,
        ...req.body,
      },
      include: {
        vendor: { select: { name: true, code: true } },
      },
    })
    res.status(201).json(record)
  } catch (error) {
    console.error('Error creating M&R record:', error)
    res.status(500).json({ error: 'Failed to create M&R record' })
  }
})

// PATCH /api/maintenance/:id - Update M&R record
router.patch('/:id', async (req, res) => {
  try {
    const record = await prisma.maintenanceRepair.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(record)
  } catch (error) {
    console.error('Error updating M&R record:', error)
    res.status(500).json({ error: 'Failed to update M&R record' })
  }
})

// POST /api/maintenance/:id/approve - Approve M&R
router.post('/:id/approve', async (req, res) => {
  try {
    const { userId } = req.body
    const record = await prisma.maintenanceRepair.update({
      where: { id: req.params.id },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
        approvedById: userId,
      },
    })
    res.json(record)
  } catch (error) {
    console.error('Error approving M&R:', error)
    res.status(500).json({ error: 'Failed to approve M&R' })
  }
})

// POST /api/maintenance/:id/complete - Complete M&R
router.post('/:id/complete', async (req, res) => {
  try {
    const record = await prisma.maintenanceRepair.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })
    res.json(record)
  } catch (error) {
    console.error('Error completing M&R:', error)
    res.status(500).json({ error: 'Failed to complete M&R' })
  }
})

// Damage Inspection Routes
// GET /api/maintenance/damage - List all damage inspections
router.get('/damage/inspections', async (req, res) => {
  try {
    const { status, containerNo } = req.query
    
    const where: any = {}
    if (status) where.status = status
    if (containerNo) where.containerNo = { contains: containerNo as string, mode: 'insensitive' }

    const inspections = await prisma.damageInspection.findMany({
      where,
      include: {
        inspectedBy: { select: { name: true } },
        maintenanceRepair: { select: { mrNo: true, status: true } },
      },
      orderBy: { inspectionDate: 'desc' },
    })
    res.json(inspections)
  } catch (error) {
    console.error('Error fetching damage inspections:', error)
    res.status(500).json({ error: 'Failed to fetch damage inspections' })
  }
})

// POST /api/maintenance/damage - Create damage inspection
router.post('/damage', async (req, res) => {
  try {
    const inspectionNo = `DAM-${Date.now().toString(36).toUpperCase()}`
    
    const inspection = await prisma.damageInspection.create({
      data: {
        inspectionNo,
        ...req.body,
      },
    })
    res.status(201).json(inspection)
  } catch (error) {
    console.error('Error creating damage inspection:', error)
    res.status(500).json({ error: 'Failed to create damage inspection' })
  }
})

export { router as maintenanceRouter }
