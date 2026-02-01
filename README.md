# LogisticsPro Enterprise Suite

## TSH-2604: Business Operating & Finance IT System

**Client:** Multimodal Freight Sdn Bhd (MMF)

A comprehensive 5-module integrated logistics platform covering Haulage, Forwarding, Warehouse, Terminal, and Finance operations.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Installation

1. **Clone and install dependencies:**
```bash
cd /home/sarah/clawd/prototype/TSH-2604
npm install
```

2. **Set up environment variables:**
```bash
cp packages/database/.env.example packages/database/.env
cp apps/web/.env.example apps/web/.env
```

3. **Start PostgreSQL (using Docker):**
```bash
docker-compose up -d postgres redis
```

4. **Set up the database:**
```bash
cd packages/database
npx prisma migrate dev
npx prisma db seed
```

5. **Run the development server:**
```bash
cd apps/web
npm run dev
```

6. **Access the application:**
- URL: http://localhost:3000
- Default login: `admin@mmf.com.my` / `admin123`

---

## 📁 Project Structure

```
/home/sarah/clawd/prototype/TSH-2604/
├── apps/
│   ├── web/                    # Next.js 14 web application
│   └── api/                    # API server (if needed separately)
├── packages/
│   ├── database/               # Prisma ORM + PostgreSQL schema
│   ├── types/                  # Shared TypeScript types
│   └── auth/                   # Authentication package
├── modules/
│   ├── hms/                    # Haulage Management System
│   ├── ffs/                    # Forwarding Management System
│   ├── wms/                    # Warehouse Management System
│   ├── tms/                    # Terminal Management System
│   └── fms/                    # Finance Management System
├── docker-compose.yml          # Docker orchestration
└── README.md                   # This file
```

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL 15, Prisma ORM |
| **Auth** | NextAuth.js, bcryptjs |
| **Cache** | Redis |
| **Deployment** | Docker, Docker Compose |

---

## 📦 Modules

### 1. HMS - Haulage Management System
- Fleet Management (Vehicles, Trailers)
- Driver Management
- Job Planning & Assignment
- GPS Tracking integration
- Driver Incentive Calculation

### 2. FFS - Forwarding Management System
- Shipment Booking
- Container Management
- Customs Clearance
- Multi-modal Transport

### 3. WMS - Warehouse Management System
- Inventory Control
- Location Management
- Inbound/Outbound Operations
- Cycle Counting

### 4. TMS - Terminal Management System
- Yard Management
- Gate Operations
- Container Tracking
- Rail Operations

### 5. FMS - Finance Management System
- AR/AP Management
- IRBM e-Invoicing Ready
- General Ledger
- Fixed Assets

---

## 🔐 Authentication & Security

- Role-Based Access Control (RBAC)
- 7 User Roles: Super Admin, Branch Admin, Manager, Supervisor, Operator, Read-Only, Driver
- Account lockout after 5 failed attempts
- Audit logging for all actions
- Password hashing with bcrypt

---

## 🗄️ Database Schema

The database includes 40+ tables:

**Core:** Branch, User, Session, AuditLog

**HMS:** Vehicle, Driver, Trailer, HaulageJob, MaintenanceRecord, DriverIncentive

**FFS:** Shipment, Container, CustomsEntry

**WMS:** Warehouse, WarehouseLocation, Inventory, InventoryMovement

**TMS:** YardBlock, YardSlot, GatePass

**FMS:** Customer, Vendor, Invoice, Payment, Account, JournalEntry, FixedAsset

---

## 🐳 Docker Deployment

### Development
```bash
docker-compose up -d
```

### Production
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 📝 Environment Variables

### packages/database/.env
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/logisticspro?schema=public"
```

### apps/web/.env
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/logisticspro?schema=public"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
REDIS_URL="redis://localhost:6379"
```

---

## 🧪 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build all applications |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed database with sample data |

---

## 📊 Features Implemented (Phase 1)

### ✅ Completed

1. **Monorepo Structure** - Turborepo with workspaces
2. **Database Schema** - 40+ tables, all 5 modules
3. **Authentication System** - NextAuth.js, RBAC
4. **HMS Core** - Jobs, Fleet, Drivers, Tracking pages
5. **Dashboard Framework** - Real-time stats, recent activity
6. **UI Components** - Tailwind CSS, responsive design
7. **Docker Setup** - Full containerization

### 🚧 In Progress / Planned

- Mobile-responsive optimization
- GPS tracking integration (Geotab/Wialon)
- IRBM e-Invoicing API integration
- FFS, WMS, TMS, FMS module pages
- API endpoints for all modules
- Reporting engine
- Audit trail UI

---

## 📄 License

Private - Multimodal Freight Sdn Bhd

---

## 👥 Team

**Lead Developer:** AI Assistant
**Client:** Multimodal Freight Sdn Bhd (MMF)
**Project:** TSH-2604
