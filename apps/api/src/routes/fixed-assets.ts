import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/fixed-assets - List all fixed assets
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query
    
    const where: any = {}
    if (status) where.status = status
    if (category) where.category = category

    const assets = await prisma.fixedAsset.findMany({
      where,
      orderBy: { assetNo: 'asc' },
    })
    res.json(assets)
  } catch (error) {
    console.error('Error fetching fixed assets:', error)
    res.status(500).json({ error: 'Failed to fetch fixed assets' })
  }
})

// GET /api/fixed-assets/:id - Get single asset
router.get('/:id', async (req, res) => {
  try {
    const asset = await prisma.fixedAsset.findUnique({
      where: { id: req.params.id },
    })
    if (!asset) {
      return res.status(404).json({ error: 'Fixed asset not found' })
    }
    res.json(asset)
  } catch (error) {
    console.error('Error fetching fixed asset:', error)
    res.status(500).json({ error: 'Failed to fetch fixed asset' })
  }
})

// POST /api/fixed-assets - Create new fixed asset
router.post('/', async (req, res) => {
  try {
    const assetNo = `FA-${Date.now().toString(36).toUpperCase()}`
    
    const asset = await prisma.fixedAsset.create({
      data: {
        assetNo,
        netBookValue: req.body.purchaseCost,
        ...req.body,
      },
    })
    res.status(201).json(asset)
  } catch (error) {
    console.error('Error creating fixed asset:', error)
    res.status(500).json({ error: 'Failed to create fixed asset' })
  }
})

// PATCH /api/fixed-assets/:id - Update fixed asset
router.patch('/:id', async (req, res) => {
  try {
    const asset = await prisma.fixedAsset.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(asset)
  } catch (error) {
    console.error('Error updating fixed asset:', error)
    res.status(500).json({ error: 'Failed to update fixed asset' })
  }
})

// POST /api/fixed-assets/:id/depreciate - Run depreciation
router.post('/:id/depreciate', async (req, res) => {
  try {
    const asset = await prisma.fixedAsset.findUnique({
      where: { id: req.params.id },
    })
    
    if (!asset) {
      return res.status(404).json({ error: 'Fixed asset not found' })
    }

    // Calculate monthly depreciation
    let depreciationAmount = 0
    if (asset.depreciationMethod === 'STRAIGHT_LINE') {
      const depreciableAmount = asset.purchaseCost - asset.salvageValue
      depreciationAmount = depreciableAmount / (asset.usefulLifeYears * 12)
    }
    // Add other methods as needed

    const updatedAsset = await prisma.fixedAsset.update({
      where: { id: req.params.id },
      data: {
        accumulatedDepreciation: {
          increment: depreciationAmount,
        },
        netBookValue: {
          decrement: depreciationAmount,
        },
      },
    })
    res.json(updatedAsset)
  } catch (error) {
    console.error('Error depreciating asset:', error)
    res.status(500).json({ error: 'Failed to depreciate asset' })
  }
})

export { router as fixedAssetsRouter }