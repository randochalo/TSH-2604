import { prisma } from '../src/client'
import bcrypt from 'bcryptjs'

// Helper functions
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const generateInvoiceNo = (prefix: string, index: number) => {
  return `${prefix}-${new Date().getFullYear()}-${String(index).padStart(5, '0')}`
}

const generateBLNumber = () => {
  const prefixes = ['MAEU', 'MSCU', 'CMDU', 'COSU', 'ONEY']
  return `${randomElement(prefixes)}${randomInt(1000000, 9999999)}`
}

const containerPrefixes = ['MSCU', 'MEDU', 'TCLU', 'CMAU', 'COSU', 'HLCU', 'OOLU']

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')

  // ============================================
  // BRANCHES
  // ============================================
  console.log('Creating branches...')
  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { code: 'HQ' },
      update: {},
      create: {
        code: 'HQ',
        name: 'Headquarters',
        type: 'HEADQUARTERS',
        address: 'MMF Headquarters, Lot 123, Port Klang Industrial Zone',
        city: 'Klang',
        state: 'Selangor',
        postcode: '42000',
        phone: '+603-3178 9123',
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
        address: 'Northport, Port Klang',
        city: 'Port Klang',
        state: 'Selangor',
        postcode: '42000',
        phone: '+603-3178 9456',
        email: 'pk@mmf.com.my',
      },
    }),
    prisma.branch.upsert({
      where: { code: 'WSP' },
      update: {},
      create: {
        code: 'WSP',
        name: 'Westport',
        type: 'PORT',
        address: 'Westport, Pulau Indah',
        city: 'Port Klang',
        state: 'Selangor',
        postcode: '42920',
        phone: '+603-3198 1234',
        email: 'wsp@mmf.com.my',
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
        postcode: '12000',
        phone: '+604-331 7890',
        email: 'btw@mmf.com.my',
      },
    }),
    prisma.branch.upsert({
      where: { code: 'JHB' },
      update: {},
      create: {
        code: 'JHB',
        name: 'Johor Bahru',
        type: 'PORT',
        address: 'Tanjung Pelepas Port',
        city: 'Johor Bahru',
        state: 'Johor',
        postcode: '81500',
        phone: '+607-505 1234',
        email: 'jhb@mmf.com.my',
      },
    }),
  ])
  console.log(`✅ Created ${branches.length} branches`)

  // ============================================
  // USERS (with different roles)
  // ============================================
  console.log('Creating users...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const usersData = [
    { email: 'admin@mmf.com.my', username: 'admin', firstName: 'System', lastName: 'Administrator', role: 'SUPER_ADMIN' },
    { email: 'branch.admin@mmf.com.my', username: 'branchadmin', firstName: 'Branch', lastName: 'Admin', role: 'BRANCH_ADMIN' },
    { email: 'manager@mmf.com.my', username: 'manager', firstName: 'Operations', lastName: 'Manager', role: 'MANAGER' },
    { email: 'supervisor@mmf.com.my', username: 'supervisor', firstName: 'Warehouse', lastName: 'Supervisor', role: 'SUPERVISOR' },
    { email: 'operator@mmf.com.my', username: 'operator', firstName: 'Staff', lastName: 'Operator', role: 'OPERATOR' },
    { email: 'readonly@mmf.com.my', username: 'readonly', firstName: 'Read', lastName: 'Only', role: 'READ_ONLY' },
  ]

  const users = await Promise.all(
    usersData.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          ...u,
          password: hashedPassword,
          permissions: u.role === 'SUPER_ADMIN' ? ['*'] : [],
          branchId: branches[0].id,
          emailVerified: new Date(),
        },
      })
    )
  )
  console.log(`✅ Created ${users.length} users`)

  // ============================================
  // CUSTOMERS (30+ with various credit statuses)
  // ============================================
  console.log('Creating customers...')
  
  const customerNames = [
    'ABC Logistics Sdn Bhd', 'Global Freight Services', 'Tech Solutions Inc', 'Marina Bay Logistics',
    'Sunrise Trading Co', 'Pacific Shipping Ltd', 'Golden Gate Transport', 'Asia Pacific Forwarders',
    'Swift Cargo Services', 'Elite Shipping Solutions', 'Horizon Logistics', 'Ocean Blue Transport',
    'Star Freight Systems', 'Maxi Haulage Sdn Bhd', 'Unity Shipping Co', 'Prime Logistics Group',
    'Fast Track Shipping', 'Continental Cargo', 'Summit Transport', 'Apex Freight Solutions',
    'Metro Shipping Lines', 'Crown Logistics', 'Diamond Transport', 'Royal Cargo Services',
    'Paramount Shipping', 'Supreme Logistics', 'Premier Transport', 'Excel Cargo Systems',
    'Phoenix Shipping', 'Titan Logistics', 'Atlas Transport', 'Vertex Cargo',
  ]

  const cities = ['Shah Alam', 'Kuala Lumpur', 'Petaling Jaya', 'Port Klang', 'Subang Jaya', 'Klang', 'Cheras', 'Puchong']
  const states = ['Selangor', 'Kuala Lumpur', 'Penang', 'Johor', 'Perak']

  const customers = await Promise.all(
    customerNames.map((name, i) => {
      const creditLimit = randomInt(10000, 500000)
      const creditDays = randomElement([30, 45, 60, 90])
      // Some customers have credit issues for demo
      const creditStatus = i < 3 ? 'HOLD' : i === 3 ? 'SUSPENDED' : 'ACTIVE'
      
      return prisma.customer.upsert({
        where: { code: `CUST${String(i + 1).padStart(3, '0')}` },
        update: {},
        create: {
          code: `CUST${String(i + 1).padStart(3, '0')}`,
          name,
          type: 'CUSTOMER',
          address: `${randomInt(1, 999)} ${randomElement(['Jalan', 'Jln', 'Lot'])} ${randomElement(['Mega', 'Indah', 'Utama', 'Perdana'])}, ${randomElement(cities)}`,
          city: randomElement(cities),
          state: randomElement(states),
          postcode: String(randomInt(10000, 99999)),
          phone: `+603-${randomInt(1000, 9999)} ${randomInt(1000, 9999)}`,
          email: `contact@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          regNo: `REG-${randomInt(100000, 999999)}-A`,
          taxNo: `C${randomInt(1000000000, 9999999999)}`,
          creditLimit,
          creditDays,
          creditStatus,
          branchId: randomElement(branches).id,
        },
      })
    })
  )
  console.log(`✅ Created ${customers.length} customers`)

  // ============================================
  // VENDORS/CARRIERS (20+)
  // ============================================
  console.log('Creating vendors...')
  
  const vendorNames = [
    'Maersk Line', 'MSC Malaysia', 'CMA CGM', 'COSCO Shipping', 'Ocean Network Express',
    'Hapag-Lloyd', 'Evergreen Line', 'Yang Ming Marine', 'Hyundai Merchant Marine', 'PIL',
    'KMTC', 'RCL', 'Samudera Shipping', 'Namsung Shipping', 'SITC',
    'Gold Star Line', 'Zhonggu Logistics', 'SeaLead Shipping', 'TS Lines', 'SM Line',
  ]

  const vendors = await Promise.all(
    vendorNames.map((name, i) =>
      prisma.vendor.upsert({
        where: { code: `VEND${String(i + 1).padStart(3, '0')}` },
        update: {},
        create: {
          code: `VEND${String(i + 1).padStart(3, '0')}`,
          name,
          type: randomElement(['VENDOR', 'CARRIER', 'HAULIER']),
          address: `${randomInt(1, 999)} Port Commercial Area`,
          city: randomElement(cities),
          state: 'Selangor',
          phone: `+603-${randomInt(1000, 9999)} ${randomInt(1000, 9999)}`,
          email: `ops@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
          branchId: randomElement(branches).id,
        },
      })
    )
  )
  console.log(`✅ Created ${vendors.length} vendors`)

  // ============================================
  // VEHICLES (20+)
  // ============================================
  console.log('Creating vehicles...')
  
  const vehicleMakes = ['Volvo', 'Scania', 'Mercedes-Benz', 'MAN', 'Isuzu', 'Hino', 'Fuso']
  const vehicleModels = ['FH16', 'R500', 'Actros', 'TGS', 'Giga', '700 Series', 'Super Great']

  const vehicles = await Promise.all(
    Array.from({ length: 25 }, (_, i) => {
      const make = randomElement(vehicleMakes)
      const year = randomInt(2019, 2024)
      
      return prisma.vehicle.create({
        data: {
          registrationNo: `W${randomElement(['X', 'Y', 'Z'])}${randomInt(1000, 9999)}`,
          chassisNo: `CHS${randomInt(1000000000, 9999999999)}`,
          engineNo: `ENG${randomInt(1000000, 9999999)}`,
          type: randomElement(['PRIME_MOVER', 'LORRY', 'VAN']),
          make,
          model: randomElement(vehicleModels),
          year,
          color: randomElement(['White', 'Blue', 'Red', 'Silver', 'Black']),
          capacity: randomElement([20, 30, 40, 45]),
          fuelType: 'DIESEL',
          status: randomElement(['ACTIVE', 'ACTIVE', 'ACTIVE', 'MAINTENANCE']),
          currentBranchId: randomElement(branches).id,
          roadTaxExpiry: randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
          insuranceExpiry: randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)),
          puspakomExpiry: randomDate(new Date(), new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)),
        },
      })
    })
  )
  console.log(`✅ Created ${vehicles.length} vehicles`)

  // ============================================
  // TRAILERS (20+)
  // ============================================
  console.log('Creating trailers...')
  
  const trailers = await Promise.all(
    Array.from({ length: 30 }, (_, i) =>
      prisma.trailer.create({
        data: {
          registrationNo: `T${randomInt(10000, 99999)}`,
          type: randomElement(['FLATBED', 'SKELETAL', 'BOX', 'REEFER']),
          size: randomElement(['20ft', '40ft', '45ft']),
          tareWeight: randomElement([3000, 3800, 4200]),
          maxGrossWeight: randomElement([30480, 32500, 35000]),
          puspakomExpiry: randomDate(new Date(), new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)),
          status: randomElement(['AVAILABLE', 'AVAILABLE', 'IN_USE', 'MAINTENANCE']),
        },
      })
    )
  )
  console.log(`✅ Created ${trailers.length} trailers`)

  // ============================================
  // DRIVERS (20+ with complete profiles)
  // ============================================
  console.log('Creating drivers...')
  
  const firstNames = ['Ahmad', 'Mohammad', 'Abdullah', 'Ismail', 'Ibrahim', 'Razak', 'Hassan', 'Kamaruddin', 'Zulkifli', 'Nor',
    'John', 'David', 'Michael', 'Robert', 'James', 'William', 'Richard', 'Thomas', 'Daniel', 'Christopher']
  const lastNames = ['Bin Abdullah', 'Bin Ismail', 'Bin Ibrahim', 'Bin Hassan', 'Bin Yusuf', 'Bin Ahmad',
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']

  const drivers = await Promise.all(
    Array.from({ length: 25 }, async (_, i) => {
      // Create user account for driver
      const driverUser = await prisma.user.create({
        data: {
          email: `driver${i + 1}@mmf.com.my`,
          username: `driver${i + 1}`,
          password: hashedPassword,
          firstName: firstNames[i % firstNames.length],
          lastName: lastNames[i % lastNames.length],
          role: 'DRIVER',
          branchId: randomElement(branches).id,
          emailVerified: new Date(),
        },
      })

      return prisma.driver.create({
        data: {
          userId: driverUser.id,
          licenseNo: `DL${randomInt(10000000, 99999999)}`,
          licenseClass: randomElement([['B2', 'D'], ['B2', 'D', 'E'], ['D', 'E']]),
          licenseExpiry: randomDate(new Date(), new Date(Date.now() + 730 * 24 * 60 * 60 * 1000)),
          employeeNo: `EMP${String(i + 1).padStart(4, '0')}`,
          joiningDate: randomDate(new Date(2020, 0, 1), new Date()),
          emergencyContact: randomElement(['Spouse', 'Parent', 'Sibling']),
          emergencyPhone: `+601${randomInt(0, 9)}-${randomInt(1000000, 9999999)}`,
          address: `${randomInt(1, 999)}, ${randomElement(['Taman', 'Kampung', 'Desa'])} ${randomElement(['Indah', 'Permai', 'Jaya'])}, ${randomInt(10000, 99999)} ${randomElement(cities)}`,
          rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          totalJobs: randomInt(50, 500),
        },
      })
    })
  )
  console.log(`✅ Created ${drivers.length} drivers`)

  // ============================================
  // HAULAGE JOBS (50+)
  // ============================================
  console.log('Creating haulage jobs...')
  
  const ports = ['Port Klang', 'Northport', 'Westport', 'Tanjung Pelepas', 'Penang Port', 'Kuantan Port']
  const containerSizes = ['20ft', '40ft', '40HC']
  const containerTypes = ['GP', 'HC', 'RF', 'OT', 'FR', 'TK']

  const jobs = await Promise.all(
    Array.from({ length: 60 }, (_, i) => {
      const pickupTime = randomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      const deliveryTime = new Date(pickupTime.getTime() + randomInt(2, 48) * 60 * 60 * 1000)
      const status = randomElement(['PENDING', 'ASSIGNED', 'DISPATCHED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'])
      
      return prisma.haulageJob.create({
        data: {
          jobNo: `JOB-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`,
          status,
          vehicleId: status !== 'PENDING' ? randomElement(vehicles).id : null,
          driverId: status !== 'PENDING' ? randomElement(drivers).id : null,
          trailerId: status !== 'PENDING' ? randomElement(trailers).id : null,
          containerNo: `${randomElement(containerPrefixes)}${randomInt(1000000, 9999999)}`,
          containerSize: randomElement(containerSizes),
          containerType: randomElement(containerTypes),
          sealNo: `SL${randomInt(100000, 999999)}`,
          pickupLocation: randomElement(ports),
          pickupAddress: `${randomElement(ports)} Container Yard`,
          pickupTime,
          deliveryLocation: randomElement(['Shah Alam', 'Kuala Lumpur', 'Petaling Jaya', 'Subang', 'Klang']),
          deliveryAddress: `${randomInt(1, 999)} ${randomElement(['Jalan', 'Jln'])} ${randomElement(['Mega', 'Indah', 'Utama'])}, ${randomElement(cities)}`,
          deliveryTime,
          vesselName: randomElement(['MAERSK EDINBURGH', 'MSC OSCAR', 'COSCO SHANGHAI', 'ONE COMPETENCE', 'EVER GLORY']),
          voyageNo: `${randomInt(100, 999)}W`,
          eta: randomDate(new Date(), new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
          customerId: randomElement(customers).id,
          cargoDesc: randomElement(['Electronic Goods', 'Automotive Parts', 'Textiles', 'Machinery', 'Consumer Goods', 'Raw Materials']),
          weight: randomInt(5000, 28000),
          rate: randomInt(300, 1500),
          podReceived: status === 'COMPLETED' ? Math.random() > 0.3 : false,
          podDate: status === 'COMPLETED' ? deliveryTime : null,
        },
      })
    })
  )
  console.log(`✅ Created ${jobs.length} haulage jobs`)

  // ============================================
  // SHIPMENTS (100+)
  // ============================================
  console.log('Creating shipments...')
  
  const origins = ['Port Klang', 'Singapore', 'Hong Kong', 'Shanghai', 'Ningbo', 'Shenzhen', 'Kaohsiung', 'Busan']
  const destinations = ['Rotterdam', 'Hamburg', 'Felixstowe', 'Los Angeles', 'New York', 'Vancouver', 'Sydney', 'Melbourne', 'Dubai', 'Mumbai']

  const shipments = await Promise.all(
    Array.from({ length: 120 }, (_, i) => {
      const etd = randomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000))
      const eta = new Date(etd.getTime() + randomInt(10, 45) * 24 * 60 * 60 * 1000)
      const status = randomElement(['BOOKED', 'CONFIRMED', 'IN_TRANSIT', 'ARRIVED', 'CLEARED', 'DELIVERED', 'COMPLETED'])
      const mode = randomElement(['SEA', 'AIR', 'LAND'])
      
      return prisma.shipment.create({
        data: {
          shipmentNo: `SHP-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`,
          bookingNo: `BKG${randomInt(100000, 999999)}`,
          mode,
          type: mode === 'SEA' ? randomElement(['FCL', 'LCL']) : 'FCL',
          status,
          shipperId: randomElement(customers).id,
          consigneeId: randomElement(customers).id,
          notifyPartyId: Math.random() > 0.5 ? randomElement(customers).id : null,
          origin: randomElement(origins),
          destination: randomElement(destinations),
          pol: randomElement(origins),
          pod: randomElement(destinations),
          etd,
          eta,
          actualDeparture: status !== 'BOOKED' && status !== 'CONFIRMED' ? etd : null,
          actualArrival: ['ARRIVED', 'CLEARED', 'DELIVERED', 'COMPLETED'].includes(status) ? eta : null,
          carrierId: randomElement(vendors).id,
          vesselName: mode === 'SEA' ? randomElement(['MAERSK EDINBURGH', 'MSC OSCAR', 'COSCO SHANGHAI', 'EVER GLORY', 'ONE COMPETENCE']) : null,
          voyageNo: mode === 'SEA' ? `${randomInt(100, 999)}W` : null,
          cargoDesc: randomElement(['Electronic Components', 'Automotive Parts', 'Textiles & Garments', 'Machinery', 'Consumer Goods', 'Chemicals', 'Food Products']),
          packages: randomInt(1, 100),
          packageType: randomElement(['CTNS', 'PLTS', 'BAGS', 'DRMS']),
          grossWeight: randomInt(1000, 25000),
          volume: parseFloat((Math.random() * 50 + 5).toFixed(2)),
          blNo: mode === 'SEA' ? generateBLNumber() : null,
          awbNo: mode === 'AIR' ? `${randomElement(['176', '232', '607', '160'])}-${randomInt(10000000, 99999999)}` : null,
        },
      })
    })
  )
  console.log(`✅ Created ${shipments.length} shipments`)

  // ============================================
  // CONTAINERS (for shipments)
  // ============================================
  console.log('Creating containers...')
  
  const containers = await Promise.all(
    shipments.filter(s => s.mode === 'SEA').slice(0, 80).map((shipment) =>
      prisma.container.create({
        data: {
          containerNo: `${randomElement(containerPrefixes)}${randomInt(1000000, 9999999)}`,
          size: randomElement(['20ft', '40ft', '40HC']),
          type: randomElement(['GP', 'HC', 'RF', 'OT']),
          sealNo: `SL${randomInt(100000, 999999)}`,
          shipmentId: shipment.id,
          tareWeight: randomElement([2200, 3800, 4200]),
          grossWeight: randomInt(5000, 28000),
          volume: parseFloat((Math.random() * 60 + 10).toFixed(2)),
        },
      })
    )
  )
  console.log(`✅ Created ${containers.length} containers`)

  // ============================================
  // WAREHOUSES & LOCATIONS
  // ============================================
  console.log('Creating warehouses and locations...')
  
  const warehouses = await Promise.all(
    branches.slice(1).map((branch, i) =>
      prisma.warehouse.create({
        data: {
          code: `WH-${branch.code}-01`,
          name: `${branch.name} Warehouse`,
          branchId: branch.id,
          address: `${branch.address} Warehouse Complex`,
          totalArea: randomInt(10000, 100000),
        },
      })
    )
  )
  console.log(`✅ Created ${warehouses.length} warehouses`)

  // Create locations for each warehouse
  const zones = ['A', 'B', 'C', 'D', 'E', 'F']
  const locationTypes = ['STANDARD', 'BULK', 'REFRIGERATED', 'HAZARDOUS', 'PICKING', 'RECEIVING', 'SHIPPING']
  
  for (const warehouse of warehouses) {
    const locations = await Promise.all(
      Array.from({ length: 50 }, (_, i) => {
        const zone = randomElement(zones)
        return prisma.warehouseLocation.create({
          data: {
            code: `${zone}-${String(randomInt(1, 20)).padStart(2, '0')}-${String(randomInt(1, 5)).padStart(2, '0')}`,
            zone,
            aisle: String(randomInt(1, 20)),
            rack: String(randomInt(1, 10)),
            level: String(randomInt(1, 5)),
            bin: String(randomInt(1, 20)),
            warehouseId: warehouse.id,
            type: randomElement(locationTypes),
            capacity: randomInt(100, 5000),
          },
        })
      })
    )
  }
  console.log(`✅ Created ${warehouses.length * 50} warehouse locations`)

  // ============================================
  // INVENTORY (500+ items)
  // ============================================
  console.log('Creating inventory items...')
  
  const productCategories = [
    'Electronics', 'Automotive Parts', 'Textiles', 'Chemicals', 'Food Products',
    'Machinery Parts', 'Packaging Materials', 'Raw Materials', 'Consumer Goods', 'Medical Supplies',
  ]
  
  const allLocations = await prisma.warehouseLocation.findMany()
  
  const inventory = await Promise.all(
    Array.from({ length: 500 }, (_, i) => {
      const category = randomElement(productCategories)
      const warehouse = randomElement(warehouses)
      const location = allLocations.filter(l => l.warehouseId === warehouse.id)[0]
      
      return prisma.inventory.create({
        data: {
          warehouseId: warehouse.id,
          locationId: location?.id || null,
          sku: `SKU-${category.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(5, '0')}`,
          description: `${category} Item ${i + 1} - ${randomElement(['Grade A', 'Standard', 'Premium', 'Industrial'])}`,
          batchNo: `BATCH${new Date().getFullYear()}${String(randomInt(1, 999)).padStart(3, '0')}`,
          quantity: randomInt(0, 1000),
          uom: randomElement(['PCS', 'KG', 'BOX', 'PALLET', 'CARTON']),
          status: randomElement(['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'RESERVED', 'QUARANTINE']),
          expiryDate: randomElement([null, randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))]),
        },
      })
    })
  )
  console.log(`✅ Created ${inventory.length} inventory items`)

  // ============================================
  // INVOICES (30+ with various statuses)
  // ============================================
  console.log('Creating invoices...')
  
  const invoiceStatuses = ['DRAFT', 'SENT', 'PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED']
  
  const invoices = await Promise.all(
    Array.from({ length: 50 }, async (_, i) => {
      const status = i < 5 ? 'OVERDUE' : i < 10 ? 'PAID' : randomElement(invoiceStatuses)
      const total = randomInt(1000, 50000)
      const paidAmount = status === 'PAID' ? total : status === 'PARTIAL' ? total * 0.5 : 0
      const balance = total - paidAmount
      
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNo: generateInvoiceNo('INV', i + 1),
          type: 'SALES',
          customerId: randomElement(customers).id,
          invoiceDate: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
          dueDate: randomDate(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)),
          subtotal: total * 0.9,
          taxAmount: total * 0.1,
          total,
          paidAmount,
          balance,
          currency: 'MYR',
          status,
          eInvoiceStatus: status !== 'DRAFT' ? randomElement(['PENDING', 'VALIDATED']) : 'PENDING',
          eInvoiceUuid: status !== 'DRAFT' ? `UUID-${Date.now()}-${i}` : null,
        },
      })

      // Create invoice items
      await prisma.invoiceItem.createMany({
        data: Array.from({ length: randomInt(1, 5) }, (_, j) => ({
          invoiceId: invoice.id,
          description: randomElement(['Haulage Services', 'Freight Forwarding', 'Warehousing', 'Customs Clearance', 'Documentation']),
          quantity: randomInt(1, 10),
          unitPrice: randomInt(100, 1000),
          amount: randomInt(100, 5000),
          taxCode: 'SR',
          taxAmount: randomInt(10, 500),
        })),
      })

      return invoice
    })
  )
  console.log(`✅ Created ${invoices.length} invoices`)

  // ============================================
  // PURCHASE INVOICES (AP)
  // ============================================
  console.log('Creating purchase invoices...')
  
  const purchaseInvoices = await Promise.all(
    Array.from({ length: 30 }, async (_, i) => {
      const total = randomInt(500, 20000)
      
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNo: generateInvoiceNo('BILL', i + 1),
          type: 'PURCHASE',
          vendorId: randomElement(vendors).id,
          invoiceDate: randomDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), new Date()),
          dueDate: randomDate(new Date(), new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)),
          subtotal: total * 0.9,
          taxAmount: total * 0.1,
          total,
          paidAmount: randomInt(0, total),
          balance: randomInt(0, total),
          currency: 'MYR',
          status: randomElement(['PENDING', 'PARTIAL', 'PAID']),
        },
      })

      return invoice
    })
  )
  console.log(`✅ Created ${purchaseInvoices.length} purchase invoices`)

  // ============================================
  // CHART OF ACCOUNTS
  // ============================================
  console.log('Creating chart of accounts...')
  
  const accounts = [
    { code: '1000', name: 'Cash on Hand', type: 'ASSET', category: 'Current Assets' },
    { code: '1100', name: 'Bank Accounts', type: 'ASSET', category: 'Current Assets' },
    { code: '1200', name: 'Accounts Receivable', type: 'ASSET', category: 'Current Assets' },
    { code: '1300', name: 'Inventory', type: 'ASSET', category: 'Current Assets' },
    { code: '1500', name: 'Vehicles', type: 'ASSET', category: 'Fixed Assets' },
    { code: '1600', name: 'Equipment', type: 'ASSET', category: 'Fixed Assets' },
    { code: '2000', name: 'Accounts Payable', type: 'LIABILITY', category: 'Current Liabilities' },
    { code: '2100', name: 'Tax Payable', type: 'LIABILITY', category: 'Current Liabilities' },
    { code: '2200', name: 'Accruals', type: 'LIABILITY', category: 'Current Liabilities' },
    { code: '3000', name: 'Share Capital', type: 'EQUITY', category: 'Equity' },
    { code: '3100', name: 'Retained Earnings', type: 'EQUITY', category: 'Equity' },
    { code: '4000', name: 'Haulage Revenue', type: 'REVENUE', category: 'Operating Revenue' },
    { code: '4100', name: 'Freight Revenue', type: 'REVENUE', category: 'Operating Revenue' },
    { code: '4200', name: 'Warehousing Revenue', type: 'REVENUE', category: 'Operating Revenue' },
    { code: '5000', name: 'Fuel Expense', type: 'EXPENSE', category: 'Operating Expenses' },
    { code: '5100', name: 'Driver Salaries', type: 'EXPENSE', category: 'Operating Expenses' },
    { code: '5200', name: 'Maintenance', type: 'EXPENSE', category: 'Operating Expenses' },
    { code: '5300', name: 'Insurance', type: 'EXPENSE', category: 'Operating Expenses' },
    { code: '5400', name: 'Rent', type: 'EXPENSE', category: 'Operating Expenses' },
    { code: '5500', name: 'Utilities', type: 'EXPENSE', category: 'Operating Expenses' },
  ]

  await Promise.all(
    accounts.map((acc) =>
      prisma.account.upsert({
        where: { code: acc.code },
        update: {},
        create: acc,
      })
    )
  )
  console.log(`✅ Created ${accounts.length} accounts`)

  // ============================================
  // FIXED ASSETS
  // ============================================
  console.log('Creating fixed assets...')
  
  const assetCategories = ['Vehicles', 'Equipment', 'Buildings', 'IT Equipment', 'Furniture']
  
  const fixedAssets = await Promise.all(
    Array.from({ length: 25 }, (_, i) => {
      const purchaseCost = randomInt(50000, 500000)
      const usefulLife = randomInt(5, 20)
      const accumulatedDepreciation = purchaseCost * (Math.random() * 0.5)
      
      return prisma.fixedAsset.create({
        data: {
          assetNo: `FA-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
          description: `${randomElement(assetCategories)} - ${randomElement(['Prime Mover', 'Forklift', 'Warehouse', 'Server', 'Office'])} ${i + 1}`,
          category: randomElement(assetCategories),
          purchaseDate: randomDate(new Date(2020, 0, 1), new Date()),
          purchaseCost,
          depreciationMethod: 'STRAIGHT_LINE',
          usefulLifeYears: usefulLife,
          salvageValue: purchaseCost * 0.1,
          accumulatedDepreciation,
          netBookValue: purchaseCost - accumulatedDepreciation,
          location: randomElement(branches).name,
          status: randomElement(['ACTIVE', 'ACTIVE', 'ACTIVE', 'UNDER_MAINTENANCE']),
        },
      })
    })
  )
  console.log(`✅ Created ${fixedAssets.length} fixed assets`)

  // ============================================
  // YARD BLOCKS & SLOTS
  // ============================================
  console.log('Creating yard blocks and slots...')
  
  const yardBlocks = await Promise.all(
    ['A', 'B', 'C', 'D', 'E', 'F'].map((code) =>
      prisma.yardBlock.create({
        data: {
          code: `BLOCK-${code}`,
          name: `Block ${code}`,
          rows: 20,
          tiers: 5,
        },
      })
    )
  )

  // Create slots for each block
  for (const block of yardBlocks) {
    const slots = []
    for (let row = 1; row <= block.rows; row++) {
      for (let slot = 1; slot <= 10; slot++) {
        slots.push({
          blockId: block.id,
          row: String(row).padStart(2, '0'),
          slot: String(slot).padStart(2, '0'),
          tier: randomInt(0, block.tiers),
        })
      }
    }
    
    // Insert slots in batches
    for (let i = 0; i < slots.length; i += 100) {
      await prisma.yardSlot.createMany({
        data: slots.slice(i, i + 100),
        skipDuplicates: true,
      })
    }
  }
  console.log(`✅ Created ${yardBlocks.length} yard blocks with slots`)

  // ============================================
  // GATE PASSES
  // ============================================
  console.log('Creating gate passes...')
  
  const gatePasses = await Promise.all(
    Array.from({ length: 40 }, (_, i) =>
      prisma.gatePass.create({
        data: {
          passNo: `GP-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`,
          type: randomElement(['GATE_IN', 'GATE_OUT']),
          containerNo: `${randomElement(containerPrefixes)}${randomInt(1000000, 9999999)}`,
          size: randomElement(['20ft', '40ft']),
          haulierId: randomElement(vendors).id,
          truckRegNo: `W${randomElement(['X', 'Y', 'Z'])}${randomInt(1000, 9999)}`,
          driverName: randomElement(drivers.map(d => d.userId)),
          status: randomElement(['PENDING', 'APPROVED', 'USED', 'EXPIRED']),
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
          gateInAt: randomElement([null, new Date()]),
          gateOutAt: randomElement([null, null, new Date()]),
        },
      })
    )
  )
  console.log(`✅ Created ${gatePasses.length} gate passes`)

  // ============================================
  // DRIVER INCENTIVES
  // ============================================
  console.log('Creating driver incentives...')
  
  const incentives = await Promise.all(
    drivers.slice(0, 20).flatMap((driver) =>
      Array.from({ length: 3 }, (_, i) =>
        prisma.driverIncentive.create({
          data: {
            driverId: driver.id,
            period: `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`,
            amount: randomInt(200, 1500),
            formula: 'Base + Performance + Safety',
            isPaid: i < 2,
            paidDate: i < 2 ? randomDate(new Date(2024, 0, 1), new Date()) : null,
          },
        })
      )
    )
  )
  console.log(`✅ Created ${incentives.length} driver incentives`)

  // ============================================
  // MAINTENANCE RECORDS
  // ============================================
  console.log('Creating maintenance records...')
  
  const maintenanceRecords = await Promise.all(
    vehicles.slice(0, 20).flatMap((vehicle) =>
      Array.from({ length: randomInt(1, 4) }, (_, i) =>
        prisma.maintenanceRecord.create({
          data: {
            vehicleId: vehicle.id,
            type: randomElement(['PREVENTIVE', 'CORRECTIVE', 'PUSPAKOM', 'REGULATORY']),
            description: randomElement(['Oil change', 'Tire replacement', 'Brake inspection', 'Engine tune-up', 'Puspakom inspection']),
            cost: randomInt(100, 5000),
            workshopName: randomElement(['MMF Workshop', 'Authorized Service Center', 'External Workshop']),
            scheduledDate: randomDate(new Date(), new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)),
            completedDate: Math.random() > 0.3 ? new Date() : null,
            odometerReading: randomInt(10000, 500000),
          },
        })
      )
    )
  )
  console.log(`✅ Created ${maintenanceRecords.length} maintenance records`)

  // ============================================
  // JOURNAL ENTRIES
  // ============================================
  console.log('Creating journal entries...')
  
  const allAccounts = await prisma.account.findMany()
  
  const journalEntries = await Promise.all(
    Array.from({ length: 30 }, async (_, i) => {
      const total = randomInt(1000, 50000)
      
      const entry = await prisma.journalEntry.create({
        data: {
          entryNo: `JE-${new Date().getFullYear()}-${String(i + 1).padStart(5, '0')}`,
          date: randomDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), new Date()),
          reference: randomElement(['BANK', 'CASH', 'ADJ', 'CLOSING']),
          description: randomElement(['Monthly depreciation', 'Bank charges', 'Adjusting entry', 'Revenue recognition', 'Expense accrual']),
          totalDebit: total,
          totalCredit: total,
          status: randomElement(['DRAFT', 'POSTED']),
        },
      })

      // Create journal lines
      const debitAccount = randomElement(allAccounts.filter(a => a.type === 'ASSET' || a.type === 'EXPENSE'))
      const creditAccount = randomElement(allAccounts.filter(a => a.type === 'LIABILITY' || a.type === 'REVENUE' || a.type === 'EQUITY'))
      
      await prisma.journalLine.createMany({
        data: [
          { entryId: entry.id, accountId: debitAccount.id, description: entry.description, debit: total, credit: 0 },
          { entryId: entry.id, accountId: creditAccount.id, description: entry.description, debit: 0, credit: total },
        ],
      })

      return entry
    })
  )
  console.log(`✅ Created ${journalEntries.length} journal entries`)

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   - ${branches.length} branches`)
  console.log(`   - ${users.length} users`)
  console.log(`   - ${customers.length} customers`)
  console.log(`   - ${vendors.length} vendors/carriers`)
  console.log(`   - ${vehicles.length} vehicles`)
  console.log(`   - ${trailers.length} trailers`)
  console.log(`   - ${drivers.length} drivers`)
  console.log(`   - ${jobs.length} haulage jobs`)
  console.log(`   - ${shipments.length} shipments`)
  console.log(`   - ${containers.length} containers`)
  console.log(`   - ${warehouses.length} warehouses`)
  console.log(`   - ${inventory.length} inventory items`)
  console.log(`   - ${invoices.length} AR invoices`)
  console.log(`   - ${purchaseInvoices.length} AP invoices`)
  console.log(`   - ${accounts.length} chart of accounts`)
  console.log(`   - ${fixedAssets.length} fixed assets`)
  console.log(`   - ${yardBlocks.length} yard blocks`)
  console.log(`   - ${gatePasses.length} gate passes`)
  console.log(`   - ${incentives.length} driver incentives`)
  console.log(`   - ${maintenanceRecords.length} maintenance records`)
  console.log(`   - ${journalEntries.length} journal entries`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
