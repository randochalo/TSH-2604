import { prisma } from '../src/client'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding database...')

  // Create branches
  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { code: 'HQ' },
      update: {},
      create: {
        code: 'HQ',
        name: 'Headquarters',
        type: 'HEADQUARTERS',
        address: 'MMF Headquarters, Port Klang',
        city: 'Klang',
        state: 'Selangor',
        phone: '+603-XXXX XXXX',
        email: 'hq@mmf.com.my',
      },
    }),
    prisma.branch.upsert({
      where: { code: 'PK' },
      update: {},
      create: {
        code: 'PK',
        name: 'Port Klang',
        type: 'PORT',
        address: 'Port Klang Operations',
        city: 'Port Klang',
        state: 'Selangor',
        phone: '+603-XXXX XXXX',
        email: 'pk@mmf.com.my',
      },
    }),
    prisma.branch.upsert({
      where: { code: 'BTW' },
      update: {},
      create: {
        code: 'BTW',
        name: 'Butterworth',
        type: 'PORT',
        address: 'Butterworth Terminal',
        city: 'Butterworth',
        state: 'Penang',
        phone: '+604-XXXX XXXX',
        email: 'btw@mmf.com.my',
      },
    }),
  ])

  console.log(`Created ${branches.length} branches`)

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mmf.com.my' },
    update: {},
    create: {
      email: 'admin@mmf.com.my',
      username: 'admin',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      role: 'SUPER_ADMIN',
      permissions: ['*'],
      branchId: branches[0].id,
      emailVerified: new Date(),
    },
  })

  console.log('Created admin user:', admin.email)

  // Create sample vehicles
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        registrationNo: 'WXX1234',
        type: 'PRIME_MOVER',
        make: 'Volvo',
        model: 'FH16',
        year: 2023,
        color: 'White',
        capacity: 40,
        status: 'ACTIVE',
        currentBranchId: branches[1].id,
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNo: 'WXX5678',
        type: 'PRIME_MOVER',
        make: 'Scania',
        model: 'R500',
        year: 2022,
        color: 'Blue',
        capacity: 40,
        status: 'ACTIVE',
        currentBranchId: branches[1].id,
      },
    }),
  ])

  console.log(`Created ${vehicles.length} vehicles`)

  // Create sample trailers
  const trailers = await Promise.all([
    prisma.trailer.create({
      data: {
        registrationNo: 'T12345',
        type: 'SKELETAL',
        size: '40ft',
        status: 'AVAILABLE',
      },
    }),
    prisma.trailer.create({
      data: {
        registrationNo: 'T67890',
        type: 'SKELETAL',
        size: '20ft',
        status: 'AVAILABLE',
      },
    }),
  ])

  console.log(`Created ${trailers.length} trailers`)

  // Create sample customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        code: 'CUST001',
        name: 'ABC Logistics Sdn Bhd',
        type: 'CUSTOMER',
        address: '123 Business Park',
        city: 'Shah Alam',
        state: 'Selangor',
        phone: '+603-1234 5678',
        email: 'info@abclogistics.com',
        creditLimit: 50000,
        creditDays: 30,
        branchId: branches[0].id,
      },
    }),
    prisma.customer.create({
      data: {
        code: 'CUST002',
        name: 'Global Freight Services',
        type: 'CUSTOMER',
        address: '456 Industrial Zone',
        city: 'Port Klang',
        state: 'Selangor',
        phone: '+603-8765 4321',
        email: 'ops@globalfreight.com',
        creditLimit: 100000,
        creditDays: 45,
        branchId: branches[1].id,
      },
    }),
  ])

  console.log(`Created ${customers.length} customers`)

  // Create sample warehouse
  const warehouse = await prisma.warehouse.create({
    data: {
      code: 'WH-PK-01',
      name: 'Port Klang Warehouse 1',
      branchId: branches[1].id,
      address: 'Warehouse Complex, Port Klang',
      totalArea: 50000,
    },
  })

  console.log('Created warehouse:', warehouse.name)

  // Create chart of accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        code: '1000',
        name: 'Cash on Hand',
        type: 'ASSET',
        category: 'Current Assets',
      },
    }),
    prisma.account.create({
      data: {
        code: '1100',
        name: 'Accounts Receivable',
        type: 'ASSET',
        category: 'Current Assets',
      },
    }),
    prisma.account.create({
      data: {
        code: '2000',
        name: 'Accounts Payable',
        type: 'LIABILITY',
        category: 'Current Liabilities',
      },
    }),
    prisma.account.create({
      data: {
        code: '4000',
        name: 'Haulage Revenue',
        type: 'REVENUE',
        category: 'Operating Revenue',
      },
    }),
    prisma.account.create({
      data: {
        code: '5000',
        name: 'Fuel Expense',
        type: 'EXPENSE',
        category: 'Operating Expenses',
      },
    }),
  ])

  console.log(`Created ${accounts.length} accounts`)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
