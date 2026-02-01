import { Router } from 'express'

const router = Router()

// GET /api/tenders - List all tenders
router.get('/', async (req, res) => {
  try {
    const tenders = [
      { 
        id: 'T-2026-001', 
        title: 'Port Klang Container Haulage', 
        client: 'Westport Malaysia', 
        value: 2500000, 
        submittedDate: '2026-01-15', 
        status: 'WON',
        closingDate: '2026-02-28',
        description: '3-year contract for container haulage services',
        serviceType: 'Haulage',
      },
      { 
        id: 'T-2026-002', 
        title: 'Warehouse Management Services', 
        client: 'TechGear Sdn Bhd', 
        value: 1200000, 
        submittedDate: '2026-01-20', 
        status: 'PENDING',
        closingDate: '2026-03-15',
        description: 'Warehousing and distribution services',
        serviceType: 'Warehouse',
      },
      { 
        id: 'T-2026-003', 
        title: 'Freight Forwarding - APAC', 
        client: 'Global Trade Inc', 
        value: 3500000, 
        submittedDate: '2026-01-25', 
        status: 'PENDING',
        closingDate: '2026-03-30',
        description: 'Regional freight forwarding services',
        serviceType: 'Forwarding',
      },
      { 
        id: 'T-2026-004', 
        title: 'Terminal Operations', 
        client: 'Northport', 
        value: 1800000, 
        submittedDate: '2025-12-10', 
        status: 'LOST',
        closingDate: '2026-01-31',
        description: 'Container terminal operations',
        serviceType: 'Terminal',
      },
      { 
        id: 'T-2026-005', 
        title: 'Customs Clearance Services', 
        client: 'ImportEx Ltd', 
        value: 800000, 
        submittedDate: '2026-02-01', 
        status: 'WON',
        closingDate: '2026-02-28',
        description: 'Customs brokerage services',
        serviceType: 'Forwarding',
      },
    ]
    
    const stats = {
      totalSubmitted: 24,
      totalWon: 8,
      totalLost: 12,
      pending: 4,
      winRate: 33.3,
      totalValue: 12500000,
      byServiceType: {
        Haulage: { submitted: 8, won: 5, lost: 2, pending: 1 },
        Forwarding: { submitted: 10, won: 2, lost: 6, pending: 2 },
        Warehouse: { submitted: 4, won: 1, lost: 2, pending: 1 },
        Terminal: { submitted: 2, won: 0, lost: 2, pending: 0 },
      }
    }
    
    res.json({ tenders, stats })
  } catch (error) {
    console.error('Error fetching tenders:', error)
    res.status(500).json({ error: 'Failed to fetch tenders' })
  }
})

// POST /api/tenders - Create new tender
router.post('/', async (req, res) => {
  try {
    const tender = {
      id: `T-${Date.now()}`,
      ...req.body,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    }
    res.status(201).json(tender)
  } catch (error) {
    console.error('Error creating tender:', error)
    res.status(500).json({ error: 'Failed to create tender' })
  }
})

// GET /api/tenders/rates - Historical rates database
router.get('/rates', async (req, res) => {
  try {
    const rates = [
      { route: 'Port Klang → Singapore', containerType: '20\' GP', ourRate: 850, marketAvg: 900, lowestBid: 820, lastUpdated: '2026-02-01' },
      { route: 'Port Klang → Singapore', containerType: '40\' GP', ourRate: 1200, marketAvg: 1250, lowestBid: 1150, lastUpdated: '2026-02-01' },
      { route: 'Port Klang → Penang', containerType: '20\' GP', ourRate: 650, marketAvg: 700, lowestBid: 620, lastUpdated: '2026-01-28' },
      { route: 'Johor → Port Klang', containerType: '40\' HQ', ourRate: 1450, marketAvg: 1500, lowestBid: 1380, lastUpdated: '2026-01-25' },
      { route: 'Penang → Singapore', containerType: '20\' GP', ourRate: 550, marketAvg: 600, lowestBid: 520, lastUpdated: '2026-01-20' },
    ]
    res.json({ rates })
  } catch (error) {
    console.error('Error fetching rates:', error)
    res.status(500).json({ error: 'Failed to fetch rates' })
  }
})

export { router as tendersRouter }
