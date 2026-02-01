# TSH-2604 Demo Script
## LogisticsPro Enterprise Suite - Demo Guide

**Duration:** 15-20 minutes  
**Login:** admin@mmf.com.my / admin123  
**URL:** http://localhost:3000 (or deployed URL)

---

## Pre-Demo Setup

1. Ensure Docker services are running:
   ```bash
   docker-compose up -d
   ```

2. Verify demo data is loaded:
   - 100+ jobs
   - 100+ shipments
   - 500+ inventory items
   - 50+ invoices (mix of statuses)
   - Realistic customers (some with credit blocks)

3. Open browser in incognito mode

---

## Demo Flow (15-20 Minutes)

### 1. Dashboard Overview (2 minutes)

**Talking Points:**
- Welcome to LogisticsPro Enterprise Suite
- 5 integrated modules: HMS, FFS, WMS, TMS, FMS
- Real-time operational visibility
- Modular monolith architecture (not microservices)

**Actions:**
1. Login with admin credentials
2. Show main dashboard with KPI cards:
   - Total Active Jobs
   - Pending Shipments
   - Low Stock Alerts
   - Outstanding Invoices
3. Quick Actions panel for fast navigation
4. Recent Activity feed

**Key Features to Highlight:**
- Role-based access control
- Real-time data from PostgreSQL
- Responsive design (works on tablet/mobile)

---

### 2. HMS - Haulage Management System (3 minutes)

**Talking Points:**
- Fleet management for Port Klang operations
- GPS tracking integration
- Driver incentive calculations
- Trailer maintenance alerts

**Actions:**
1. Click "HMS" → Dashboard
2. **GPS Tracking:**
   - Navigate to `/hms/tracking/map`
   - Show live vehicle positions on map
   - Historical route playback
   - Geofence boundaries

3. **Driver Incentives:**
   - Navigate to `/hms/drivers/incentives`
   - Show monthly incentive calculations
   - Breakdown: trips, distance, special allowances

4. **Trailer Alerts:**
   - Navigate to `/hms/fleet`
   - Show TrailerAlerts component
   - Highlight trailers with expiring permits/PUSPAKOM

5. **Job Creation:**
   - Click "Create Job"
   - Fill form with demo data
   - Assign driver and vehicle
   - Save and show job list

**Key Features:**
- Real-time GPS tracking
- Automated incentive calculations
- Proactive maintenance alerts
- Complete job lifecycle management

---

### 3. FFS - Freight Forwarding System (3 minutes)

**Talking Points:**
- Multi-modal freight management
- Container tracking
- Freight rate management
- Tender management

**Actions:**
1. Click "FFS" → Dashboard
2. **Create Shipment:**
   - Click "New Shipment"
   - Enter BL number, ports, cargo details
   - Add container details
   - Link to customer

3. **Freight Rate Calculator:**
   - Navigate to `/ffs/rates/calculator`
   - Enter origin/destination
   - Compare rates by carrier
   - Show rate history chart

4. **Tender Management:**
   - Navigate to `/ffs/tenders`
   - Show tender list with status
   - Click analytics tab
   - Show win/loss rates
   - Tender pipeline value

5. **Document Viewer:**
   - Open shipment detail
   - Show linked documents
   - Preview BL/AWB documents
   - Document approval workflow

**Key Features:**
- Multi-modal tracking (sea/air/land)
- Dynamic freight rate calculations
- Tender pipeline management
- Integrated document management

---

### 4. WMS - Warehouse Management System (3 minutes)

**Talking Points:**
- Inventory management with barcode/RFID
- Picking and packing optimization
- Cycle counting
- Returns processing

**Actions:**
1. Click "WMS" → Dashboard
2. **Inventory Overview:**
   - Show stock levels by warehouse
   - Low stock warnings
   - Space utilization

3. **Barcode Scanning:**
   - Navigate to `/wms/scan`
   - Demo barcode scanner interface
   - Scan to receive goods
   - Scan to pick items

4. **Picking Workflow:**
   - Navigate to `/wms/picking`
   - Show pick list generation
   - Wave picking interface
   - Pick completion tracking

5. **Packing:**
   - Navigate to `/wms/packing`
   - Cartonization engine
   - Packing list generation
   - Shipping label printing

6. **Returns (RMA):**
   - Navigate to `/wms/returns`
   - Create return authorization
   - Inspection workflow
   - Restock or dispose decision

**Key Features:**
- Barcode/RFID integration
- Optimized pick paths
- Real-time inventory tracking
- Complete returns management

---

### 5. TMS - Terminal Management System (2 minutes)

**Talking Points:**
- Container yard management
- Gate operations
- APAD compliance
- Rail integration

**Actions:**
1. Click "TMS" → Dashboard
2. **Yard Management:**
   - Navigate to `/tms/yard`
   - Visual yard map with blocks/slots
   - Color-coded container positions
   - Container hover details
   - Yard utilization percentage

3. **Gate Operations:**
   - Show gate pass creation
   - Gate-in/gate-out tracking
   - Weighbridge integration

4. **M&R Tracking:**
   - Navigate to `/tms/maintenance`
   - Damage inspection records
   - Repair cost tracking
   - Insurance claim documentation

5. **APAD Compliance:**
   - Navigate to `/tms/apad`
   - Pre-arrival booking display
   - TAT (Turnaround Time) tracking
   - Compliance status indicator

