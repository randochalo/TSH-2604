import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/yard-blocks - List all yard blocks
router.get('/blocks', async (req, res) => {
  try {
    const blocks = await prisma.yardBlock.findMany({
      include: {
        _count: {
          select: { slots: true },
        },
        slots: {
          select: {
            id: true,
            row: true,
            slot: true,
            tier: true,
            containerNo: true,
            occupiedAt: true,
          },
        },
      },
      orderBy: { code: 'asc' },
    })
    res.json(blocks)
  } catch (error) {
    console.error('Error fetching yard blocks:', error)
    res.status(500).json({ error: 'Failed to fetch yard blocks' })
  }
})

// POST /api/yard-blocks - Create new yard block
router.post('/blocks', async (req, res) => {
  try {
    const { code, name, rows, tiers } = req.body
    
    const block = await prisma.$transaction(async (tx) => {
      const newBlock = await tx.yardBlock.create({
        data: { code, name, rows, tiers },
      })

      // Generate slots for the block
      const slots = []
      for (let r = 1; r <= rows; r++) {
        const rowLabel = String.fromCharCode(64 + r) // A, B, C...
        for (let s = 1; s <= 10; s++) {
          if (tiers > 0) {
            for (let t = 0; t <= tiers; t++) {
              slots.push({
                blockId: newBlock.id,
                row: rowLabel,
                slot: s.toString().padStart(2, '0'),
                tier: t,
              })
            }
          } else {
            slots.push({
              blockId: newBlock.id,
              row: rowLabel,
              slot: s.toString().padStart(2, '0'),
              tier: 0,
            })
          }
        }
      }

      await tx.yardSlot.createMany({ data: slots })

      return tx.yardBlock.findUnique({
        where: { id: newBlock.id },
        include: { slots: true },
      })
    })

    res.status(201).json(block)
  } catch (error) {
    console.error('Error creating yard block:', error)
    res.status(500).json({ error: 'Failed to create yard block' })
  }
})

// GET /api/yard/slots - Get all slots with occupancy info
router.get('/slots', async (req, res) => {
  try {
    const slots = await prisma.yardSlot.findMany({
      include: {
        block: { select: { code: true, name: true } },
      },
      orderBy: [
        { block: { code: 'asc' } },
        { row: 'asc' },
        { slot: 'asc' },
        { tier: 'asc' },
      ],
    })
    res.json(slots)
  } catch (error) {
    console.error('Error fetching yard slots:', error)
    res.status(500).json({ error: 'Failed to fetch yard slots' })
  }
})

// PATCH /api/yard/slots/:id - Update slot (for container putaway/removal)
router.patch('/slots/:id', async (req, res) => {
  try {
    const { containerNo } = req.body
    const slot = await prisma.yardSlot.update({
      where: { id: req.params.id },
      data: {
        containerNo,
        occupiedAt: containerNo ? new Date() : null,
      },
      include: {
        block: true,
      },
    })
    res.json(slot)
  } catch (error) {
    console.error('Error updating yard slot:', error)
    res.status(500).json({ error: 'Failed to update yard slot' })
  }
})

export { router as yardRouter }