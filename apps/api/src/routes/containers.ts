import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/containers - List all containers
router.get('/', async (req, res) => {
  try {
    const { search, status } = req.query
    
    const where: any = {}
    if (search) {
      where.containerNo = { contains: search as string, mode: 'insensitive' }
    }

    const containers = await prisma.container.findMany({
      where,
      include: {
        shipment: {
          select: {
            shipmentNo: true,
            status: true,
            shipper: { select: { name: true } },
            consignee: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(containers)
  } catch (error) {
    console.error('Error fetching containers:', error)
    res.status(500).json({ error: 'Failed to fetch containers' })
  }
})

// GET /api/containers/:id - Get single container
router.get('/:id', async (req, res) => {
  try {
    const container = await prisma.container.findUnique({
      where: { id: req.params.id },
      include: {
        shipment: {
          include: {
            shipper: true,
            consignee: true,
            carrier: true,
          },
        },
      },
    })
    if (!container) {
      return res.status(404).json({ error: 'Container not found' })
    }
    res.json(container)
  } catch (error) {
    console.error('Error fetching container:', error)
    res.status(500).json({ error: 'Failed to fetch container' })
  }
})

// POST /api/containers - Create new container
router.post('/', async (req, res) => {
  try {
    const container = await prisma.container.create({
      data: req.body,
      include: {
        shipment: true,
      },
    })
    res.status(201).json(container)
  } catch (error) {
    console.error('Error creating container:', error)
    res.status(500).json({ error: 'Failed to create container' })
  }
})

// PATCH /api/containers/:id - Update container
router.patch('/:id', async (req, res) => {
  try {
    const container = await prisma.container.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(container)
  } catch (error) {
    console.error('Error updating container:', error)
    res.status(500).json({ error: 'Failed to update container' })
  }
})

// DELETE /api/containers/:id - Delete container
router.delete('/:id', async (req, res) => {
  try {
    await prisma.container.delete({
      where: { id: req.params.id },
    })
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting container:', error)
    res.status(500).json({ error: 'Failed to delete container' })
  }
})

export { router as containersRouter }