import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/journal-entries - List all journal entries
router.get('/', async (req, res) => {
  try {
    const { status } = req.query
    
    const where: any = {}
    if (status) where.status = status

    const entries = await prisma.journalEntry.findMany({
      where,
      include: {
        lines: {
          include: {
            account: { select: { code: true, name: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    })
    res.json(entries)
  } catch (error) {
    console.error('Error fetching journal entries:', error)
    res.status(500).json({ error: 'Failed to fetch journal entries' })
  }
})

// GET /api/journal-entries/:id - Get single entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await prisma.journalEntry.findUnique({
      where: { id: req.params.id },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    })
    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' })
    }
    res.json(entry)
  } catch (error) {
    console.error('Error fetching journal entry:', error)
    res.status(500).json({ error: 'Failed to fetch journal entry' })
  }
})

// POST /api/journal-entries - Create new journal entry
router.post('/', async (req, res) => {
  try {
    const { lines, ...entryData } = req.body
    const entryNo = `JE-${Date.now().toString(36).toUpperCase()}`
    
    // Calculate totals
    const totalDebit = lines.reduce((sum: number, line: any) => sum + (line.debit || 0), 0)
    const totalCredit = lines.reduce((sum: number, line: any) => sum + (line.credit || 0), 0)

    if (totalDebit !== totalCredit) {
      return res.status(400).json({ error: 'Debits must equal credits' })
    }

    const entry = await prisma.journalEntry.create({
      data: {
        entryNo,
        totalDebit,
        totalCredit,
        ...entryData,
        lines: {
          create: lines,
        },
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    })
    res.status(201).json(entry)
  } catch (error) {
    console.error('Error creating journal entry:', error)
    res.status(500).json({ error: 'Failed to create journal entry' })
  }
})

// POST /api/journal-entries/:id/post - Post journal entry
router.post('/:id/post', async (req, res) => {
  try {
    const entry = await prisma.journalEntry.update({
      where: { id: req.params.id },
      data: {
        status: 'POSTED',
        postedAt: new Date(),
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    })
    res.json(entry)
  } catch (error) {
    console.error('Error posting journal entry:', error)
    res.status(500).json({ error: 'Failed to post journal entry' })
  }
})

export { router as journalEntriesRouter }