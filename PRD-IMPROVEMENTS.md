# TSH-2604 PRD Improvements Document

## Executive Summary

This document provides specific recommendations for evolving the TSH-2604 LogisticsPro Enterprise Suite PRD from a **tender compliance document** into a **living technical specification** that serves development teams, DevOps engineers, and stakeholders throughout the system lifecycle.

### Current State Assessment

| Aspect | Status | Gap Analysis |
|--------|--------|--------------|
| **Feature Coverage** | ✅ Complete | All 129 features documented |
| **Technical Detail** | ⚠️ Partial | Missing API specs, deployment details |
| **Implementation Mapping** | ❌ Missing | No linkage to actual codebase |
| **Operational Guidance** | ❌ Missing | No runbooks or troubleshooting guides |
| **Data Model** | ⚠️ Brief | Only high-level entity mentions |

### Actual Implementation Statistics

Based on codebase review:

| Metric | Count | Notes |
|--------|-------|-------|
| **Database Tables** | 35+ core tables | Prisma schema with 20+ enums |
| **API Endpoints** | 80+ REST endpoints | 20 route files, ~4-5 endpoints each |
| **Web Routes** | 30+ pages | 5 modules + dashboard, auth, API |
| **Frontend Components** | 50+ components | Dashboard, forms, tables, modals |
| **Docker Services** | 4 services | Web, API, PostgreSQL, Redis |
| **Enums/Types** | 40+ | Comprehensive type safety |

---

## Recommended PRD Improvements

### 1. Executive Summary Enhancement
**Priority: HIGH**

#### Current Gap
The Executive Summary provides business objectives but lacks implementation context and actual system metrics.

#### Suggested Additions

```markdown
### 1.5 Implementation Status Dashboard

| Module | Status | API Endpoints | DB Tables | UI Screens |
|--------|--------|---------------|-----------|------------|
| HMS | ✅ Complete | 15 | 8 | 6 |
| FFS | ✅ Complete | 12 | 5 | 5 |
| WMS | ✅ Complete | 14 | 6 | 5 |
| TMS | ✅ Complete | 12 | 5 | 4 |
| FMS | ✅ Complete | 27 | 11 | 10 |
| **TOTAL** | **✅ 100%** | **80+** | **35+** | **30+** |

### 1.6 Technology Stack Summary
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js 18, TypeScript
- **Database:** PostgreSQL 15, Prisma ORM
- **Cache:** Redis 7
- **Auth:** NextAuth.js with JWT
- **Deployment:** Docker, Docker Compose, Railway/Fly.io ready

### 1.7 Repository Structure
```
logisticspro/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Express API server
├── packages/
│   ├── database/         # Prisma schema & client
│   ├── types/            # Shared TypeScript types
│   └── auth/             # Authentication utilities
├── docker-compose.yml    # Local development stack
└── turbo.json           # Monorepo task runner
```
```

#### Rationale
- Provides immediate context for new developers joining the project
- Enables quick assessment of system scope and complexity
- Facilitates capacity planning and resource allocation

---

### 2. Architecture Section Expansion
**Priority: HIGH**

#### Current Gap
Section 2.3 mentions "Microservices-Based" architecture but the actual implementation uses a modular monolith pattern.

#### Suggested Additions

```markdown
### 2.4 Actual Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                           │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                         REVERSE PROXY                            │
│                      (NGINX / Traefik)                           │
│         • SSL Termination • Rate Limiting • Load Balancing      │
└──────────────────────┬──────────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   Next.js   │ │  Express    │ │   Static    │
│    (Web)    │ │   (API)     │ │   Assets    │
│   Port 3000 │ │  Port 3001  │ │    (CDN)    │
└──────┬──────┘ └──────┬──────┘ └─────────────┘
       │               │
       └───────────────┼───────────────────────┐
                       │                       │
                       ▼                       ▼
              ┌───────────────┐      ┌───────────────┐
              │   PostgreSQL  │      │     Redis     │
              │   (Primary)   │      │   (Cache/     │
              │    Port 5432  │      │    Session)   │
              └───────────────┘      │    Port 6379  │
                                     └───────────────┘
```

