import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/locations - List all warehouse locations
router.get('/', async (req, res) => {
  try {
    const { warehouseId, type } = req.query
    
    const where: any = {}
    if (warehouseId) where.warehouseId = warehouseId
    if (type) where.type = type

    const locations = await prisma.warehouseLocation.findMany({
      where,
      include: {
        warehouse: { select: { name: true, code: true } },
        _count: {
          select: { inventory: true },
        },
      },
      orderBy: { code: 'asc' },
    })
    res.json(locations)
  } catch (error) {
    console.error('Error fetching locations:', error)
    res.status(500).json({ error: 'Failed to fetch locations' })
  }
})

// GET /api/locations/:id - Get single location
router.get('/:id', async (req, res) => {
  try {
    const location = await prisma.warehouseLocation.findUnique({
      where: { id: req.params.id },
      include: {
        warehouse: true,
        inventory: {
          include: {
            movements: {
              orderBy: { createdAt: 'desc' },
              take: 10,
            },
          },
        },
      },
    })
    if (!location) {
      return res.status(404).json({ error: 'Location not found' })
    }
    res.json(location)
  } catch (error) {
    console.error('Error fetching location:', error)
    res.status(500).json({ error: 'Failed to fetch location' })
  }
})

// POST /api/locations - Create new location
router.post('/', async (req, res) => {
  try {
    const location = await prisma.warehouseLocation.create({
      data: req.body,
      include: {
        warehouse: true,
      },
    })
    res.status(201).json(location)
  } catch (error) {
    console.error('Error creating location:', error)
    res.status(500).json({ error: 'Failed to create location' })
  }
})

// PATCH /api/locations/:id - Update location
router.patch('/:id', async (req, res) => {
  try {
    const location = await prisma.warehouseLocation.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(location)
  } catch (error) {
    console.error('Error updating location:', error)
    res.status(500).json({ error: 'Failed to update location' })
  }
})

export { router as locationsRouter }