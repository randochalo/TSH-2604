import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// Mock picking orders for demo
const mockPickOrders = [
  { id: 'pick-001', orderNo: 'SO-2024-0001', customer: 'ABC Logistics Sdn Bhd', priority: 'HIGH', status: 'PENDING', items: 12, createdAt: '2024-01-15T08:00:00Z' },
  { id: 'pick-002', orderNo: 'SO-2024-0002', customer: 'Global Freight Services', priority: 'NORMAL', status: 'IN_PROGRESS', items: 8, createdAt: '2024-01-15T09:30:00Z' },
  { id: 'pick-003', orderNo: 'SO-2024-0003', customer: 'Tech Solutions Inc', priority: 'URGENT', status: 'PENDING', items: 25, createdAt: '2024-01-15T10:00:00Z' },
  { id: 'pick-004', orderNo: 'SO-2024-0004', customer: 'Marina Bay Logistics', priority: 'NORMAL', status: 'COMPLETED', items: 5, createdAt: '2024-01-14T14:00:00Z' },
  { id: 'pick-005', orderNo: 'SO-2024-0005', customer: 'Sunrise Trading Co', priority: 'HIGH', status: 'IN_PROGRESS', items: 18, createdAt: '2024-01-15T11:00:00Z' },
]

// GET /api/picking/orders - Get all pick orders
router.get('/orders', async (req, res) => {
  try {
    const { status, priority, search } = req.query
    
    let orders = [...mockPickOrders]
    
    if (status && status !== 'ALL') {
      orders = orders.filter(o => o.status === status)
    }
    if (priority && priority !== 'ALL') {
      orders = orders.filter(o => o.priority === priority)
    }
    if (search) {
      orders = orders.filter(o => 
        o.orderNo.toLowerCase().includes((search as string).toLowerCase()) ||
        o.customer.toLowerCase().includes((search as string).toLowerCase())
      )
    }
    
    res.json(orders)
  } catch (error) {
    console.error('Error fetching pick orders:', error)
    res.status(500).json({ error: 'Failed to fetch pick orders' })
  }
})

// GET /api/picking/orders/:id - Get pick order details
router.get('/orders/:id', async (req, res) => {
  try {
    const order = mockPickOrders.find(o => o.id === req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Pick order not found' })
    }
    
    // Generate mock pick list items
    const pickItems = Array.from({ length: order.items }, (_, i) => ({
      id: `item-${i + 1}`,
      sku: `SKU-${1000 + i}`,
      description: `Product ${String.fromCharCode(65 + i)} - ${['Electronic Components', 'Packaging Materials', 'Raw Materials', 'Finished Goods'][i % 4]}`,
      location: `${['A', 'B', 'C'][i % 3]}-${Math.floor(Math.random() * 20) + 1}-${Math.floor(Math.random() * 5) + 1}`,
      quantity: Math.floor(Math.random() * 50) + 1,
      picked: order.status === 'COMPLETED' ? Math.floor(Math.random() * 50) + 1 : Math.floor(Math.random() * 30),
      uom: ['PCS', 'BOX', 'KG', 'PALLET'][i % 4],
      status: order.status === 'COMPLETED' ? 'PICKED' : ['PENDING', 'PICKING', 'PICKED'][Math.floor(Math.random() * 3)],
    }))
    
    res.json({
      ...order,
      pickItems,
      assignedTo: order.status !== 'PENDING' ? ['John Smith', 'Sarah Lee', 'Ahmad Razak'][Math.floor(Math.random() * 3)] : null,
      startedAt: order.status !== 'PENDING' ? new Date(Date.now() - 3600000).toISOString() : null,
      completedAt: order.status === 'COMPLETED' ? new Date().toISOString() : null,
    })
  } catch (error) {
    console.error('Error fetching pick order:', error)
    res.status(500).json({ error: 'Failed to fetch pick order' })
  }
})

// POST /api/picking/orders/:id/generate - Generate pick list
router.post('/orders/:id/generate', async (req, res) => {
  try {
    const order = mockPickOrders.find(o => o.id === req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Pick order not found' })
    }
    
    // Update order status
    order.status = 'IN_PROGRESS'
    
    res.json({
      success: true,
      message: 'Pick list generated successfully',
      pickListNo: `PKL-${Date.now().toString(36).toUpperCase()}`,
      order,
    })
  } catch (error) {
    console.error('Error generating pick list:', error)
    res.status(500).json({ error: 'Failed to generate pick list' })
  }
})

// POST /api/picking/items/:id/pick - Mark item as picked
router.post('/items/:id/pick', async (req, res) => {
  try {
    const { quantity, pickerId } = req.body
    
    res.json({
      success: true,
      message: 'Item picked successfully',
      itemId: req.params.id,
      pickedQuantity: quantity,
      pickedBy: pickerId,
      pickedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error picking item:', error)
    res.status(500).json({ error: 'Failed to pick item' })
  }
})

// POST /api/picking/orders/:id/complete - Complete picking
router.post('/orders/:id/complete', async (req, res) => {
  try {
    const order = mockPickOrders.find(o => o.id === req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Pick order not found' })
    }
    
    order.status = 'COMPLETED'
    
    res.json({
      success: true,
      message: 'Picking completed successfully',
      order,
      completedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error completing pick:', error)
    res.status(500).json({ error: 'Failed to complete picking' })
  }
})

// GET /api/picking/stats - Get picking statistics
router.get('/stats', async (req, res) => {
  try {
    res.json({
      pendingOrders: 15,
      inProgress: 8,
      completedToday: 24,
      itemsPickedToday: 486,
      averagePickTime: '12.5 min',
      accuracy: '99.2%',
    })
  } catch (error) {
    console.error('Error fetching picking stats:', error)
    res.status(500).json({ error: 'Failed to fetch picking stats' })
  }
})

export { router as pickingRouter }
