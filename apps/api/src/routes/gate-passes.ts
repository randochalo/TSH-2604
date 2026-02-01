import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/gate-passes - List all gate passes
router.get('/', async (req, res) => {
  try {
    const { status, type, search } = req.query
    
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (search) {
      where.OR = [
        { passNo: { contains: search as string, mode: 'insensitive' } },
        { containerNo: { contains: search as string, mode: 'insensitive' } },
        { truckRegNo: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const passes = await prisma.gatePass.findMany({
      where,
      include: {
        haulier: { select: { name: true, code: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(passes)
  } catch (error) {
    console.error('Error fetching gate passes:', error)
    res.status(500).json({ error: 'Failed to fetch gate passes' })
  }
})

// GET /api/gate-passes/:id - Get single gate pass
router.get('/:id', async (req, res) => {
  try {
    const pass = await prisma.gatePass.findUnique({
      where: { id: req.params.id },
      include: {
        haulier: true,
      },
    })
    if (!pass) {
      return res.status(404).json({ error: 'Gate pass not found' })
    }
    res.json(pass)
  } catch (error) {
    console.error('Error fetching gate pass:', error)
    res.status(500).json({ error: 'Failed to fetch gate pass' })
  }
})

// POST /api/gate-passes - Create new gate pass
router.post('/', async (req, res) => {
  try {
    const passNo = `GP-${Date.now().toString(36).toUpperCase()}`
    const validUntil = new Date()
    validUntil.setHours(validUntil.getHours() + 48) // Valid for 48 hours

    const pass = await prisma.gatePass.create({
      data: {
        passNo,
        validUntil,
        ...req.body,
      },
      include: {
        haulier: true,
      },
    })
    res.status(201).json(pass)
  } catch (error) {
    console.error('Error creating gate pass:', error)
    res.status(500).json({ error: 'Failed to create gate pass' })
  }
})

// PATCH /api/gate-passes/:id - Update gate pass
router.patch('/:id', async (req, res) => {
  try {
    const pass = await prisma.gatePass.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(pass)
  } catch (error) {
    console.error('Error updating gate pass:', error)
    res.status(500).json({ error: 'Failed to update gate pass' })
  }
})

// POST /api/gate-passes/:id/gate-in - Record gate-in
router.post('/:id/gate-in', async (req, res) => {
  try {
    const pass = await prisma.gatePass.update({
      where: { id: req.params.id },
      data: {
        gateInAt: new Date(),
        status: 'USED',
      },
    })
    res.json(pass)
  } catch (error) {
    console.error('Error recording gate-in:', error)
    res.status(500).json({ error: 'Failed to record gate-in' })
  }
})

// POST /api/gate-passes/:id/gate-out - Record gate-out
router.post('/:id/gate-out', async (req, res) => {
  try {
    const pass = await prisma.gatePass.update({
      where: { id: req.params.id },
      data: {
        gateOutAt: new Date(),
        status: 'USED',
      },
    })
    res.json(pass)
  } catch (error) {
    console.error('Error recording gate-out:', error)
    res.status(500).json({ error: 'Failed to record gate-out' })
  }
})

export { router as gatePassesRouter }