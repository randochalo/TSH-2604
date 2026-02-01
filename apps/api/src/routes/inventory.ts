import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/inventory - List all inventory
router.get('/', async (req, res) => {
  try {
    const { sku, status, warehouseId } = req.query
    
    const where: any = {}
    if (sku) where.sku = { contains: sku as string, mode: 'insensitive' }
    if (status) where.status = status
    if (warehouseId) where.warehouseId = warehouseId

    const inventory = await prisma.inventory.findMany({
      where,
      include: {
        warehouse: { select: { name: true, code: true } },
        location: { select: { code: true, zone: true } },
        _count: {
          select: { movements: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(inventory)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    res.status(500).json({ error: 'Failed to fetch inventory' })
  }
})

// GET /api/inventory/:id - Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.inventory.findUnique({
      where: { id: req.params.id },
      include: {
        warehouse: true,
        location: true,
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' })
    }
    res.json(item)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    res.status(500).json({ error: 'Failed to fetch inventory' })
  }
})

// POST /api/inventory - Create new inventory item
router.post('/', async (req, res) => {
  try {
    const inventory = await prisma.inventory.create({
      data: req.body,
      include: {
        warehouse: true,
        location: true,
      },
    })
    res.status(201).json(inventory)
  } catch (error) {
    console.error('Error creating inventory:', error)
    res.status(500).json({ error: 'Failed to create inventory' })
  }
})

// PATCH /api/inventory/:id - Update inventory
router.patch('/:id', async (req, res) => {
  try {
    const inventory = await prisma.inventory.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(inventory)
  } catch (error) {
    console.error('Error updating inventory:', error)
    res.status(500).json({ error: 'Failed to update inventory' })
  }
})

// POST /api/inventory/:id/movements - Create inventory movement
router.post('/:id/movements', async (req, res) => {
  try {
    const { quantity, type, referenceNo, referenceType, notes } = req.body
    
    const movement = await prisma.$transaction(async (tx) => {
      // Create movement record
      const movement = await tx.inventoryMovement.create({
        data: {
          inventoryId: req.params.id,
          quantity,
          type,
          referenceNo,
          referenceType,
          notes,
        },
      })

      // Update inventory quantity based on movement type
      let quantityChange = 0
      if (type === 'RECEIPT' || type === 'TRANSFER_IN' || type === 'RETURN') {
        quantityChange = quantity
      } else if (type === 'ISSUE' || type === 'TRANSFER_OUT') {
        quantityChange = -quantity
      }

      await tx.inventory.update({
        where: { id: req.params.id },
        data: {
          quantity: { increment: quantityChange },
        },
      })

      return movement
    })

    res.status(201).json(movement)
  } catch (error) {
    console.error('Error creating movement:', error)
    res.status(500).json({ error: 'Failed to create movement' })
  }
})

export { router as inventoryRouter }