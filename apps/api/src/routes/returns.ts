import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// Mock RMA (Return Merchandise Authorization) data for demo
const mockRMAs = [
  { 
    id: 'rma-001', 
    rmaNo: 'RMA-2024-0001', 
    customer: 'ABC Logistics Sdn Bhd',
    originalOrder: 'SO-2024-0001',
    type: 'RETURN',
    reason: 'DEFECTIVE',
    status: 'PENDING',
    items: 3,
    value: 1250.00,
    createdAt: '2024-01-15T08:00:00Z',
    requestedBy: 'John Doe',
  },
  { 
    id: 'rma-002', 
    rmaNo: 'RMA-2024-0002', 
    customer: 'Global Freight Services',
    originalOrder: 'SO-2024-0002',
    type: 'EXCHANGE',
    reason: 'WRONG_ITEM',
    status: 'APPROVED',
    items: 1,
    value: 450.00,
    createdAt: '2024-01-14T10:00:00Z',
    requestedBy: 'Jane Smith',
  },
  { 
    id: 'rma-003', 
    rmaNo: 'RMA-2024-0003', 
    customer: 'Tech Solutions Inc',
    originalOrder: 'SO-2024-0003',
    type: 'RETURN',
    reason: 'CUSTOMER_CHANGED_MIND',
    status: 'RECEIVED',
    items: 5,
    value: 2800.00,
    createdAt: '2024-01-13T14:00:00Z',
    requestedBy: 'Mike Johnson',
  },
  { 
    id: 'rma-004', 
    rmaNo: 'RMA-2024-0004', 
    customer: 'Marina Bay Logistics',
    originalOrder: 'SO-2024-0004',
    type: 'REPAIR',
    reason: 'DEFECTIVE',
    status: 'PROCESSING',
    items: 2,
    value: 890.00,
    createdAt: '2024-01-12T09:00:00Z',
    requestedBy: 'Sarah Lee',
  },
  { 
    id: 'rma-005', 
    rmaNo: 'RMA-2024-0005', 
    customer: 'Sunrise Trading Co',
    originalOrder: 'SO-2024-0005',
    type: 'RETURN',
    reason: 'DAMAGED_IN_TRANSIT',
    status: 'COMPLETED',
    items: 8,
    value: 3200.00,
    createdAt: '2024-01-10T11:00:00Z',
    requestedBy: 'David Wong',
  },
  { 
    id: 'rma-006', 
    rmaNo: 'RMA-2024-0006', 
    customer: 'Pacific Shipping Ltd',
    originalOrder: 'SO-2024-0006',
    type: 'RETURN',
    reason: 'DEFECTIVE',
    status: 'REJECTED',
    items: 2,
    value: 600.00,
    createdAt: '2024-01-15T13:00:00Z',
    requestedBy: 'Lisa Chen',
  },
]

// Return reasons
const returnReasons = [
  { code: 'DEFECTIVE', label: 'Defective Product', description: 'Product is faulty or not working as expected' },
  { code: 'WRONG_ITEM', label: 'Wrong Item Shipped', description: 'Customer received incorrect product' },
  { code: 'DAMAGED_IN_TRANSIT', label: 'Damaged in Transit', description: 'Product damaged during shipping' },
  { code: 'CUSTOMER_CHANGED_MIND', label: 'Customer Changed Mind', description: 'No longer needed or wanted' },
  { code: 'NOT_AS_DESCRIBED', label: 'Not as Described', description: 'Product does not match description' },
  { code: 'EXPIRED', label: 'Expired Product', description: 'Product past expiry date' },
  { code: 'QUALITY_ISSUE', label: 'Quality Issue', description: 'Product quality below standard' },
]

// RMA types
const rmaTypes = [
  { code: 'RETURN', label: 'Return for Refund', workflow: 'receive-inspect-refund' },
  { code: 'EXCHANGE', label: 'Exchange Item', workflow: 'receive-inspect-replace' },
  { code: 'REPAIR', label: 'Repair & Return', workflow: 'receive-inspect-repair-return' },
  { code: 'CREDIT', label: 'Store Credit', workflow: 'receive-inspect-credit' },
]

