import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/reports/financial/profit-loss - P&L Report
router.get('/financial/profit-loss', async (req, res) => {
  try {
    const { from, to } = req.query
    
    // Mock P&L data - in production, calculate from journal entries
    const data = {
      period: { from: from || '2026-01-01', to: to || '2026-12-31' },
      revenue: {
        haulage: 1250000,
        forwarding: 890000,
        warehousing: 456000,
        terminal: 234000,
        other: 125000,
        total: 2955000,
      },
      costOfSales: {
        haulage: 750000,
        forwarding: 534000,
        warehousing: 273600,
        terminal: 140400,
        other: 75000,
        total: 1773000,
      },
      grossProfit: 1182000,
      operatingExpenses: {
        salaries: 420000,
        rent: 180000,
        utilities: 45000,
        maintenance: 65000,
        marketing: 35000,
        admin: 85000,
        total: 830000,
      },
      operatingProfit: 352000,
      otherIncome: 15000,
      otherExpenses: 8000,
      netProfit: 359000,
      margins: {
        gross: 40.0,
        operating: 11.9,
        net: 12.2,
      }
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating P&L report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/balance-sheet - Balance Sheet
router.get('/financial/balance-sheet', async (req, res) => {
  try {
    const data = {
      asOf: new Date().toISOString().split('T')[0],
      assets: {
        current: {
          cash: 450000,
          accountsReceivable: 680000,
          inventory: 125000,
          prepayments: 45000,
          total: 1300000,
        },
        nonCurrent: {
          fixedAssets: 1850000,
          investments: 250000,
          total: 2100000,
        },
        total: 3400000,
      },
      liabilities: {
        current: {
          accountsPayable: 320000,
          accruals: 85000,
          shortTermLoans: 150000,
          total: 555000,
        },
        nonCurrent: {
          longTermLoans: 850000,
          deferredTax: 45000,
          total: 895000,
        },
        total: 1450000,
      },
      equity: {
        shareCapital: 1000000,
        retainedEarnings: 950000,
        total: 1950000,
      },
      totalLiabilitiesAndEquity: 3400000,
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating balance sheet:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/cash-flow - Cash Flow Statement
router.get('/financial/cash-flow', async (req, res) => {
  try {
    const { from, to } = req.query
    const data = {
      period: { from: from || '2026-01-01', to: to || '2026-12-31' },
      operating: {
        netProfit: 359000,
        depreciation: 125000,
        changesInWorkingCapital: -85000,
        total: 399000,
      },
      investing: {
        fixedAssetPurchase: -250000,
        assetDisposal: 15000,
        total: -235000,
      },
      financing: {
        loanProceeds: 100000,
        loanRepayment: -120000,
        dividends: -50000,
        total: -70000,
      },
      netChange: 94000,
      openingBalance: 356000,
      closingBalance: 450000,
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating cash flow:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/gst - GST Report
router.get('/financial/gst', async (req, res) => {
  try {
    const { period } = req.query
    const data = {
      period: period || '2026-Q1',
      outputTax: {
        standardRated: { amount: 2500000, gst: 150000 },
        zeroRated: { amount: 450000, gst: 0 },
        exempt: { amount: 50000, gst: 0 },
        totalOutput: 150000,
      },
      inputTax: {
        taxablePurchases: { amount: 1200000, gst: 72000 },
        capitalGoods: { amount: 250000, gst: 15000 },
        totalInput: 87000,
      },
      netGST: 63000,
      adjustments: 0,
      gstPayable: 63000,
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating GST report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/ageing - Debtors/Creditors Ageing
router.get('/financial/ageing', async (req, res) => {
  try {
    const { type } = req.query // 'debtors' or 'creditors'
    
    const data = {
      generatedAt: new Date().toISOString(),
      summary: {
        current: type === 'debtors' ? 420000 : 280000,
        days1to30: type === 'debtors' ? 180000 : 120000,
        days31to60: type === 'debtors' ? 65000 : 45000,
        days61to90: type === 'debtors' ? 35000 : 25000,
        over90: type === 'debtors' ? 15000 : 10000,
        total: type === 'debtors' ? 680000 : 480000,
      },
      details: type === 'debtors' ? [
        { customer: 'ABC Trading', current: 85000, days1to30: 25000, days31to60: 0, days61to90: 0, over90: 0, total: 110000 },
        { customer: 'XYZ Logistics', current: 65000, days1to30: 45000, days31to60: 15000, days61to90: 0, over90: 0, total: 125000 },
        { customer: 'Global Freight', current: 120000, days1to30: 35000, days31to60: 25000, days61to90: 10000, over90: 5000, total: 195000 },
        { customer: 'Asia Shipping', current: 50000, days1to30: 20000, days31to60: 10000, days61to90: 15000, over90: 5000, total: 100000 },
        { customer: 'Port Logistics', current: 100000, days1to30: 55000, days31to60: 15000, days61to90: 10000, over90: 5000, total: 185000 },
      ] : [
        { vendor: 'Truck Supplier Sdn Bhd', current: 65000, days1to30: 25000, days31to60: 10000, days61to90: 0, over90: 0, total: 100000 },
        { vendor: 'Warehouse Rentals', current: 45000, days1to30: 15000, days31to60: 5000, days61to90: 5000, over90: 0, total: 70000 },
        { vendor: 'Fuel Station Chain', current: 85000, days1to30: 35000, days31to60: 15000, days61to90: 5000, over90: 5000, total: 145000 },
        { vendor: 'Insurance Provider', current: 35000, days1to30: 15000, days31to60: 5000, days61to90: 5000, over90: 0, total: 60000 },
        { vendor: 'IT Services', current: 50000, days1to30: 30000, days31to60: 15000, days61to90: 10000, over90: 0, total: 105000 },
      ]
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating ageing report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/budget - Budget vs Actual
router.get('/financial/budget', async (req, res) => {
  try {
    const data = {
      period: '2026 YTD',
      revenue: {
        budget: 3200000,
        actual: 2955000,
        variance: -245000,
        variancePct: -7.7,
      },
      expenses: {
        budget: 2600000,
        actual: 2596000,
        variance: -4000,
        variancePct: -0.2,
      },
      netProfit: {
        budget: 600000,
        actual: 359000,
        variance: -241000,
        variancePct: -40.2,
      },
      byDepartment: [
        { dept: 'Haulage', budget: 1200000, actual: 1250000, variance: 50000, variancePct: 4.2 },
        { dept: 'Forwarding', budget: 950000, actual: 890000, variance: -60000, variancePct: -6.3 },
        { dept: 'Warehouse', budget: 500000, actual: 456000, variance: -44000, variancePct: -8.8 },
        { dept: 'Terminal', budget: 300000, actual: 234000, variance: -66000, variancePct: -22.0 },
        { dept: 'Admin', budget: 250000, actual: 183000, variance: -67000, variancePct: -26.8 },
      ]
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating budget report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/freight/shipments-by-lane - Shipments by Trade Lane
router.get('/freight/shipments-by-lane', async (req, res) => {
  try {
    const { from, to } = req.query
    
    const lanes = [
      { lane: 'Asia-Europe', shipments: 145, teu: 890, revenue: 2100000, cost: 1680000, profit: 420000, margin: 20 },
      { lane: 'Intra-Asia', shipments: 320, teu: 650, revenue: 1650000, cost: 1320000, profit: 330000, margin: 20 },
      { lane: 'Trans-Pacific', shipments: 98, teu: 520, revenue: 1450000, cost: 1160000, profit: 290000, margin: 20 },
      { lane: 'Asia-Middle East', shipments: 76, teu: 380, revenue: 980000, cost: 784000, profit: 196000, margin: 20 },
      { lane: 'Europe-Americas', shipments: 45, teu: 290, revenue: 750000, cost: 600000, profit: 150000, margin: 20 },
      { lane: 'Others', shipments: 87, teu: 340, revenue: 620000, cost: 496000, profit: 124000, margin: 20 },
    ]
    
    const totals = {
      shipments: lanes.reduce((sum, l) => sum + l.shipments, 0),
      teu: lanes.reduce((sum, l) => sum + l.teu, 0),
      revenue: lanes.reduce((sum, l) => sum + l.revenue, 0),
      cost: lanes.reduce((sum, l) => sum + l.cost, 0),
      profit: lanes.reduce((sum, l) => sum + l.profit, 0),
      margin: 20,
    }
    
    res.json({ lanes, totals, period: { from: from || '2026-01-01', to: to || '2026-12-31' } })
  } catch (error) {
    console.error('Error generating freight report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/freight/carrier-performance - Carrier Performance
router.get('/freight/carrier-performance', async (req, res) => {
  try {
    const carriers = [
      { carrier: 'Maersk Line', shipments: 185, onTime: 168, reliability: 90.8, avgTransit: 18, damageClaims: 2, rating: 4.5 },
      { carrier: 'MSC', shipments: 156, onTime: 138, reliability: 88.5, avgTransit: 19, damageClaims: 3, rating: 4.2 },
      { carrier: 'CMA CGM', shipments: 142, onTime: 128, reliability: 90.1, avgTransit: 17, damageClaims: 1, rating: 4.4 },
      { carrier: 'COSCO', shipments: 128, onTime: 112, reliability: 87.5, avgTransit: 20, damageClaims: 4, rating: 4.0 },
      { carrier: 'Hapag-Lloyd', shipments: 98, onTime: 91, reliability: 92.9, avgTransit: 16, damageClaims: 0, rating: 4.6 },
      { carrier: 'ONE', shipments: 87, onTime: 76, reliability: 87.4, avgTransit: 18, damageClaims: 2, rating: 4.1 },
      { carrier: 'Evergreen', shipments: 75, onTime: 69, reliability: 92.0, avgTransit: 17, damageClaims: 1, rating: 4.3 },
    ]
    
    res.json({ carriers, generatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('Error generating carrier report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/fleet/vehicle-utilization - Fleet Utilization
router.get('/fleet/vehicle-utilization', async (req, res) => {
  try {
    const vehicles = [
      { regNo: 'BPK1234', type: 'Prime Mover', utilization: 85, kmThisMonth: 4500, revenue: 28000, cost: 18500, profit: 9500 },
      { regNo: 'BPK5678', type: 'Prime Mover', utilization: 78, kmThisMonth: 4100, revenue: 25500, cost: 17200, profit: 8300 },
      { regNo: 'BPK9012', type: 'Prime Mover', utilization: 92, kmThisMonth: 5200, revenue: 32000, cost: 20500, profit: 11500 },
      { regNo: 'WXY3456', type: 'Trailer 40ft', utilization: 88, kmThisMonth: 0, revenue: 18000, cost: 8500, profit: 9500 },
      { regNo: 'WXY7890', type: 'Trailer 40ft', utilization: 82, kmThisMonth: 0, revenue: 16500, cost: 7800, profit: 8700 },
      { regNo: 'WXY1234', type: 'Trailer 20ft', utilization: 75, kmThisMonth: 0, revenue: 14000, cost: 7200, profit: 6800 },
      { regNo: 'BPK2468', type: 'Lorry 10-ton', utilization: 70, kmThisMonth: 2800, revenue: 12000, cost: 8500, profit: 3500 },
      { regNo: 'BPK1357', type: 'Lorry 5-ton', utilization: 65, kmThisMonth: 2200, revenue: 9500, cost: 7200, profit: 2300 },
    ]
    
    const summary = {
      totalVehicles: vehicles.length,
      avgUtilization: Math.round(vehicles.reduce((sum, v) => sum + v.utilization, 0) / vehicles.length),
      totalRevenue: vehicles.reduce((sum, v) => sum + v.revenue, 0),
      totalCost: vehicles.reduce((sum, v) => sum + v.cost, 0),
      totalProfit: vehicles.reduce((sum, v) => sum + v.profit, 0),
    }
    
    res.json({ vehicles, summary, period: 'Current Month' })
  } catch (error) {
    console.error('Error generating fleet report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/fleet/driver-performance - Driver Performance
router.get('/fleet/driver-performance', async (req, res) => {
  try {
    const drivers = [
      { name: 'Ahmad bin Hassan', license: 'CDL123456', trips: 45, kmDriven: 4500, fuelEfficiency: 3.2, onTime: 43, incidents: 0, rating: 4.8, incentive: 850 },
      { name: 'Rajesh Kumar', license: 'CDL234567', trips: 52, kmDriven: 5200, fuelEfficiency: 3.5, onTime: 49, incidents: 1, rating: 4.5, incentive: 920 },
      { name: 'Tan Wei Ming', license: 'CDL345678', trips: 38, kmDriven: 3800, fuelEfficiency: 3.1, onTime: 37, incidents: 0, rating: 4.9, incentive: 780 },
      { name: 'Mohd Ali', license: 'CDL456789', trips: 41, kmDriven: 4100, fuelEfficiency: 3.8, onTime: 38, incidents: 2, rating: 4.2, incentive: 650 },
      { name: 'Kumar Siva', license: 'CDL567890', trips: 48, kmDriven: 4800, fuelEfficiency: 3.4, onTime: 45, incidents: 1, rating: 4.4, incentive: 820 },
      { name: 'Lee Kok Wai', license: 'CDL678901', trips: 35, kmDriven: 3500, fuelEfficiency: 3.6, onTime: 33, incidents: 0, rating: 4.6, incentive: 680 },
      { name: 'Samy Velu', license: 'CDL789012', trips: 42, kmDriven: 4200, fuelEfficiency: 3.3, onTime: 40, incidents: 1, rating: 4.3, incentive: 750 },
      { name: 'John Peter', license: 'CDL890123', trips: 28, kmDriven: 2800, fuelEfficiency: 3.9, onTime: 26, incidents: 2, rating: 3.9, incentive: 450 },
    ]
    
    const summary = {
      totalDrivers: drivers.length,
      avgTrips: Math.round(drivers.reduce((sum, d) => sum + d.trips, 0) / drivers.length),
      avgFuelEfficiency: (drivers.reduce((sum, d) => sum + d.fuelEfficiency, 0) / drivers.length).toFixed(1),
      totalIncentives: drivers.reduce((sum, d) => sum + d.incentive, 0),
      avgRating: (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1),
    }
    
    res.json({ drivers, summary, period: 'Current Month' })
  } catch (error) {
    console.error('Error generating driver report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/audit/log - Audit Trail
router.get('/audit/log', async (req, res) => {
  try {
    const { limit = 100 } = req.query
    
    // Mock audit data
    const entries = [
      { id: '1', timestamp: '2026-02-15T09:30:00Z', user: 'admin@mmf.com', action: 'CREATE', entity: 'Invoice', entityId: 'INV-2026-001', details: 'Created AR invoice for ABC Trading', ip: '192.168.1.100' },
      { id: '2', timestamp: '2026-02-15T09:45:00Z', user: 'john@mmf.com', action: 'UPDATE', entity: 'Shipment', entityId: 'SH-2026-045', details: 'Updated container seal number', ip: '192.168.1.105' },
      { id: '3', timestamp: '2026-02-15T10:15:00Z', user: 'finance@mmf.com', action: 'POST', entity: 'JournalEntry', entityId: 'JE-2026-128', details: 'Posted journal entry for month-end', ip: '192.168.1.110' },
      { id: '4', timestamp: '2026-02-15T10:30:00Z', user: 'ops@mmf.com', action: 'DELETE', entity: 'Job', entityId: 'JOB-2026-089', details: 'Deleted duplicate job entry', ip: '192.168.1.115' },
      { id: '5', timestamp: '2026-02-15T11:00:00Z', user: 'admin@mmf.com', action: 'LOGIN', entity: 'User', entityId: 'admin@mmf.com', details: 'User logged in successfully', ip: '192.168.1.100' },
      { id: '6', timestamp: '2026-02-15T11:30:00Z', user: 'warehouse@mmf.com', action: 'CREATE', entity: 'InventoryMovement', entityId: 'IM-2026-234', details: 'Goods received for PO-2026-056', ip: '192.168.1.120' },
      { id: '7', timestamp: '2026-02-15T12:00:00Z', user: 'finance@mmf.com', action: 'APPROVE', entity: 'Payment', entityId: 'PAY-2026-045', details: 'Approved vendor payment', ip: '192.168.1.110' },
      { id: '8', timestamp: '2026-02-15T12:30:00Z', user: 'ops@mmf.com', action: 'ASSIGN', entity: 'Job', entityId: 'JOB-2026-090', details: 'Assigned driver Ahmad to job', ip: '192.168.1.115' },
      { id: '9', timestamp: '2026-02-15T13:00:00Z', user: 'admin@mmf.com', action: 'UPDATE', entity: 'Customer', entityId: 'CUST-001', details: 'Updated credit limit to RM 500,000', ip: '192.168.1.100' },
      { id: '10', timestamp: '2026-02-15T13:30:00Z', user: 'gate@mmf.com', action: 'CREATE', entity: 'GatePass', entityId: 'GP-2026-189', details: 'Created gate-out pass for BPK1234', ip: '192.168.1.125' },
    ]
    
    res.json({ entries: entries.slice(0, Number(limit)), total: entries.length })
  } catch (error) {
    console.error('Error generating audit log:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

export { router as reportsRouter }
