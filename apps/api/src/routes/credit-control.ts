import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/credit-control/summary - Credit control dashboard
router.get('/summary', async (req, res) => {
  try {
    // Mock data for credit control summary
    const summary = {
      overview: {
        good: 15,
        hold: 3,
        blocked: 2,
        total: 20,
      },
      blockedCustomers: [
        {
          id: 'CUST-001',
          name: 'ABC Trading Sdn Bhd',
          creditLimit: 400000,
          outstanding: 485000,
          overdue: 125000,
          daysOverdue: 95,
          reason: 'Credit limit exceeded',
        },
        {
          id: 'CUST-002',
          name: 'Global Freight Ltd',
          creditLimit: 350000,
          outstanding: 320000,
          overdue: 125000,
          daysOverdue: 95,
          reason: '90+ days overdue',
        },
      ],
      onHoldCustomers: [
        {
          id: 'CUST-003',
          name: 'Asia Shipping Co',
          creditLimit: 300000,
          outstanding: 195000,
          overdue: 45000,
          daysOverdue: 45,
          reason: 'Overdue 30+ days',
        },
      ],
      rules: [
        { name: 'Credit Limit Exceeded', condition: 'Outstanding > Credit Limit', action: 'Block', enabled: true },
        { name: 'Overdue 30 Days', condition: 'Invoice > 30 days overdue', action: 'Reminder', enabled: true },
        { name: 'Overdue 60 Days', condition: 'Invoice > 60 days overdue', action: 'Hold', enabled: true },
        { name: 'Overdue 90 Days', condition: 'Invoice > 90 days overdue', action: 'Block', enabled: true },
      ],
    }
    res.json(summary)
  } catch (error) {
    console.error('Error fetching credit control summary:', error)
    res.status(500).json({ error: 'Failed to fetch summary' })
  }
})

// POST /api/credit-control/check - Check if customer can create shipment/job
router.post('/check', async (req, res) => {
  try {
    const { customerId, amount } = req.body
    
    // Mock credit check logic
    const blockedCustomers = ['CUST-001', 'CUST-002']
    
    if (blockedCustomers.includes(customerId)) {
      return res.json({
        allowed: false,
        reason: 'Customer is blocked due to credit limit exceeded or overdue payments',
        creditStatus: 'BLOCKED',
      })
    }
    
    res.json({
      allowed: true,
      reason: 'Customer in good standing',
      creditStatus: 'GOOD',
    })
  } catch (error) {
    console.error('Error checking credit:', error)
    res.status(500).json({ error: 'Failed to check credit' })
  }
})

// GET /api/credit-control/customers/:id - Get customer credit details
router.get('/customers/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // Mock customer credit details
    const customer = {
      id,
      name: 'Sample Customer',
      creditLimit: 500000,
      outstanding: 125000,
      available: 375000,
      overdue: 0,
      creditStatus: 'GOOD',
      invoices: [
        { id: 'INV-001', amount: 45000, dueDate: '2026-03-15', status: 'PENDING' },
        { id: 'INV-002', amount: 35000, dueDate: '2026-03-20', status: 'PENDING' },
        { id: 'INV-003', amount: 45000, dueDate: '2026-03-25', status: 'PENDING' },
      ],
    }
    
    res.json(customer)
  } catch (error) {
    console.error('Error fetching customer credit:', error)
    res.status(500).json({ error: 'Failed to fetch customer credit' })
  }
})

export { router as creditControlRouter }