// GET /api/returns/rmas - Get all RMAs
router.get('/rmas', async (req, res) => {
  try {
    const { status, type, reason, search } = req.query
    
    let rmas = [...mockRMAs]
    
    if (status && status !== 'ALL') {
      rmas = rmas.filter(r => r.status === status)
    }
    if (type && type !== 'ALL') {
      rmas = rmas.filter(r => r.type === type)
    }
    if (reason && reason !== 'ALL') {
      rmas = rmas.filter(r => r.reason === reason)
    }
    if (search) {
      rmas = rmas.filter(r => 
        r.rmaNo.toLowerCase().includes((search as string).toLowerCase()) ||
        r.customer.toLowerCase().includes((search as string).toLowerCase()) ||
        r.originalOrder.toLowerCase().includes((search as string).toLowerCase())
      )
    }
    
    res.json(rmas)
  } catch (error) {
    console.error('Error fetching RMAs:', error)
    res.status(500).json({ error: 'Failed to fetch RMAs' })
  }
})

// GET /api/returns/rmas/:id - Get RMA details
router.get('/rmas/:id', async (req, res) => {
  try {
    const rma = mockRMAs.find(r => r.id === req.params.id)
    if (!rma) {
      return res.status(404).json({ error: 'RMA not found' })
    }
    
    // Generate mock return items
    const returnItems = Array.from({ length: rma.items }, (_, i) => ({
      id: `ret-item-${i + 1}`,
      sku: `SKU-${1000 + Math.floor(Math.random() * 100)}`,
      description: `Product ${String.fromCharCode(65 + i)} - ${['Electronic Components', 'Packaging Materials', 'Raw Materials', 'Finished Goods'][i % 4]}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      unitPrice: (Math.random() * 200 + 50).toFixed(2),
      condition: ['NEW', 'USED', 'DAMAGED', 'DEFECTIVE'][Math.floor(Math.random() * 4)],
      reason: rma.reason,
      notes: 'Item shows signs of wear',
    }))
    
    // Workflow steps based on status
    const workflowSteps = [
      { step: 1, name: 'Request Received', status: 'COMPLETED', completedAt: rma.createdAt },
      { step: 2, name: 'RMA Approved', status: rma.status !== 'PENDING' ? 'COMPLETED' : 'PENDING', completedAt: rma.status !== 'PENDING' ? new Date(Date.now() - 86400000).toISOString() : null },
      { step: 3, name: 'Items Received', status: ['RECEIVED', 'PROCESSING', 'COMPLETED'].includes(rma.status) ? 'COMPLETED' : 'PENDING', completedAt: ['RECEIVED', 'PROCESSING', 'COMPLETED'].includes(rma.status) ? new Date(Date.now() - 43200000).toISOString() : null },
      { step: 4, name: 'Inspection', status: ['PROCESSING', 'COMPLETED'].includes(rma.status) ? 'COMPLETED' : 'PENDING', completedAt: ['PROCESSING', 'COMPLETED'].includes(rma.status) ? new Date(Date.now() - 21600000).toISOString() : null },
      { step: 5, name: 'Resolution', status: rma.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING', completedAt: rma.status === 'COMPLETED' ? new Date().toISOString() : null },
    ]
    
    res.json({
      ...rma,
      returnItems,
      workflowSteps,
      notes: 'Customer reported issues with product quality',
      shippingLabel: rma.status !== 'PENDING' ? `https://shipping.mmf.com/label/${rma.rmaNo}` : null,
      approvedBy: rma.status !== 'PENDING' ? ['Manager A', 'Manager B'][Math.floor(Math.random() * 2)] : null,
      approvedAt: rma.status !== 'PENDING' ? new Date(Date.now() - 86400000).toISOString() : null,
    })
  } catch (error) {
    console.error('Error fetching RMA:', error)
    res.status(500).json({ error: 'Failed to fetch RMA' })
  }
})

// GET /api/returns/reasons - Get return reasons
router.get('/reasons', async (req, res) => {
  try {
    res.json(returnReasons)
  } catch (error) {
    console.error('Error fetching return reasons:', error)
    res.status(500).json({ error: 'Failed to fetch return reasons' })
  }
})

// GET /api/returns/types - Get RMA types
router.get('/types', async (req, res) => {
  try {
    res.json(rmaTypes)
  } catch (error) {
    console.error('Error fetching RMA types:', error)
    res.status(500).json({ error: 'Failed to fetch RMA types' })
  }
})

// POST /api/returns/rmas - Create new RMA
router.post('/rmas', async (req, res) => {
  try {
    const { customerId, originalOrder, type, reason, items, notes } = req.body
    
    const newRMA = {
      id: `rma-${Date.now()}`,
      rmaNo: `RMA-${new Date().getFullYear()}-${String(mockRMAs.length + 1).padStart(4, '0')}`,
      customer: customerId,
      originalOrder,
      type,
      reason,
      status: 'PENDING',
      items: items.length,
      value: items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0),
      createdAt: new Date().toISOString(),
      requestedBy: 'Current User',
    }
    
    mockRMAs.unshift(newRMA)
    
    res.status(201).json({
      success: true,
      message: 'RMA created successfully',
      rma: newRMA,
    })
  } catch (error) {
    console.error('Error creating RMA:', error)
    res.status(500).json({ error: 'Failed to create RMA' })
  }
})

