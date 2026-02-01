import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/customs-entries - List all customs entries
router.get('/', async (req, res) => {
  try {
    const { status, type } = req.query
    
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type

    const entries = await prisma.customsEntry.findMany({
      where,
      include: {
        shipment: {
          select: {
            shipmentNo: true,
            blNo: true,
            awbNo: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(entries)
  } catch (error) {
    console.error('Error fetching customs entries:', error)
    res.status(500).json({ error: 'Failed to fetch customs entries' })
  }
})

// GET /api/customs-entries/:id - Get single customs entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await prisma.customsEntry.findUnique({
      where: { id: req.params.id },
      include: {
        shipment: {
          include: {
            shipper: true,
            consignee: true,
          },
        },
      },
    })
    if (!entry) {
      return res.status(404).json({ error: 'Customs entry not found' })
    }
    res.json(entry)
  } catch (error) {
    console.error('Error fetching customs entry:', error)
    res.status(500).json({ error: 'Failed to fetch customs entry' })
  }
})

// POST /api/customs-entries - Create new customs entry
router.post('/', async (req, res) => {
  try {
    const entryNo = `CUS-${Date.now().toString(36).toUpperCase()}`
    const entry = await prisma.customsEntry.create({
      data: {
        entryNo,
        ...req.body,
      },
    })
    res.status(201).json(entry)
  } catch (error) {
    console.error('Error creating customs entry:', error)
    res.status(500).json({ error: 'Failed to create customs entry' })
  }
})

// PATCH /api/customs-entries/:id - Update customs entry
router.patch('/:id', async (req, res) => {
  try {
    const entry = await prisma.customsEntry.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(entry)
  } catch (error) {
    console.error('Error updating customs entry:', error)
    res.status(500).json({ error: 'Failed to update customs entry' })
  }
})

export { router as customsEntriesRouter }