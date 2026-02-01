import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// Mock freight rates for demo
const mockRates = [
  // Port Klang to Singapore
  { id: 'rate-001', origin: 'Port Klang', destination: 'Singapore', mode: 'SEA', carrier: 'Maersk', containerSize: '20FT', rate: 280, currency: 'USD', validity: '2024-03-31', transitTime: '2 days', frequency: 'Daily' },
  { id: 'rate-002', origin: 'Port Klang', destination: 'Singapore', mode: 'SEA', carrier: 'MSC', containerSize: '20FT', rate: 265, currency: 'USD', validity: '2024-03-31', transitTime: '2 days', frequency: 'Daily' },
  { id: 'rate-003', origin: 'Port Klang', destination: 'Singapore', mode: 'SEA', carrier: 'CMA CGM', containerSize: '20FT', rate: 290, currency: 'USD', validity: '2024-02-28', transitTime: '2 days', frequency: 'Daily' },
  { id: 'rate-004', origin: 'Port Klang', destination: 'Singapore', mode: 'SEA', carrier: 'Maersk', containerSize: '40FT', rate: 450, currency: 'USD', validity: '2024-03-31', transitTime: '2 days', frequency: 'Daily' },
  { id: 'rate-005', origin: 'Port Klang', destination: 'Singapore', mode: 'SEA', carrier: 'MSC', containerSize: '40FT', rate: 425, currency: 'USD', validity: '2024-03-31', transitTime: '2 days', frequency: 'Daily' },
  
  // Port Klang to Hong Kong
  { id: 'rate-006', origin: 'Port Klang', destination: 'Hong Kong', mode: 'SEA', carrier: 'Maersk', containerSize: '20FT', rate: 380, currency: 'USD', validity: '2024-03-31', transitTime: '5 days', frequency: '3x Weekly' },
  { id: 'rate-007', origin: 'Port Klang', destination: 'Hong Kong', mode: 'SEA', carrier: 'COSCO', containerSize: '20FT', rate: 365, currency: 'USD', validity: '2024-03-15', transitTime: '5 days', frequency: '3x Weekly' },
  { id: 'rate-008', origin: 'Port Klang', destination: 'Hong Kong', mode: 'SEA', carrier: 'Maersk', containerSize: '40FT', rate: 620, currency: 'USD', validity: '2024-03-31', transitTime: '5 days', frequency: '3x Weekly' },
  { id: 'rate-009', origin: 'Port Klang', destination: 'Hong Kong', mode: 'SEA', carrier: 'COSCO', containerSize: '40FT', rate: 595, currency: 'USD', validity: '2024-03-15', transitTime: '5 days', frequency: '3x Weekly' },
  
  // Port Klang to Shanghai
  { id: 'rate-010', origin: 'Port Klang', destination: 'Shanghai', mode: 'SEA', carrier: 'Maersk', containerSize: '20FT', rate: 450, currency: 'USD', validity: '2024-03-31', transitTime: '8 days', frequency: 'Weekly' },
  { id: 'rate-011', origin: 'Port Klang', destination: 'Shanghai', mode: 'SEA', carrier: 'MSC', containerSize: '20FT', rate: 435, currency: 'USD', validity: '2024-03-31', transitTime: '8 days', frequency: 'Weekly' },
  { id: 'rate-012', origin: 'Port Klang', destination: 'Shanghai', mode: 'SEA', carrier: 'ONE', containerSize: '20FT', rate: 465, currency: 'USD', validity: '2024-02-28', transitTime: '8 days', frequency: 'Weekly' },
  { id: 'rate-013', origin: 'Port Klang', destination: 'Shanghai', mode: 'SEA', carrier: 'Maersk', containerSize: '40FT', rate: 750, currency: 'USD', validity: '2024-03-31', transitTime: '8 days', frequency: 'Weekly' },
  
  // Port Klang to Rotterdam
  { id: 'rate-014', origin: 'Port Klang', destination: 'Rotterdam', mode: 'SEA', carrier: 'Maersk', containerSize: '20FT', rate: 1850, currency: 'USD', validity: '2024-03-31', transitTime: '24 days', frequency: 'Weekly' },
  { id: 'rate-015', origin: 'Port Klang', destination: 'Rotterdam', mode: 'SEA', carrier: 'MSC', containerSize: '20FT', rate: 1790, currency: 'USD', validity: '2024-03-31', transitTime: '26 days', frequency: 'Weekly' },
  { id: 'rate-016', origin: 'Port Klang', destination: 'Rotterdam', mode: 'SEA', carrier: 'CMA CGM', containerSize: '20FT', rate: 1920, currency: 'USD', validity: '2024-03-15', transitTime: '25 days', frequency: 'Weekly' },
  { id: 'rate-017', origin: 'Port Klang', destination: 'Rotterdam', mode: 'SEA', carrier: 'Maersk', containerSize: '40FT', rate: 3200, currency: 'USD', validity: '2024-03-31', transitTime: '24 days', frequency: 'Weekly' },
  
  // Port Klang to Los Angeles
  { id: 'rate-018', origin: 'Port Klang', destination: 'Los Angeles', mode: 'SEA', carrier: 'Maersk', containerSize: '20FT', rate: 2100, currency: 'USD', validity: '2024-03-31', transitTime: '18 days', frequency: 'Weekly' },
  { id: 'rate-019', origin: 'Port Klang', destination: 'Los Angeles', mode: 'SEA', carrier: 'MSC', containerSize: '20FT', rate: 2050, currency: 'USD', validity: '2024-03-31', transitTime: '19 days', frequency: 'Weekly' },
  { id: 'rate-020', origin: 'Port Klang', destination: 'Los Angeles', mode: 'SEA', carrier: 'Maersk', containerSize: '40FT', rate: 3650, currency: 'USD', validity: '2024-03-31', transitTime: '18 days', frequency: 'Weekly' },
  
  // Air Freight - KLIA to various destinations
  { id: 'rate-021', origin: 'KUL', destination: 'SIN', mode: 'AIR', carrier: 'Malaysia Airlines', containerSize: 'PER_KG', rate: 3.5, currency: 'MYR', validity: '2024-03-31', transitTime: '1 day', frequency: 'Daily' },
  { id: 'rate-022', origin: 'KUL', destination: 'SIN', mode: 'AIR', carrier: 'Singapore Airlines', containerSize: 'PER_KG', rate: 4.2, currency: 'MYR', validity: '2024-03-31', transitTime: '1 day', frequency: 'Daily' },
  { id: 'rate-023', origin: 'KUL', destination: 'HKG', mode: 'AIR', carrier: 'Malaysia Airlines', containerSize: 'PER_KG', rate: 6.8, currency: 'MYR', validity: '2024-03-31', transitTime: '4 hours', frequency: 'Daily' },
  { id: 'rate-024', origin: 'KUL', destination: 'HKG', mode: 'AIR', carrier: 'Cathay Pacific', containerSize: 'PER_KG', rate: 7.5, currency: 'MYR', validity: '2024-03-31', transitTime: '4 hours', frequency: 'Daily' },
  { id: 'rate-025', origin: 'KUL', destination: 'PVG', mode: 'AIR', carrier: 'Malaysia Airlines', containerSize: 'PER_KG', rate: 8.5, currency: 'MYR', validity: '2024-03-31', transitTime: '6 hours', frequency: 'Daily' },
  { id: 'rate-026', origin: 'KUL', destination: 'NRT', mode: 'AIR', carrier: 'Malaysia Airlines', containerSize: 'PER_KG', rate: 12.5, currency: 'MYR', validity: '2024-03-31', transitTime: '7 hours', frequency: 'Daily' },
  { id: 'rate-027', origin: 'KUL', destination: 'DXB', mode: 'AIR', carrier: 'Emirates', containerSize: 'PER_KG', rate: 9.8, currency: 'MYR', validity: '2024-03-31', transitTime: '7 hours', frequency: 'Daily' },
  { id: 'rate-028', origin: 'KUL', destination: 'AMS', mode: 'AIR', carrier: 'KLM', containerSize: 'PER_KG', rate: 18.5, currency: 'MYR', validity: '2024-03-31', transitTime: '14 hours', frequency: 'Daily' },
  { id: 'rate-029', origin: 'KUL', destination: 'LHR', mode: 'AIR', carrier: 'Malaysia Airlines', containerSize: 'PER_KG', rate: 22.0, currency: 'MYR', validity: '2024-03-31', transitTime: '13 hours', frequency: 'Daily' },
  { id: 'rate-030', origin: 'KUL', destination: 'LAX', mode: 'AIR', carrier: 'Malaysia Airlines', containerSize: 'PER_KG', rate: 28.5, currency: 'MYR', validity: '2024-03-31', transitTime: '17 hours', frequency: 'Daily' },
]

