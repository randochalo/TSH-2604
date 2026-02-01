import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/invoices - List all invoices
router.get('/', async (req, res) => {
  try {
    const { status, type, customerId, search } = req.query
    
    const where: any = {}
    if (status) where.status = status
    if (type) where.type = type
    if (customerId) where.customerId = customerId
    if (search) {
      where.OR = [
        { invoiceNo: { contains: search as string, mode: 'insensitive' } },
        { eInvoiceUuid: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        customer: { select: { name: true, code: true } },
        vendor: { select: { name: true, code: true } },
        items: true,
        _count: {
          select: { payments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(invoices)
  } catch (error) {
    console.error('Error fetching invoices:', error)
    res.status(500).json({ error: 'Failed to fetch invoices' })
  }
})

// GET /api/invoices/:id - Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        vendor: true,
        items: true,
        payments: true,
      },
    })
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' })
    }
    res.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    res.status(500).json({ error: 'Failed to fetch invoice' })
  }
})

// POST /api/invoices - Create new invoice
router.post('/', async (req, res) => {
  try {
    const { items, ...invoiceData } = req.body
    const invoiceNo = `INV-${Date.now().toString(36).toUpperCase()}`
    
    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0)
    const taxAmount = items.reduce((sum: number, item: any) => sum + (item.taxAmount || 0), 0)
    const total = subtotal + taxAmount
    const balance = total

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo,
        subtotal,
        taxAmount,
        total,
        balance,
        ...invoiceData,
        items: {
          create: items,
        },
      },
      include: {
        customer: true,
        vendor: true,
        items: true,
      },
    })
    res.status(201).json(invoice)
  } catch (error) {
    console.error('Error creating invoice:', error)
    res.status(500).json({ error: 'Failed to create invoice' })
  }
})

// PATCH /api/invoices/:id - Update invoice
router.patch('/:id', async (req, res) => {
  try {
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(invoice)
  } catch (error) {
    console.error('Error updating invoice:', error)
    res.status(500).json({ error: 'Failed to update invoice' })
  }
})

// POST /api/invoices/:id/submit-einvoice - Submit to IRBM
router.post('/:id/submit-einvoice', async (req, res) => {
  try {
    // This would integrate with IRBM MyInvois API
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: {
        eInvoiceStatus: 'VALIDATED',
        eInvoiceUuid: `UUID-${Date.now()}`,
        eInvoiceValidatedAt: new Date(),
        status: 'SENT',
      },
    })
    res.json(invoice)
  } catch (error) {
    console.error('Error submitting e-invoice:', error)
    res.status(500).json({ error: 'Failed to submit e-invoice' })
  }
})

export { router as invoicesRouter }