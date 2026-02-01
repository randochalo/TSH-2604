import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { currentBranch: true },
      orderBy: { registrationNo: 'asc' },
    })
    res.json(vehicles)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        currentBranch: true,
        jobs: {
          where: {
            status: {
              in: ['ASSIGNED', 'DISPATCHED', 'IN_TRANSIT'],
            },
          },
        },
        maintenance: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    })
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' })
    }
    res.json(vehicle)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle' })
  }
})

export { router as vehiclesRouter }