// Rate history for charts
const rateHistory = {
  'rate-001': [
    { date: '2024-01-01', rate: 250 },
    { date: '2024-01-15', rate: 265 },
    { date: '2024-02-01', rate: 275 },
    { date: '2024-02-15', rate: 280 },
  ],
  'rate-002': [
    { date: '2024-01-01', rate: 240 },
    { date: '2024-01-15', rate: 250 },
    { date: '2024-02-01', rate: 260 },
    { date: '2024-02-15', rate: 265 },
  ],
  'rate-014': [
    { date: '2024-01-01', rate: 1650 },
    { date: '2024-01-15', rate: 1720 },
    { date: '2024-02-01', rate: 1780 },
    { date: '2024-02-15', rate: 1850 },
  ],
}

// GET /api/rates - Get all freight rates
router.get('/', async (req, res) => {
  try {
    const { origin, destination, mode, carrier, containerSize, search } = req.query
    
    let rates = [...mockRates]
    
    if (origin) {
      rates = rates.filter(r => r.origin.toLowerCase().includes((origin as string).toLowerCase()))
    }
    if (destination) {
      rates = rates.filter(r => r.destination.toLowerCase().includes((destination as string).toLowerCase()))
    }
    if (mode) {
      rates = rates.filter(r => r.mode === mode)
    }
    if (carrier) {
      rates = rates.filter(r => r.carrier.toLowerCase().includes((carrier as string).toLowerCase()))
    }
    if (containerSize) {
      rates = rates.filter(r => r.containerSize === containerSize)
    }
    if (search) {
      const searchLower = (search as string).toLowerCase()
      rates = rates.filter(r => 
        r.origin.toLowerCase().includes(searchLower) ||
        r.destination.toLowerCase().includes(searchLower) ||
        r.carrier.toLowerCase().includes(searchLower)
      )
    }
    
    res.json(rates)
  } catch (error) {
    console.error('Error fetching rates:', error)
    res.status(500).json({ error: 'Failed to fetch rates' })
  }
})

