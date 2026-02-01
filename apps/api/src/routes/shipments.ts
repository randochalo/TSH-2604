import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/shipments - List all shipments
router.get('/', async (req, res) => {
  try {
    const { status, mode, search } = req.query
    
    const where: any = {}
    if (status) where.status = status
    if (mode) where.mode = mode
    if (search) {
      where.OR = [
        { shipmentNo: { contains: search as string, mode: 'insensitive' } },
        { bookingNo: { contains: search as string, mode: 'insensitive' } },
        { blNo: { contains: search as string, mode: 'insensitive' } },
        { awbNo: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        shipper: true,
        consignee: true,
        carrier: true,
        containers: true,
        customsEntries: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(shipments)
  } catch (error) {
    console.error('Error fetching shipments:', error)
    res.status(500).json({ error: 'Failed to fetch shipments' })
  }
})

// GET /api/shipments/:id - Get single shipment
router.get('/:id', async (req, res) => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { id: req.params.id },
      include: {
        shipper: true,
        consignee: true,
        notifyParty: true,
        carrier: true,
        containers: true,
        customsEntries: true,
        documents: true,
      },
    })
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' })
    }
    res.json(shipment)
  } catch (error) {
    console.error('Error fetching shipment:', error)
    res.status(500).json({ error: 'Failed to fetch shipment' })
  }
})

// POST /api/shipments - Create new shipment
router.post('/', async (req, res) => {
  try {
    const shipmentNo = `SHP-${Date.now().toString(36).toUpperCase()}`
    const shipment = await prisma.shipment.create({
      data: {
        shipmentNo,
        ...req.body,
      },
      include: {
        shipper: true,
        consignee: true,
        carrier: true,
        containers: true,
      },
    })
    res.status(201).json(shipment)
  } catch (error) {
    console.error('Error creating shipment:', error)
    res.status(500).json({ error: 'Failed to create shipment' })
  }
})

// PATCH /api/shipments/:id - Update shipment
router.patch('/:id', async (req, res) => {
  try {
    const shipment = await prisma.shipment.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        shipper: true,
        consignee: true,
        carrier: true,
        containers: true,
      },
    })
    res.json(shipment)
  } catch (error) {
    console.error('Error updating shipment:', error)
    res.status(500).json({ error: 'Failed to update shipment' })
  }
})

// DELETE /api/shipments/:id - Delete shipment
router.delete('/:id', async (req, res) => {
  try {
    await prisma.shipment.delete({
      where: { id: req.params.id },
    })
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting shipment:', error)
    res.status(500).json({ error: 'Failed to delete shipment' })
  }
})

export { router as shipmentsRouter }