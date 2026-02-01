import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/warehouses - List all warehouses
router.get('/', async (req, res) => {
  try {
    const warehouses = await prisma.warehouse.findMany({
      include: {
        branch: { select: { name: true, code: true } },
        _count: {
          select: {
            locations: true,
            inventory: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(warehouses)
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    res.status(500).json({ error: 'Failed to fetch warehouses' })
  }
})

// GET /api/warehouses/:id - Get single warehouse
router.get('/:id', async (req, res) => {
  try {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: req.params.id },
      include: {
        branch: true,
        locations: true,
        inventory: {
          include: {
            location: true,
          },
        },
      },
    })
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' })
    }
    res.json(warehouse)
  } catch (error) {
    console.error('Error fetching warehouse:', error)
    res.status(500).json({ error: 'Failed to fetch warehouse' })
  }
})

// POST /api/warehouses - Create new warehouse
router.post('/', async (req, res) => {
  try {
    const warehouse = await prisma.warehouse.create({
      data: req.body,
      include: {
        branch: true,
      },
    })
    res.status(201).json(warehouse)
  } catch (error) {
    console.error('Error creating warehouse:', error)
    res.status(500).json({ error: 'Failed to create warehouse' })
  }
})

// PATCH /api/warehouses/:id - Update warehouse
router.patch('/:id', async (req, res) => {
  try {
    const warehouse = await prisma.warehouse.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(warehouse)
  } catch (error) {
    console.error('Error updating warehouse:', error)
    res.status(500).json({ error: 'Failed to update warehouse' })
  }
})

export { router as warehousesRouter }