### 2.5 Architecture Pattern: Modular Monolith

The LogisticsPro implementation uses a **Modular Monolith** architecture:

| Aspect | Implementation |
|--------|----------------|
| **Code Organization** | Monorepo with module separation |
| **Database** | Single PostgreSQL instance with schema separation |
| **API** | Single Express server with route modules |
| **Frontend** | Next.js with route groups per module |
| **Deployment** | Containerized but not microservices |

#### Module Boundaries
- Each module (HMS, FFS, WMS, TMS, FMS) has:
  - Dedicated route files (`/api/{module}/*`)
  - Dedicated page routes (`/src/app/{module}/*`)
  - Dedicated database models in Prisma schema
  - Clear import boundaries enforced by ESLint

### 2.6 API Gateway Structure

| Route Prefix | Module | Purpose |
|--------------|--------|---------|
| `/api/health` | System | Health checks |
| `/api/jobs` | HMS | Haulage jobs |
| `/api/vehicles` | HMS | Fleet vehicles |
| `/api/drivers` | HMS | Driver management |
| `/api/shipments` | FFS | Freight shipments |
| `/api/containers` | FFS/TMS | Container tracking |
| `/api/customs-entries` | FFS | Customs declarations |
| `/api/warehouses` | WMS | Warehouse management |
| `/api/inventory` | WMS | Stock management |
| `/api/locations` | WMS | Warehouse locations |
| `/api/yard` | TMS | Terminal yard |
| `/api/gate-passes` | TMS | Gate operations |
| `/api/rail-operations` | TMS | Rail manifests |
| `/api/customers` | FMS | AR/Customer master |
| `/api/vendors` | FMS | AP/Vendor master |
| `/api/invoices` | FMS | Billing/e-Invoicing |
| `/api/payments` | FMS | Receipts/Payments |
| `/api/accounts` | FMS | GL Chart of Accounts |
| `/api/journal-entries` | FMS | GL Transactions |
| `/api/fixed-assets` | FMS | Asset register |
```

#### Rationale
- Aligns documentation with actual implementation
- Prevents architectural confusion for new developers
- Clarifies deployment and scaling strategies

---

### 3. Module Specifications - Implementation Mapping
**Priority: MEDIUM**

#### Current Gap
Features are documented but not cross-referenced with actual implementation paths.

#### Suggested Addition per Module

```markdown
### 3.1 HMS Implementation Reference

| Feature ID | Feature Name | API Endpoint | Web Route | DB Model |
|------------|--------------|--------------|-----------|----------|
| HMS-001 | Dashboard | GET /api/jobs/stats | /hms/dashboard | - |
| HMS-015 | Job Planning | GET/POST /api/jobs | /hms/jobs | HaulageJob |
| HMS-013 | Container Tracking | GET /api/jobs/:id | /hms/tracking | HaulageJob (gpsTracking) |
| HMS-016 | Trailer Monitoring | - | /hms/fleet | Trailer |
| HMS-017 | GPS Tracking | GET /api/jobs/:id | /hms/tracking | HaulageJob |
| HMS-018 | Driver Incentive | GET /api/drivers/:id/incentives | /hms/drivers | DriverIncentive |

#### HMS Database Models
- `Vehicle` - Fleet vehicle registry
- `Driver` - Driver profiles and licenses
- `Trailer` - Trailer registry
- `HaulageJob` - Job assignments and tracking
- `MaintenanceRecord` - Vehicle maintenance history
- `DriverIncentive` - Incentive calculations
```

Repeat this pattern for FFS, WMS, TMS, and FMS.

#### Rationale
- Enables traceability from requirements to code
- Accelerates onboarding for new developers
- Simplifies impact analysis for changes

---

### 4. API Specifications Section
**Priority: HIGH**

#### Current Gap
No dedicated API documentation exists in the PRD.

#### Suggested New Section

```markdown
## API Specifications

