import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/customers - List all customers
router.get('/', async (req, res) => {
  try {
    const { search, status, branchId } = req.query
    
    const where: any = { type: 'CUSTOMER' }
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { code: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ]
    }
    if (status) where.creditStatus = status
    if (branchId) where.branchId = branchId

    const customers = await prisma.customer.findMany({
      where,
      include: {
        branch: { select: { name: true, code: true } },
        _count: {
          select: { invoices: true, haulageJobs: true },
        },
      },
      orderBy: { name: 'asc' },
    })
    res.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    res.status(500).json({ error: 'Failed to fetch customers' })
  }
})

// GET /api/customers/:id - Get single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        branch: true,
        invoices: {
          orderBy: { invoiceDate: 'desc' },
          take: 10,
        },
        haulageJobs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' })
    }
    res.json(customer)
  } catch (error) {
    console.error('Error fetching customer:', error)
    res.status(500).json({ error: 'Failed to fetch customer' })
  }
})

// POST /api/customers - Create new customer
router.post('/', async (req, res) => {
  try {
    const code = `CUST-${Date.now().toString(36).toUpperCase()}`
    const customer = await prisma.customer.create({
      data: {
        code,
        type: 'CUSTOMER',
        ...req.body,
      },
    })
    res.status(201).json(customer)
  } catch (error) {
    console.error('Error creating customer:', error)
    res.status(500).json({ error: 'Failed to create customer' })
  }
})

// PATCH /api/customers/:id - Update customer
router.patch('/:id', async (req, res) => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    res.status(500).json({ error: 'Failed to update customer' })
  }
})

export { router as customersRouter }