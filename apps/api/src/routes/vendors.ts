import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/vendors - List all vendors
router.get('/', async (req, res) => {
  try {
    const { search, type } = req.query
    
    const where: any = {}
    if (type) where.type = type
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { code: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const vendors = await prisma.vendor.findMany({
      where,
      include: {
        branch: { select: { name: true, code: true } },
        _count: {
          select: { bills: true },
        },
      },
      orderBy: { name: 'asc' },
    })
    res.json(vendors)
  } catch (error) {
    console.error('Error fetching vendors:', error)
    res.status(500).json({ error: 'Failed to fetch vendors' })
  }
})

// GET /api/vendors/:id - Get single vendor
router.get('/:id', async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.params.id },
      include: {
        branch: true,
        bills: {
          orderBy: { invoiceDate: 'desc' },
          take: 10,
        },
      },
    })
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' })
    }
    res.json(vendor)
  } catch (error) {
    console.error('Error fetching vendor:', error)
    res.status(500).json({ error: 'Failed to fetch vendor' })
  }
})

// POST /api/vendors - Create new vendor
router.post('/', async (req, res) => {
  try {
    const code = `VEND-${Date.now().toString(36).toUpperCase()}`
    const vendor = await prisma.vendor.create({
      data: {
        code,
        ...req.body,
      },
    })
    res.status(201).json(vendor)
  } catch (error) {
    console.error('Error creating vendor:', error)
    res.status(500).json({ error: 'Failed to create vendor' })
  }
})

// PATCH /api/vendors/:id - Update vendor
router.patch('/:id', async (req, res) => {
  try {
    const vendor = await prisma.vendor.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(vendor)
  } catch (error) {
    console.error('Error updating vendor:', error)
    res.status(500).json({ error: 'Failed to update vendor' })
  }
})

export { router as vendorsRouter }