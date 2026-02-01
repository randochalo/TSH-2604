import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/payments - List all payments
router.get('/', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        invoice: {
          select: {
            invoiceNo: true,
            customer: { select: { name: true } },
          },
        },
      },
      orderBy: { paymentDate: 'desc' },
    })
    res.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    res.status(500).json({ error: 'Failed to fetch payments' })
  }
})

// POST /api/payments - Create new payment
router.post('/', async (req, res) => {
  try {
    const { invoiceId, amount, method, referenceNo, bankName, accountNo, paymentDate, notes } = req.body
    
    const payment = await prisma.$transaction(async (tx) => {
      // Create payment record
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amount,
          method,
          referenceNo,
          bankName,
          accountNo,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          notes,
        },
      })

      // Update invoice balance
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
        include: { payments: true },
      })

      if (invoice) {
        const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0) + amount
        const balance = invoice.total - totalPaid
        
        let status = invoice.status
        if (balance <= 0) status = 'PAID'
        else if (totalPaid > 0) status = 'PARTIAL'

        await tx.invoice.update({
          where: { id: invoiceId },
          data: {
            paidAmount: totalPaid,
            balance: Math.max(0, balance),
            status,
          },
        })
      }

      return payment
    })

    res.status(201).json(payment)
  } catch (error) {
    console.error('Error creating payment:', error)
    res.status(500).json({ error: 'Failed to create payment' })
  }
})

export { router as paymentsRouter }