// GET /api/rates/:id - Get single rate
router.get('/:id', async (req, res) => {
  try {
    const rate = mockRates.find(r => r.id === req.params.id)
    if (!rate) {
      return res.status(404).json({ error: 'Rate not found' })
    }
    
    res.json({
      ...rate,
      history: rateHistory[rate.id as keyof typeof rateHistory] || [],
    })
  } catch (error) {
    console.error('Error fetching rate:', error)
    res.status(500).json({ error: 'Failed to fetch rate' })
  }
})

// POST /api/rates/calculate - Calculate freight cost
router.post('/calculate', async (req, res) => {
  try {
    const { origin, destination, mode, containerSize, weight, quantity } = req.body
    
    // Find matching rates
    const matchingRates = mockRates.filter(r => 
      r.origin.toLowerCase().includes(origin.toLowerCase()) &&
      r.destination.toLowerCase().includes(destination.toLowerCase()) &&
      r.mode === mode &&
      r.containerSize === containerSize
    )
    
    // Calculate total cost for each carrier
    const calculations = matchingRates.map(rate => {
      let totalCost = rate.rate
      
      if (rate.containerSize === 'PER_KG' && weight) {
        totalCost = rate.rate * weight
      }
      
      // Add fuel surcharge (mock)
      const fuelSurcharge = totalCost * 0.15
      
      // Add documentation fee (mock)
      const docFee = mode === 'SEA' ? 75 : 45
      
      return {
        carrier: rate.carrier,
        baseRate: rate.rate,
        currency: rate.currency,
        fuelSurcharge,
        documentationFee: docFee,
        totalCost: totalCost + fuelSurcharge + docFee,
        transitTime: rate.transitTime,
        frequency: rate.frequency,
        validity: rate.validity,
      }
    })
    
    // Sort by total cost
    calculations.sort((a, b) => a.totalCost - b.totalCost)
    
    res.json({
      origin,
      destination,
      mode,
      containerSize,
      weight,
      quantity,
      calculations,
      bestRate: calculations[0] || null,
    })
  } catch (error) {
    console.error('Error calculating rates:', error)
    res.status(500).json({ error: 'Failed to calculate rates' })
  }
})