### 4.1 API Standards

| Standard | Implementation |
|----------|----------------|
| **Protocol** | RESTful HTTP |
| **Format** | JSON |
| **Auth** | Bearer JWT |
| **Versioning** | URL path (/api/v1/...) |
| **Pagination** | Offset-based (limit/offset) |
| **Error Format** | RFC 7807 Problem Details |

### 4.2 Common Response Patterns

#### Success Response
```json
{
  "id": "clj123abc...",
  "createdAt": "2026-02-01T10:30:00Z",
  "updatedAt": "2026-02-01T10:30:00Z",
  ...
}
```

#### Error Response
```json
{
  "error": "Invoice not found",
  "code": "NOT_FOUND",
  "status": 404,
  "path": "/api/invoices/invalid-id"
}
```

### 4.3 Core Endpoints Reference

#### Jobs (HMS)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/jobs | List all jobs | ✓ |
| POST | /api/jobs | Create job | ✓ |
| GET | /api/jobs/:id | Get job details | ✓ |
| PATCH | /api/jobs/:id | Update job | ✓ |
| DELETE | /api/jobs/:id | Delete job | Admin |

#### Shipments (FFS)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/shipments | List shipments | ✓ |
| POST | /api/shipments | Create shipment | ✓ |
| GET | /api/shipments/:id | Get shipment | ✓ |
| PATCH | /api/shipments/:id | Update shipment | ✓ |

#### Inventory (WMS)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/inventory | List inventory | ✓ |
| POST | /api/inventory | Create stock | ✓ |
| POST | /api/inventory/:id/movements | Record movement | ✓ |
| GET | /api/inventory/:id/movements | Get history | ✓ |

#### Gate Passes (TMS)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/gate-passes | List passes | ✓ |
| POST | /api/gate-passes | Create pass | ✓ |
| POST | /api/gate-passes/:id/approve | Approve pass | ✓ |
| POST | /api/gate-passes/:id/gate-in | Record gate-in | ✓ |
| POST | /api/gate-passes/:id/gate-out | Record gate-out | ✓ |

#### Invoices (FMS)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/invoices | List invoices | ✓ |
| POST | /api/invoices | Create invoice | ✓ |
| GET | /api/invoices/:id | Get invoice | ✓ |
| POST | /api/invoices/:id/submit-einvoice | IRBM submission | ✓ |
| POST | /api/invoices/:id/payments | Record payment | ✓ |

### 4.4 Query Parameters Reference

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Full-text search | `?search=ABC123` |
| `status` | enum | Filter by status | `?status=PENDING` |
| `limit` | number | Page size (max 100) | `?limit=50` |
| `offset` | number | Pagination offset | `?offset=100` |
| `from` | date | Start date filter | `?from=2026-01-01` |
| `to` | date | End date filter | `?to=2026-02-01` |
| `branchId` | string | Branch filter | `?branchId=clj123...` |
```

#### Rationale
- Essential for frontend-backend integration
- Enables third-party integration planning
- Reduces tribal knowledge dependency

---

### 5. Data Model Documentation
**Priority: MEDIUM**

#### Current Gap
Only high-level entity relationships are mentioned.

#### Suggested Additions

```markdown
## 5. Data Model Reference

