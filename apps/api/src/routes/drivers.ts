import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        user: true,
        _count: {
          select: { jobs: true },
        },
      },
      orderBy: {
        user: {
          firstName: 'asc',
        },
      },
    })
    res.json(drivers)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: req.params.id },
      include: {
        user: true,
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            customer: true,
          },
        },
        incentives: {
          orderBy: { period: 'desc' },
          take: 12,
        },
      },
    })
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' })
    }
    res.json(driver)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver' })
  }
})

export { router as driversRouter }
