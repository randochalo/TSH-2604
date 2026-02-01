import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/jobs - List all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.haulageJob.findMany({
      include: {
        customer: true,
        vehicle: true,
        driver: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' })
  }
})

// GET /api/jobs/:id - Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.haulageJob.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        vehicle: true,
        driver: {
          include: { user: true },
        },
        trailer: true,
      },
    })
    if (!job) {
      return res.status(404).json({ error: 'Job not found' })
    }
    res.json(job)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' })
  }
})

// POST /api/jobs - Create new job
router.post('/', async (req, res) => {
  try {
    const job = await prisma.haulageJob.create({
      data: {
        jobNo: `JOB-${Date.now()}`,
        ...req.body,
      },
    })
    res.status(201).json(job)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' })
  }
})

// PATCH /api/jobs/:id - Update job
router.patch('/:id', async (req, res) => {
  try {
    const job = await prisma.haulageJob.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(job)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' })
  }
})

export { router as jobsRouter }