### 5.1 Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CORE ENTITIES                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Branch     │──────│    User      │      │   AuditLog   │  │
│  │  (6 records) │      │ (200+ users) │      │ (immutable)  │  │
│  └──────┬───────┘      └──────────────┘      └──────────────┘  │
│         │                                                       │
│  ┌──────┴───────┐      ┌──────────────┐      ┌──────────────┐  │
│  │   Customer   │      │    Vendor    │      │   Document   │  │
│  │  (parties)   │      │  (parties)   │      │ (attachments)│  │
│  └──────────────┘      └──────────────┘      └──────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     MODULE ENTITIES                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HMS:           FFS:           WMS:          TMS:              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐  ┌──────────┐     │
│  │ Vehicle  │   │ Shipment │   │ Warehouse│  │ YardBlock│     │
│  │ Driver   │   │ Container│   │ Location │  │ YardSlot │     │
│  │ Trailer  │   │ Customs  │   │ Inventory│  │ GatePass │     │
│  │HaulageJob│   │ Entry    │   │ Movement │  │          │     │
│  └──────────┘   └──────────┘   └──────────┘  └──────────┘     │
│                                                                 │
│  FMS:                                                          │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐  ┌──────────┐     │
│  │ Invoice  │   │ Payment  │   │  Account │  │FixedAsset│     │
│  │InvoiceItem│  │          │   │JournalEntry│ │          │     │
│  └──────────┘   └──────────┘   └──────────┘  └──────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Prisma Schema Reference

#### Core Tables
| Model | Purpose | Key Fields |
|-------|---------|------------|
| `Branch` | Multi-tenancy | code, type, isActive |
| `User` | Authentication | email, role, mfaEnabled |
| `Session` | Token storage | sessionToken, expires |
| `AuditLog` | Compliance | action, oldValues, newValues |

#### HMS Tables
| Model | Purpose | Relationships |
|-------|---------|---------------|
| `Vehicle` | Fleet registry | Branch, HaulageJob, Maintenance |
| `Driver` | Driver profiles | User, HaulageJob, DriverIncentive |
| `Trailer` | Trailer registry | HaulageJob |
| `HaulageJob` | Job tracking | Vehicle, Driver, Trailer, Customer |
| `MaintenanceRecord` | Service history | Vehicle |
| `DriverIncentive` | Payroll | Driver |

#### FFS Tables
| Model | Purpose | Relationships |
|-------|---------|---------------|
| `Shipment` | Freight orders | Shipper, Consignee, Carrier |
| `Container` | Container details | Shipment |
| `CustomsEntry` | Customs declarations | Shipment |
| `Document` | File attachments | Shipment |

#### WMS Tables
| Model | Purpose | Relationships |
|-------|---------|---------------|
| `Warehouse` | Facility master | Branch, Locations |
| `WarehouseLocation` | Bin/rack locations | Warehouse, Inventory |
| `Inventory` | Stock records | Warehouse, Location, Movements |
| `InventoryMovement` | Transaction log | Inventory |

#### TMS Tables
| Model | Purpose | Relationships |
|-------|---------|---------------|
| `YardBlock` | Terminal layout | YardSlots |
| `YardSlot` | Container positions | YardBlock |
| `GatePass` | Gate operations | Vendor |

#### FMS Tables
| Model | Purpose | Relationships |
|-------|---------|---------------|
| `Customer` | AR master | Branch, Invoices, Shipments |
| `Vendor` | AP master | Branch, Bills, Shipments |
| `Invoice` | Billing | Customer/Vendor, Items, Payments |
| `InvoiceItem` | Line items | Invoice |
| `Payment` | Receipts | Invoice |
| `Account` | GL accounts | JournalLines |
| `JournalEntry` | GL transactions | JournalLines |
| `JournalLine` | Entry details | JournalEntry, Account |
| `FixedAsset` | Asset register | - |

### 5.3 Enum Reference