6. **Rail Operations:**
   - Navigate to `/tms/rail/schedule`
   - KTMB manifest import
   - Rail container tracking

**Key Features:**
- Visual yard management
- APAD regulatory compliance
- Integrated M&R tracking
- Multi-modal rail support

---

### 6. FMS - Finance Management System (4 minutes)

**Talking Points:**
- Complete accounting suite
- IRBM e-invoicing integration
- Credit control automation
- Financial reporting

**Actions:**
1. Click "FMS" → Dashboard
2. **Credit Control Demo (HIGHLIGHT):**
   - Navigate to `/fms/credit-control`
   - Show blocked customers list
   - Explain: "System automatically blocks overdue accounts"
   - Try to create invoice for blocked customer
   - **Show blocking message:** "Customer blocked due to overdue payments"

3. **Invoice Creation:**
   - Click "Create Invoice"
   - Select customer (good standing)
   - Add line items
   - Calculate totals with tax

4. **e-Invoice (IRBM Integration):**
   - Navigate to invoice preview `/fms/invoices/[id]/preview`
   - Show PDF preview
   - Click "Submit to IRBM"
   - Show validation status
   - Display IRBM UUID

5. **Financial Reports:**
   - Navigate to `/reports/financial/profit-loss`
   - Show P&L with charts
   - Date range filter
   - Export to CSV

   - Navigate to `/reports/financial/balance-sheet`
   - Assets, Liabilities, Equity breakdown

   - Navigate to `/reports/financial/cash-flow`
   - Operating/Investing/Financing activities

6. **Budget vs Actual:**
   - Navigate to `/reports/financial/budget-vs-actual`
   - Show variance analysis
   - Department-level budgets
   - Visual variance indicators

7. **GST/SST Reports:**
   - Navigate to `/reports/financial/tax/gst-03`
   - GST-03 form generation
   - Input/output tax summary

**Key Features:**
- Automated credit control enforcement
- IRBM MyInvois integration
- Real-time financial reporting
- Budget variance analysis
- Tax compliance (GST/SST)

---

### 7. Reports & Documents (2 minutes)

**Talking Points:**
- Comprehensive reporting across all modules
- Document management with version control
- Audit trail for compliance

**Actions:**
1. **Reports Hub:**
   - Navigate to `/reports`
   - Show report categories
   - Financial, Fleet, Freight, Audit

2. **Fleet Reports:**
   - Vehicle utilization
   - Driver performance
   - Fuel efficiency

3. **Document Management:**
   - Navigate to `/documents`
   - Upload new document
   - Tag and categorize
   - Preview uploaded document
   - Show linked transactions

4. **Audit Trail:**
   - Navigate to `/reports/audit`
   - Show system audit log
   - User activity tracking
   - Data change history

**Key Features:**
- 50+ standard reports
- Custom report builder
- Full audit trail
- Document version control

---

## Closing Summary (1 minute)

**Key Messages:**

1. **Comprehensive Coverage:**
   - 5 fully integrated modules
   - 97%+ tender compliance
   - 129 features implemented

2. **Technical Excellence:**
   - Next.js 14 + Express + PostgreSQL
   - Modular monolith architecture
   - RESTful API with 80+ endpoints
   - Role-based access control

3. **Production Ready:**
   - Docker containerization
   - Railway deployment ready
   - Comprehensive test coverage
   - 24/7 monitoring capable

4. **Compliance:**
   - IRBM e-invoicing integrated
   - APAD compliance for terminals
   - MFRS accounting standards
   - Full audit trail

**Q&A Preparation:**

**Q: Is this production ready?**  
A: Yes, system is production-ready with Railway deployment. All core features are implemented and tested.

**Q: What about mobile apps?**  
A: System is fully responsive web application. Native mobile apps can be added in Phase 2 using React Native with shared API.

**Q: How about third-party integrations?**  
A: IRBM MyInvois is integrated. Port Klang PCS, KTMB rail, and customs integrations have API structure ready for connection.

**Q: Can it handle our volume?**  
A: Database designed for 1M+ transactions/year. Can scale horizontally with PostgreSQL read replicas.

**Q: What about AI features mentioned in tender?**  
A: Core platform ready for AI integration. Predictive analytics can be added as microservices in Phase 2.

---

## Troubleshooting

**If something doesn't work during demo:**

1. **Page not loading:**
   - Check if API is running: `docker-compose ps`
   - Check browser console for errors

2. **No data showing:**
   - Run seed: `cd packages/database && npx prisma db seed`

3. **Slow performance:**
   - Restart Docker services
   - Clear browser cache

4. **Demo data issues:**
   - Reset database: `npx prisma migrate reset`
   - Re-seed: `npx prisma db seed`

---

## Post-Demo Actions

1. **Thank the audience**
2. **Share GitHub repository:** github.com/randochalo/TSH-2604
3. **Offer technical deep-dive session**
4. **Provide contact for questions**
5. **Schedule follow-up if interested**

---

## Demo Checklist (Before Starting)

- [ ] Docker services running
- [ ] Database seeded with demo data
- [ ] Browser incognito mode
- [ ] Demo script printed/open
- [ ] Backup browser tab with dashboard
- [ ] Timer set for 20 minutes
- [ ] Water/coffee ready

**Good luck with the demo! 🚀**
