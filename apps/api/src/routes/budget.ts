import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/budget - List all budget entries
router.get('/', async (req, res) => {
  try {
    const { year, department, category } = req.query
    
    const where: any = {}
    if (year) where.year = parseInt(year as string)
    if (department) where.department = department
    if (category) where.category = category

    const budgets = await prisma.budget.findMany({
      where,
      include: {
        account: { select: { code: true, name: true, type: true } },
        createdBy: { select: { name: true } },
      },
      orderBy: [{ year: 'desc' }, { account: { code: 'asc' } }],
    })
    res.json(budgets)
  } catch (error) {
    console.error('Error fetching budgets:', error)
    res.status(500).json({ error: 'Failed to fetch budgets' })
  }
})

// GET /api/budget/summary - Get budget vs actual summary
router.get('/summary', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear()

    const budgets = await prisma.budget.findMany({
      where: { year },
      include: {
        account: { select: { code: true, name: true, type: true, category: true } },
      },
    })

    // Get actuals from journal entries for the same period
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31)

    const actuals = await prisma.journalEntryLine.groupBy({
      by: ['accountId'],
      where: {
        journalEntry: {
          date: { gte: startDate, lte: endDate },
          status: 'POSTED',
        },
      },
      _sum: { debit: true, credit: true },
    })

    // Combine budget and actuals
    const summary = budgets.map(budget => {
      const actual = actuals.find(a => a.accountId === budget.accountId)
      const actualAmount = actual ? (actual._sum.debit || 0) - (actual._sum.credit || 0) : 0
      const variance = budget.amount - Math.abs(actualAmount)
      const variancePercent = budget.amount > 0 ? (variance / budget.amount) * 100 : 0

      return {
        id: budget.id,
        accountCode: budget.account.code,
        accountName: budget.account.name,
        accountType: budget.account.type,
        category: budget.account.category,
        budgetAmount: budget.amount,
        actualAmount: Math.abs(actualAmount),
        variance,
        variancePercent,
        year: budget.year,
      }
    })

    // Calculate totals
    const totalBudget = summary.reduce((sum, item) => sum + item.budgetAmount, 0)
    const totalActual = summary.reduce((sum, item) => sum + item.actualAmount, 0)
    const totalVariance = totalBudget - totalActual

    res.json({
      year,
      summary,
      totals: {
        budget: totalBudget,
        actual: totalActual,
        variance: totalVariance,
        variancePercent: totalBudget > 0 ? (totalVariance / totalBudget) * 100 : 0,
      },
    })
  } catch (error) {
    console.error('Error fetching budget summary:', error)
    res.status(500).json({ error: 'Failed to fetch budget summary' })
  }
})

// GET /api/budget/:id - Get single budget
router.get('/:id', async (req, res) => {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: req.params.id },
      include: {
        account: true,
        createdBy: { select: { name: true } },
      },
    })
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' })
    }
    res.json(budget)
  } catch (error) {
    console.error('Error fetching budget:', error)
    res.status(500).json({ error: 'Failed to fetch budget' })
  }
})

// POST /api/budget - Create new budget entry
router.post('/', async (req, res) => {
  try {
    const budget = await prisma.budget.create({
      data: req.body,
      include: {
        account: { select: { code: true, name: true } },
      },
    })
    res.status(201).json(budget)
  } catch (error) {
    console.error('Error creating budget:', error)
    res.status(500).json({ error: 'Failed to create budget' })
  }
})

// PATCH /api/budget/:id - Update budget
router.patch('/:id', async (req, res) => {
  try {
    const budget = await prisma.budget.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(budget)
  } catch (error) {
    console.error('Error updating budget:', error)
    res.status(500).json({ error: 'Failed to update budget' })
  }
})

// GET /api/budget/department/:dept - Get department budget
router.get('/department/:dept', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear()
    
    const budgets = await prisma.budget.findMany({
      where: {
        department: req.params.dept,
        year,
      },
      include: {
        account: { select: { code: true, name: true, type: true } },
      },
    })

    res.json(budgets)
  } catch (error) {
    console.error('Error fetching department budget:', error)
    res.status(500).json({ error: 'Failed to fetch department budget' })
  }
})

export { router as budgetRouter }