| Enum | Values | Usage |
|------|--------|-------|
| `UserRole` | SUPER_ADMIN, BRANCH_ADMIN, MANAGER, SUPERVISOR, OPERATOR, READ_ONLY, DRIVER | RBAC |
| `HaulageJobStatus` | PENDING, ASSIGNED, DISPATCHED, AT_PICKUP, LOADED, IN_TRANSIT, AT_DELIVERY, DELIVERED, COMPLETED, CANCELLED | Job tracking |
| `ShipmentStatus` | BOOKED, CONFIRMED, IN_TRANSIT, ARRIVED, CUSTOMS_HOLD, CLEARED, DELIVERED, COMPLETED, CANCELLED | Freight tracking |
| `InvoiceStatus` | DRAFT, SENT, PARTIAL, PAID, OVERDUE, VOID, CANCELLED | Billing |
| `EInvoiceStatus` | PENDING, VALIDATED, REJECTED, CANCELLED | IRBM compliance |
| `AccountType` | ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE | Chart of accounts |
| `MovementType` | RECEIPT, ISSUE, TRANSFER_IN, TRANSFER_OUT, ADJUSTMENT, RETURN | Inventory |
```

#### Rationale
- Critical for database migrations and reporting
- Essential for integration planning
- Prevents confusion about data relationships

---

### 6. Security Section Enhancement
**Priority: HIGH**

#### Current Gap
RBAC is mentioned but implementation details are missing.

#### Suggested Additions

```markdown
### 5.6 RBAC Implementation Details

#### Role Hierarchy

```
SUPER_ADMIN
    └── BRANCH_ADMIN
            ├── MANAGER
            │       ├── SUPERVISOR
            │       │       └── OPERATOR
            │       └── READ_ONLY
            └── DRIVER (limited HMS access)
```

#### Permission System

Permissions are stored as string array in `User.permissions`:

| Permission | Scope | Description |
|------------|-------|-------------|
| `jobs:create` | HMS | Create haulage jobs |
| `jobs:assign` | HMS | Assign drivers/vehicles |
| `jobs:cancel` | HMS | Cancel jobs |
| `shipments:create` | FFS | Create freight bookings |
| `shipments:clearance` | FFS | Process customs |
| `inventory:adjust` | WMS | Stock adjustments |
| `gate:approve` | TMS | Approve gate passes |
| `invoices:create` | FMS | Create invoices |
| `invoices:einvoice` | FMS | Submit to IRBM |
| `payments:apply` | FMS | Apply receipts |
| `journals:post` | FMS | Post journal entries |
| `reports:view` | All | View reports |
| `admin:users` | System | User management |
| `admin:branches` | System | Branch management |

#### Permission Assignment by Role

| Role | Default Permissions |
|------|---------------------|
| SUPER_ADMIN | `*` (all permissions) |
| BRANCH_ADMIN | All for assigned branch |
| MANAGER | Full module access |
| SUPERVISOR | Read + limited write |
| OPERATOR | Write own records |
| READ_ONLY | View only |
| DRIVER | View own jobs only |

#### MFA Implementation

```typescript
// Pseudocode from actual implementation
if (user.mfaEnabled) {
  const token = verifyTOTP(user.mfaSecret, input.code);
  if (!token.valid) {
    return { error: 'Invalid MFA code' };
  }
}
```

- TOTP-based using authenticator apps
- Fallback recovery codes
- Enforced for privileged roles
```

#### Rationale
- Security audit compliance
- Clear access control expectations
- Enables security testing scenarios

---

### 7. Integration Section Enhancement
**Priority: MEDIUM**

#### Current Gap
API Gateway architecture is described but not mapped to actual implementation.

#### Suggested Additions

```markdown
### 4.4 API Gateway Implementation

The system uses Express.js middleware as the API gateway layer:

```
┌──────────────────────────────────────────────────────────────┐
│                    EXPRESS GATEWAY                          │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Security Layer (Helmet.js)                               │
│     ├── HTTP headers security                                │
│     ├── XSS protection                                       │
│     └── CSP policies                                         │
│                                                               │
│  2. CORS Layer                                                │
│     ├── Whitelist origins                                    │
│     └── Credentials support                                  │
│                                                               │
│  3. Auth Middleware (JWT)                                    │
│     ├── Token validation                                     │
│     ├── Role checking                                        │
│     └── Permission verification                              │
│                                                               │
│  4. Request Logging (Morgan)                                 │
│     ├── Access logs                                          │
│     └── Error tracking                                       │
│                                                               │
│  5. Rate Limiting (express-rate-limit)                       │
│     ├── 100 req/min per IP                                   │
│     └── Burst handling                                       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 4.5 External Integration Endpoints

| External System | Status | Integration Point | Protocol |
|-----------------|--------|-------------------|----------|
| IRBM MyInvois | ✅ Ready | POST /api/invoices/:id/submit-einvoice | REST API |
| Port Klang PCS | 🔄 Planned | - | REST API |
| KTMB Rail | 🔄 Planned | POST /api/rail-operations/import | EDI/API |
| uCustoms | 🔄 Planned | CustomsEntry model | REST API |
| JPJ | 🔄 Planned | Vehicle model | SOAP/REST |

### 4.6 Webhook Support

| Event | Webhook Payload | Destination |
|-------|-----------------|-------------|
| Job Completed | `{ jobId, status, timestamp }` | Configurable |
| Invoice Created | `{ invoiceId, total, customerId }` | Configurable |
| Shipment Arrived | `{ shipmentId, containerNo, eta }` | Configurable |
| Payment Received | `{ invoiceId, amount, method }` | Configurable |
```

#### Rationale
- Clarifies actual vs planned integrations
- Enables integration testing planning
- Documents webhook capabilities

---

### 8. Testing Strategy Section
**Priority: MEDIUM**

#### Current Gap
No testing approach is documented.

#### Suggested New Section

```markdown
## Testing Strategy

### 8.1 Testing Pyramid

```
                    ┌─────────────┐
                    │   E2E       │  (Cypress/Playwright)
                    │  ~20 tests  │  User flows across modules
                    └──────┬──────┘
                   ┌───────────────┐
                   │  Integration  │  (Jest + Supertest)
                   │   ~50 tests   │  API endpoint testing
                   └───────┬───────┘
              ┌───────────────────────┐
              │        Unit           │  (Jest)
              │      ~200 tests       │  Service/util functions
              └───────────────────────┘
```

### 8.2 Test Categories

| Category | Tools | Coverage Target | Priority |
|----------|-------|-----------------|----------|
| Unit Tests | Jest | 80%+ | P0 |
| API Tests | Jest + Supertest | All endpoints | P0 |
| E2E Tests | Cypress | Critical flows | P1 |
| Load Tests | k6/Artillery | 100 concurrent | P1 |
| Security Tests | OWASP ZAP | VAPT compliance | P0 |

### 8.3 Critical Test Scenarios

#### HMS
- [ ] Job creation to completion workflow
- [ ] Driver assignment with conflict detection
- [ ] GPS tracking data storage
- [ ] Driver incentive calculation

#### FFS
- [ ] Shipment booking with container allocation
- [ ] Customs entry submission
- [ ] Multi-modal tracking
- [ ] Document upload and retrieval

#### WMS
- [ ] Goods receipt with location assignment
- [ ] Pick list generation
- [ ] Inventory movement tracking
- [ ] Cycle count reconciliation

#### TMS
- [ ] Container yard put-away
- [ ] Gate pass approval workflow
- [ ] Rail manifest import
- [ ] APAD compliance checks

#### FMS
- [ ] Invoice generation with e-invoice submission
- [ ] Three-way matching for AP
- [ ] Journal entry posting
- [ ] Fixed asset depreciation

### 8.4 Test Data Strategy

| Environment | Data Source | Refresh Frequency |
|-------------|-------------|-------------------|
| Development | Synthetic (faker.js) | Per test run |
| Testing | Anonymized production | Weekly |
| Staging | Production snapshot | Monthly |

### 8.5 CI/CD Test Execution

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Unit Tests
        run: npm run test:unit
      
      - name: API Integration Tests
        run: npm run test:api
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
      
      - name: E2E Tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000
```
```

#### Rationale
- Establishes quality expectations
- Defines regression testing scope
- Enables test automation planning

---

### 9. Deployment Guide Section
**Priority: HIGH**

#### Current Gap
Only high-level deployment model is described, no operational details.

#### Suggested New Section

```markdown
## Deployment Guide

### 9.1 Local Development Setup

#### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15 (or use Docker)
- Redis 7 (or use Docker)

#### Quick Start
```bash
# Clone repository
git clone <repo-url>
cd logisticspro

# Install dependencies
npm install

# Setup environment
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# Start infrastructure
docker-compose up -d postgres redis

# Database setup
npx prisma migrate dev
npx prisma db seed

# Start development
npm run dev
```

### 9.2 Docker Deployment

#### Production Docker Compose
```yaml
version: '3.8'
services:
  web:
    image: logisticspro/web:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  api:
    image: logisticspro/api:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - web
      - api
    restart: unless-stopped
```

### 9.3 Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Deploy services
railway up

# Add PostgreSQL and Redis
railway add --database postgres
railway add --database redis

# Configure environment variables
railway variables set NODE_ENV=production
railway variables set DATABASE_URL="${{Postgres.DATABASE_URL}}"
```

### 9.4 Environment Variables Reference

| Variable | Service | Required | Description |
|----------|---------|----------|-------------|
| `DATABASE_URL` | All | ✓ | PostgreSQL connection string |
| `REDIS_URL` | All | ✓ | Redis connection string |
| `NEXTAUTH_SECRET` | Web | ✓ | NextAuth encryption key |
| `NEXTAUTH_URL` | Web | ✓ | Base URL for callbacks |
| `JWT_SECRET` | API | ✓ | JWT signing secret |
| `PORT` | API | - | API server port (default: 3001) |
| `NODE_ENV` | All | ✓ | environment: development/production |

### 9.5 Database Migration Strategy

```bash
# Create migration
npx prisma migrate dev --name add_new_field

# Apply to production
npx prisma migrate deploy

# Generate client after changes
npx prisma generate

# Backup before migration
docker exec postgres pg_dump -U postgres logisticspro > backup.sql
```

### 9.6 Health Checks & Monitoring

#### Health Check Endpoints
| Endpoint | Service | Expected Response |
|----------|---------|-------------------|
| GET /api/health | API | `{"status":"ok"}` |
| GET /api/health/db | API | Database connectivity |
| GET /api/health/redis | API | Redis connectivity |

#### Key Metrics to Monitor
- Request latency (p50, p95, p99)
- Error rate (target: <0.1%)
- Database connection pool usage
- Redis memory usage
- Container restart count

### 9.7 Backup & Recovery

#### Automated Backups
```bash
# Daily database backup
0 2 * * * docker exec postgres pg_dump -U postgres logisticspro | gzip > /backups/logisticspro-$(date +%Y%m%d).sql.gz

# Redis persistence
# Using AOF (Append Only File) + RDB snapshots
```

#### Recovery Procedures
```bash
# Database restore
gunzip < backup.sql.gz | docker exec -i postgres psql -U postgres logisticspro

# Point-in-time recovery
# Using WAL archiving (if configured)
```

| Metric | Target | Implementation |
|--------|--------|----------------|
| RTO | < 4 hours | Hot standby in secondary AZ |
| RPO | < 1 hour | Continuous replication |
| Backup Retention | 30 days | Automated with verification |
```

#### Rationale
- Enables reproducible deployments
- Reduces deployment time and errors
- Supports disaster recovery planning

---

### 10. Appendix Enhancement
**Priority: LOW**

#### Current Gap
Appendix A only contains feature counts.

#### Suggested Additions