// POST /api/returns/rmas/:id/approve - Approve RMA
router.post('/rmas/:id/approve', async (req, res) => {
  try {
    const rma = mockRMAs.find(r => r.id === req.params.id)
    if (!rma) {
      return res.status(404).json({ error: 'RMA not found' })
    }
    
    rma.status = 'APPROVED'
    
    res.json({
      success: true,
      message: 'RMA approved successfully',
      rma,
      shippingLabel: `https://shipping.mmf.com/label/${rma.rmaNo}`,
      approvedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error approving RMA:', error)
    res.status(500).json({ error: 'Failed to approve RMA' })
  }
})

// POST /api/returns/rmas/:id/reject - Reject RMA
router.post('/rmas/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body
    const rma = mockRMAs.find(r => r.id === req.params.id)
    if (!rma) {
      return res.status(404).json({ error: 'RMA not found' })
    }
    
    rma.status = 'REJECTED'
    
    res.json({
      success: true,
      message: 'RMA rejected',
      rma,
      rejectionReason: reason,
      rejectedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error rejecting RMA:', error)
    res.status(500).json({ error: 'Failed to reject RMA' })
  }
})

// POST /api/returns/rmas/:id/receive - Mark items as received
router.post('/rmas/:id/receive', async (req, res) => {
  try {
    const { items } = req.body
    const rma = mockRMAs.find(r => r.id === req.params.id)
    if (!rma) {
      return res.status(404).json({ error: 'RMA not found' })
    }
    
    rma.status = 'RECEIVED'
    
    res.json({
      success: true,
      message: 'Items received successfully',
      rma,
      receivedItems: items,
      receivedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error receiving items:', error)
    res.status(500).json({ error: 'Failed to receive items' })
  }
})

// POST /api/returns/rmas/:id/inspect - Complete inspection
router.post('/rmas/:id/inspect', async (req, res) => {
  try {
    const { findings, disposition } = req.body
    const rma = mockRMAs.find(r => r.id === req.params.id)
    if (!rma) {
      return res.status(404).json({ error: 'RMA not found' })
    }
    
    rma.status = 'PROCESSING'
    
    res.json({
      success: true,
      message: 'Inspection completed',
      rma,
      findings,
      disposition,
      inspectedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error inspecting items:', error)
    res.status(500).json({ error: 'Failed to complete inspection' })
  }
})

// POST /api/returns/rmas/:id/complete - Complete RMA
router.post('/rmas/:id/complete', async (req, res) => {
  try {
    const { resolution } = req.body
    const rma = mockRMAs.find(r => r.id === req.params.id)
    if (!rma) {
      return res.status(404).json({ error: 'RMA not found' })
    }
    
    rma.status = 'COMPLETED'
    
    res.json({
      success: true,
      message: 'RMA completed successfully',
      rma,
      resolution,
      completedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error completing RMA:', error)
    res.status(500).json({ error: 'Failed to complete RMA' })
  }
})

// GET /api/returns/stats - Get returns statistics
router.get('/stats', async (req, res) => {
  try {
    res.json({
      pendingApproval: 8,
      approvedWaiting: 12,
      itemsReceived: 15,
      processing: 6,
      completedToday: 4,
      totalValue: 45800.00,
      returnRate: '2.3%',
      averageProcessTime: '3.2 days',
    })
  } catch (error) {
    console.error('Error fetching returns stats:', error)
    res.status(500).json({ error: 'Failed to fetch returns stats' })
  }
})

export { router as returnsRouter }
