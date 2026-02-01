import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'

import { jobsRouter } from './routes/jobs'
import { vehiclesRouter } from './routes/vehicles'
import { driversRouter } from './routes/drivers'
import { healthRouter } from './routes/health'

// FFS Routes
import { shipmentsRouter } from './routes/shipments'
import { containersRouter } from './routes/containers'
import { customsEntriesRouter } from './routes/customs-entries'

// WMS Routes
import { warehousesRouter } from './routes/warehouses'
import { inventoryRouter } from './routes/inventory'
import { locationsRouter } from './routes/locations'

// TMS Routes
import { yardRouter } from './routes/yard'
import { gatePassesRouter } from './routes/gate-passes'
import { railOperationsRouter } from './routes/rail-operations'

// FMS Routes
import { customersRouter } from './routes/customers'
import { vendorsRouter } from './routes/vendors'
import { invoicesRouter } from './routes/invoices'
import { paymentsRouter } from './routes/payments'
import { accountsRouter } from './routes/accounts'
import { journalEntriesRouter } from './routes/journal-entries'
import { fixedAssetsRouter } from './routes/fixed-assets'

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

// FFS Routes
app.use('/api/shipments', shipmentsRouter)
app.use('/api/containers', containersRouter)
app.use('/api/customs-entries', customsEntriesRouter)

// WMS Routes
app.use('/api/warehouses', warehousesRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/locations', locationsRouter)

// TMS Routes
app.use('/api/yard', yardRouter)
app.use('/api/gate-passes', gatePassesRouter)
app.use('/api/rail-operations', railOperationsRouter)

// FMS Routes
app.use('/api/customers', customersRouter)
app.use('/api/vendors', vendorsRouter)
app.use('/api/invoices', invoicesRouter)
app.use('/api/payments', paymentsRouter)
app.use('/api/accounts', accountsRouter)
app.use('/api/journal-entries', journalEntriesRouter)
app.use('/api/fixed-assets', fixedAssetsRouter)

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`)
})
