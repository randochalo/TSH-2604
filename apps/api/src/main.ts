import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import { jobsRouter } from './routes/jobs'
import { vehiclesRouter } from './routes/vehicles'
import { driversRouter } from './routes/drivers'
import { healthRouter } from './routes/health'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use('/api/health', healthRouter)
app.use('/api/jobs', jobsRouter)
app.use('/api/vehicles', vehiclesRouter)
app.use('/api/drivers', driversRouter)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})
