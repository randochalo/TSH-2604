import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/accounts - List all accounts
router.get('/', async (req, res) => {
  try {
    const { type } = req.query
    
    const where: any = {}
    if (type) where.type = type

    const accounts = await prisma.account.findMany({
      where,
      orderBy: { code: 'asc' },
    })
    res.json(accounts)
  } catch (error) {
    console.error('Error fetching accounts:', error)
    res.status(500).json({ error: 'Failed to fetch accounts' })
  }
})

// GET /api/accounts/:id - Get single account with entries
router.get('/:id', async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: req.params.id },
      include: {
        journalLines: {
          include: {
            entry: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })
    if (!account) {
      return res.status(404).json({ error: 'Account not found' })
    }
    res.json(account)
  } catch (error) {
    console.error('Error fetching account:', error)
    res.status(500).json({ error: 'Failed to fetch account' })
  }
})

// POST /api/accounts - Create new account
router.post('/', async (req, res) => {
  try {
    const account = await prisma.account.create({
      data: req.body,
    })
    res.status(201).json(account)
  } catch (error) {
    console.error('Error creating account:', error)
    res.status(500).json({ error: 'Failed to create account' })
  }
})

export { router as accountsRouter }