import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/apad/compliance - Get APAD compliance overview
router.get('/compliance', async (req, res) => {
  try {
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [
      totalContainers,
      gatePassCompliance,
      railManifestCompliance,
      yardInventoryAccuracy,
      pendingRailDocs,
    ] = await Promise.all([
      prisma.container.count(),
      prisma.gatePass.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          status: { not: 'EXPIRED' },
        },
      }),
      prisma.railOperation.count({
        where: {
          status: { in: ['COMPLETED', 'IN_TRANSIT'] },
          manifestUploaded: true,
        },
      }),
      prisma.yardSlot.count({
        where: { containerNo: { not: null } },
      }),
      prisma.railOperation.count({
        where: {
          status: 'SCHEDULED',
          manifestUploaded: false,
        },
      }),
    ])

    // Calculate compliance percentages
    const totalGatePasses = await prisma.gatePass.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    })
    const totalRailOps = await prisma.railOperation.count()
    const totalYardSlots = await prisma.yardSlot.count()

    res.json({
      overallCompliance: 97,
      metrics: {
        gatePassCompliance: totalGatePasses > 0 ? Math.round((gatePassCompliance / totalGatePasses) * 100) : 100,
        railManifestCompliance: totalRailOps > 0 ? Math.round((railManifestCompliance / totalRailOps) * 100) : 100,
        yardInventoryAccuracy: totalYardSlots > 0 ? Math.round((yardInventoryAccuracy / totalYardSlots) * 100) : 100,
        containerTracking: 99,
      },
      alerts: {
        pendingRailDocs,
        expiredGatePasses: await prisma.gatePass.count({ where: { status: 'EXPIRED' } }),
        unmatchedContainers: await prisma.container.count({ where: { yardSlotId: null, status: 'IN_YARD' } }),
      },
      lastUpdated: now.toISOString(),
    })
  } catch (error) {
    console.error('Error fetching APAD compliance:', error)
    res.status(500).json({ error: 'Failed to fetch APAD compliance' })
  }
})

// GET /api/apad/audit-log - Get APAD audit trail
router.get('/audit-log', async (req, res) => {
  try {
    const { startDate, endDate, entityType } = req.query
    
    const where: any = {}
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate as string)
      if (endDate) where.createdAt.lte = new Date(endDate as string)
    }
    if (entityType) where.entityType = entityType

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    res.json(logs)
  } catch (error) {
    console.error('Error fetching APAD audit log:', error)
    res.status(500).json({ error: 'Failed to fetch APAD audit log' })
  }
})

// GET /api/apad/reports - Get APAD compliance reports
router.get('/reports', async (req, res) => {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      monthlyGateActivity,
      monthlyRailActivity,
      yardUtilization,
    ] = await Promise.all([
      prisma.gatePass.groupBy({
        by: ['type'],
        where: { createdAt: { gte: startOfMonth } },
        _count: { id: true },
      }),
      prisma.railOperation.groupBy({
        by: ['status'],
        where: { departureDate: { gte: startOfMonth } },
        _count: { id: true },
      }),
      prisma.yardBlock.findMany({
        include: {
          _count: { select: { slots: true } },
          slots: {
            where: { containerNo: { not: null } },
            select: { id: true },
          },
        },
      }),
    ])

    res.json({
      period: {
        start: startOfMonth.toISOString(),
        end: now.toISOString(),
      },
      gateActivity: monthlyGateActivity,
      railActivity: monthlyRailActivity,
      yardUtilization: yardUtilization.map(block => ({
        block: block.code,
        totalSlots: block._count.slots,
        occupiedSlots: block.slots.length,
        utilizationPercent: Math.round((block.slots.length / block._count.slots) * 100),
      })),
    })
  } catch (error) {
    console.error('Error fetching APAD reports:', error)
    res.status(500).json({ error: 'Failed to fetch APAD reports' })
  }
})

// GET /api/apad/ktmb-integration - Get KTMB integration status
router.get('/ktmb-integration', async (req, res) => {
  try {
    // Mock KTMB integration status
    res.json({
      connected: true,
      lastSync: new Date().toISOString(),
      syncStatus: 'ACTIVE',
      pendingUploads: 0,
      pendingDownloads: 0,
      apis: {
        manifest: { status: 'OPERATIONAL', lastCall: new Date().toISOString() },
        tracking: { status: 'OPERATIONAL', lastCall: new Date().toISOString() },
        schedule: { status: 'OPERATIONAL', lastCall: new Date().toISOString() },
      },
    })
  } catch (error) {
    console.error('Error fetching KTMB integration:', error)
    res.status(500).json({ error: 'Failed to fetch KTMB integration status' })
  }
})

export { router as apadRouter }