// GET /api/rates/comparison/:origin/:destination - Compare carriers
router.get('/comparison/:origin/:destination', async (req, res) => {
  try {
    const { origin, destination } = req.params
    const { mode, containerSize } = req.query
    
    let rates = mockRates.filter(r => 
      r.origin.toLowerCase().includes(origin.toLowerCase()) &&
      r.destination.toLowerCase().includes(destination.toLowerCase())
    )
    
    if (mode) {
      rates = rates.filter(r => r.mode === mode)
    }
    if (containerSize) {
      rates = rates.filter(r => r.containerSize === containerSize)
    }
    
    // Group by carrier
    const carrierComparison = rates.reduce((acc, rate) => {
      if (!acc[rate.carrier]) {
        acc[rate.carrier] = {
          carrier: rate.carrier,
          routes: [],
          avgTransitTime: 0,
          minRate: Infinity,
          maxRate: 0,
        }
      }
      acc[rate.carrier].routes.push(rate)
      acc[rate.carrier].minRate = Math.min(acc[rate.carrier].minRate, rate.rate)
      acc[rate.carrier].maxRate = Math.max(acc[rate.carrier].maxRate, rate.rate)
      return acc
    }, {} as Record<string, any>)
    
    // Calculate averages
    Object.values(carrierComparison).forEach((carrier: any) => {
      const totalDays = carrier.routes.reduce((sum: number, r: any) => {
        const days = parseInt(r.transitTime)
        return sum + (isNaN(days) ? 0 : days)
      }, 0)
      carrier.avgTransitTime = Math.round(totalDays / carrier.routes.length)
      carrier.routeCount = carrier.routes.length
    })
    
    res.json({
      origin,
      destination,
      comparison: Object.values(carrierComparison),
    })
  } catch (error) {
    console.error('Error comparing carriers:', error)
    res.status(500).json({ error: 'Failed to compare carriers' })
  }
})

// GET /api/rates/stats - Get rate statistics
router.get('/stats', async (req, res) => {
  try {
    res.json({
      totalActiveRates: mockRates.length,
      seaRates: mockRates.filter(r => r.mode === 'SEA').length,
      airRates: mockRates.filter(r => r.mode === 'AIR').length,
      avgRateChange: '+3.2%',
      expiringThisMonth: 8,
      topOrigins: ['Port Klang', 'KUL', 'Butterworth'],
      topDestinations: ['Singapore', 'Hong Kong', 'Shanghai', 'Rotterdam'],
      carriers: [...new Set(mockRates.map(r => r.carrier))].length,
    })
  } catch (error) {
    console.error('Error fetching rate stats:', error)
    res.status(500).json({ error: 'Failed to fetch rate stats' })
  }
})

// GET /api/rates/lanes - Get available trade lanes
router.get('/lanes', async (req, res) => {
  try {
    const lanes = mockRates.reduce((acc, rate) => {
      const key = `${rate.origin}-${rate.destination}`
      if (!acc[key]) {
        acc[key] = {
          origin: rate.origin,
          destination: rate.destination,
          mode: rate.mode,
          carrierCount: 0,
          minRate: Infinity,
          maxRate: 0,
        }
      }
      acc[key].carrierCount++
      acc[key].minRate = Math.min(acc[key].minRate, rate.rate)
      acc[key].maxRate = Math.max(acc[key].maxRate, rate.rate)
      return acc
    }, {} as Record<string, any>)
    
    res.json(Object.values(lanes))
  } catch (error) {
    console.error('Error fetching lanes:', error)
    res.status(500).json({ error: 'Failed to fetch lanes' })
  }
})

export { router as ratesRouter }