```markdown
## Appendix B: API Endpoint Reference

### B.1 Complete Endpoint List

| # | Method | Endpoint | Module | Auth |
|---|--------|----------|--------|------|
| 1 | GET | /api/health | System | No |
| 2 | GET | /api/jobs | HMS | Yes |
| 3 | POST | /api/jobs | HMS | Yes |
| 4 | GET | /api/jobs/:id | HMS | Yes |
| 5 | PATCH | /api/jobs/:id | HMS | Yes |
| 6 | DELETE | /api/jobs/:id | HMS | Admin |
| 7 | GET | /api/vehicles | HMS | Yes |
| 8 | POST | /api/vehicles | HMS | Yes |
| 9 | GET | /api/vehicles/:id | HMS | Yes |
| 10 | PATCH | /api/vehicles/:id | HMS | Yes |
| ... | ... | ... | ... | ... |
| 80+ | | | | |

## Appendix C: Database Schema Reference

### C.1 Table Size Estimates

| Table | Estimated Rows | Growth Rate |
|-------|----------------|-------------|
| audit_logs | 1M+/year | High |
| haulage_jobs | 100K/year | Medium |
| shipments | 50K/year | Medium |
| inventory_movements | 500K/year | High |
| invoices | 200K/year | Medium |
| journal_lines | 1M+/year | High |

### C.2 Index Strategy

```sql
-- High-traffic indexes
CREATE INDEX idx_jobs_status ON haulage_jobs(status);
CREATE INDEX idx_jobs_driver ON haulage_jobs(driverId);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_audit_created ON audit_logs(createdAt);
```

## Appendix D: Troubleshooting Guide

### D.1 Common Issues

| Symptom | Cause | Solution |
|---------|-------|----------|
| Database connection errors | Connection pool exhausted | Increase `connection_limit` in Prisma |
| Slow invoice queries | Missing indexes | Run `CREATE INDEX` on invoice_status |
| E-invoice submission fails | IRBM API unavailable | Implement retry with exponential backoff |
| Redis timeout | Memory pressure | Increase Redis memory or enable eviction |
| Prisma client errors | Schema drift | Run `npx prisma generate` |

### D.2 Debug Commands

```bash
# Check database connections
docker exec postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"

# Check Redis memory
docker exec redis redis-cli info memory

# View API logs
docker logs logisticspro-api -f

# Prisma debug mode
DEBUG=prisma:* npm run dev
```

## Appendix E: Glossary

| Term | Definition |
|------|------------|
| HMS | Haulage Management System |
| FFS | Freight Forwarding System |
| WMS | Warehouse Management System |
| TMS | Terminal Management System |
| FMS | Finance Management System |
| IRBM | Inland Revenue Board of Malaysia |
| EDI | Electronic Data Interchange |
| KTMB | Keretapi Tanah Melayu Berhad |
| PCS | Port Community System |
| APAD | Land Public Transport Agency |
```

#### Rationale
- Quick reference for developers
- Reduces time spent searching for information
- Standardizes terminology

---

## Implementation Priority Matrix

| Improvement | Priority | Effort | Impact | Timeline |
|-------------|----------|--------|--------|----------|
| 1. Executive Summary Stats | High | Low | High | Week 1 |
| 2. Architecture Section | High | Medium | High | Week 1-2 |
| 4. API Specifications | High | High | High | Week 2-3 |
| 6. Security Enhancement | High | Medium | High | Week 2 |
| 9. Deployment Guide | High | High | Medium | Week 3-4 |
| 5. Data Model Reference | Medium | Medium | Medium | Week 3 |
| 7. Integration Section | Medium | Low | Medium | Week 2 |
| 8. Testing Strategy | Medium | Medium | Medium | Week 3-4 |
| 3. Module Mapping | Medium | High | Medium | Week 4 |
| 10. Appendix Enhancement | Low | Medium | Low | Week 4-5 |

---

## Conclusion

These improvements transform the TSH-2604 PRD from a **tender response document** into a **living technical specification** that:

1. **Accelerates onboarding** - New developers can understand the system in hours, not days
2. **Reduces tribal knowledge** - Implementation details are documented, not just in code
3. **Enables maintenance** - Troubleshooting guides and operational procedures are clear
4. **Supports scaling** - Architecture and deployment patterns are documented for growth
5. **Ensures compliance** - Security and audit requirements are mapped to implementation

The PRD should be version-controlled alongside the codebase and updated with each significant change to maintain its value as a reference document.

---

*Document generated based on codebase review of TSH-2604 LogisticsPro Enterprise Suite*
*Date: February 2026*
