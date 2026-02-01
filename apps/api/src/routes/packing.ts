import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// Mock packing orders for demo
const mockPackOrders = [
  { id: 'pack-001', orderNo: 'SO-2024-0001', customer: 'ABC Logistics Sdn Bhd', status: 'READY', items: 12, pickedBy: 'John Smith', pickedAt: '2024-01-15T10:00:00Z' },
  { id: 'pack-002', orderNo: 'SO-2024-0002', customer: 'Global Freight Services', status: 'PACKING', items: 8, pickedBy: 'Sarah Lee', pickedAt: '2024-01-15T11:30:00Z' },
  { id: 'pack-003', orderNo: 'SO-2024-0005', customer: 'Sunrise Trading Co', status: 'READY', items: 18, pickedBy: 'Ahmad Razak', pickedAt: '2024-01-15T12:00:00Z' },
  { id: 'pack-004', orderNo: 'SO-2024-0004', customer: 'Marina Bay Logistics', status: 'COMPLETED', items: 5, pickedBy: 'John Smith', pickedAt: '2024-01-14T16:00:00Z' },
  { id: 'pack-005', orderNo: 'SO-2024-0006', customer: 'Tech Solutions Inc', status: 'READY', items: 25, pickedBy: 'Sarah Lee', pickedAt: '2024-01-15T13:00:00Z' },
]

// Mock cartonization rules
const cartonTypes = [
  { code: 'CARTON-S', name: 'Small Carton', dimensions: '30x20x15 cm', maxWeight: 5, capacity: 'Small items' },
  { code: 'CARTON-M', name: 'Medium Carton', dimensions: '40x30x25 cm', maxWeight: 10, capacity: 'Medium items' },
  { code: 'CARTON-L', name: 'Large Carton', dimensions: '50x40x35 cm', maxWeight: 20, capacity: 'Large items' },
  { code: 'PALLET', name: 'Standard Pallet', dimensions: '120x100x150 cm', maxWeight: 500, capacity: 'Bulk items' },
]

// GET /api/packing/orders - Get orders ready for packing
router.get('/orders', async (req, res) => {
  try {
    const { status, search } = req.query
    
    let orders = [...mockPackOrders]
    
    if (status && status !== 'ALL') {
      orders = orders.filter(o => o.status === status)
    }
    if (search) {
      orders = orders.filter(o => 
        o.orderNo.toLowerCase().includes((search as string).toLowerCase()) ||
        o.customer.toLowerCase().includes((search as string).toLowerCase())
      )
    }
    
    res.json(orders)
  } catch (error) {
    console.error('Error fetching pack orders:', error)
    res.status(500).json({ error: 'Failed to fetch pack orders' })
  }
})

// GET /api/packing/orders/:id - Get pack order details
router.get('/orders/:id', async (req, res) => {
  try {
    const order = mockPackOrders.find(o => o.id === req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Pack order not found' })
    }
    
    // Generate mock items to pack
    const packItems = Array.from({ length: order.items }, (_, i) => ({
      id: `item-${i + 1}`,
      sku: `SKU-${1000 + i}`,
      description: `Product ${String.fromCharCode(65 + i)}`,
      quantity: Math.floor(Math.random() * 20) + 1,
      picked: Math.floor(Math.random() * 20) + 1,
      uom: ['PCS', 'BOX'][i % 2],
      weight: (Math.random() * 5 + 0.5).toFixed(2),
      dimensions: `${Math.floor(Math.random() * 30 + 10)}x${Math.floor(Math.random() * 20 + 5)}x${Math.floor(Math.random() * 15 + 5)}`,
    }))
    
    // Generate suggested cartonization
    const suggestedCartons = [
      { type: 'CARTON-M', quantity: Math.ceil(order.items / 4), items: [] },
      { type: 'CARTON-L', quantity: Math.ceil(order.items / 8), items: [] },
    ]
    
    res.json({
      ...order,
      packItems,
      suggestedCartons,
      packer: order.status !== 'READY' ? ['John Smith', 'Sarah Lee', 'Ahmad Razak'][Math.floor(Math.random() * 3)] : null,
      startedAt: order.status === 'PACKING' ? new Date(Date.now() - 1800000).toISOString() : null,
    })
  } catch (error) {
    console.error('Error fetching pack order:', error)
    res.status(500).json({ error: 'Failed to fetch pack order' })
  }
})

// GET /api/packing/carton-types - Get available carton types
router.get('/carton-types', async (req, res) => {
  try {
    res.json(cartonTypes)
  } catch (error) {
    console.error('Error fetching carton types:', error)
    res.status(500).json({ error: 'Failed to fetch carton types' })
  }
})

// POST /api/packing/orders/:id/start - Start packing
router.post('/orders/:id/start', async (req, res) => {
  try {
    const order = mockPackOrders.find(o => o.id === req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Pack order not found' })
    }
    
    order.status = 'PACKING'
    
    res.json({
      success: true,
      message: 'Packing started',
      order,
      startedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error starting packing:', error)
    res.status(500).json({ error: 'Failed to start packing' })
  }
})

// POST /api/packing/orders/:id/cartonize - Auto-cartonize order
router.post('/orders/:id/cartonize', async (req, res) => {
  try {
    const { algorithm = 'volume' } = req.body
    
    // Simulate cartonization algorithm
    const cartons = [
      {
        id: `BOX-${Date.now()}-1`,
        type: 'CARTON-M',
        weight: 8.5,
        items: 4,
        dimensions: '40x30x25 cm',
        trackingNo: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      },
      {
        id: `BOX-${Date.now()}-2`,
        type: 'CARTON-L',
        weight: 15.2,
        items: 6,
        dimensions: '50x40x35 cm',
        trackingNo: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      },
    ]
    
    res.json({
      success: true,
      message: `Cartonization completed using ${algorithm} algorithm`,
      cartons,
      totalWeight: cartons.reduce((sum, c) => sum + c.weight, 0),
      totalCartons: cartons.length,
    })
  } catch (error) {
    console.error('Error cartonizing:', error)
    res.status(500).json({ error: 'Failed to cartonize' })
  }
})

// POST /api/packing/orders/:id/complete - Complete packing
router.post('/orders/:id/complete', async (req, res) => {
  try {
    const order = mockPackOrders.find(o => o.id === req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Pack order not found' })
    }
    
    order.status = 'COMPLETED'
    
    res.json({
      success: true,
      message: 'Packing completed successfully',
      order,
      packingListNo: `PL-${Date.now().toString(36).toUpperCase()}`,
      completedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error completing packing:', error)
    res.status(500).json({ error: 'Failed to complete packing' })
  }
})

// GET /api/packing/stats - Get packing statistics
router.get('/stats', async (req, res) => {
  try {
    res.json({
      readyToPack: 12,
      currentlyPacking: 5,
      packedToday: 18,
      averagePackTime: '8.3 min',
      cartonUtilization: '87%',
      packingAccuracy: '98.5%',
    })
  } catch (error) {
    console.error('Error fetching packing stats:', error)
    res.status(500).json({ error: 'Failed to fetch packing stats' })
  }
})

export { router as packingRouter }
