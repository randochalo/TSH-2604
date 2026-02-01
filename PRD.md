# Product Requirements Document (PRD)
## TSH-2604: Business Operating & Finance IT System

**Client:** Multimodal Freight Sdn Bhd (MMF)  
**System:** LogisticsPro Enterprise Suite  
**Version:** 4.2  
**Date:** February 2026  
**Status:** Draft  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview & Architecture](#2-system-overview--architecture)
3. [Module Specifications](#3-module-specifications)
4. [Integration Requirements](#4-integration-requirements)
5. [API Specifications](#5-api-specifications)
6. [Data Model Reference](#6-data-model-reference)
7. [Security & Compliance](#7-security--compliance)
8. [User Stories by Module](#8-user-stories-by-module)
9. [Technical Stack](#9-technical-stack)
10. [Deployment Model](#10-deployment-model)
11. [Success Metrics](#11-success-metrics)
12. [Definition of Done](#12-definition-of-done)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment Guide](#14-deployment-guide)
15. [Appendix A: Feature Summary](#appendix-a-feature-summary)
16. [Appendix B: API Endpoint Reference](#appendix-b-complete-api-endpoint-reference)
17. [Appendix C: Database Schema Reference](#appendix-c-database-schema-reference)
18. [Appendix D: Troubleshooting Guide](#appendix-d-troubleshooting-guide)
19. [Appendix E: Glossary](#appendix-e-glossary)

---

## 1. Executive Summary

### 1.1 Project Overview

TSH-2604 is a comprehensive digital transformation initiative for Multimodal Freight Sdn Bhd (MMF) to implement the **LogisticsPro Enterprise Suite** — an integrated 5-module logistics management platform covering Haulage, Forwarding, Warehouse, Terminal, and Finance operations across 6 branches.

### 1.2 Business Objectives

| Objective | Target Outcome |
|-----------|----------------|
| Operational Efficiency | 40% reduction in manual data entry |
| Revenue Protection | 3-5% recovery via revenue leakage detection |
| Customer Satisfaction | 25% improvement in on-time delivery |
| Financial Compliance | 100% IRBM e-Invoicing compliance |
| Decision Making | Real-time visibility across all operations |

### 1.3 Scope Summary

- **Systems:** 5 integrated modules (HMS, FFS, WMS, TMS, FMS)
- **Branches:** 6 locations (HQ, PK, GLD, PGD, BTW, Padang Besar)
- **Features:** 129 total features (100% compliance)
- **Users:** 200+ operational and finance users
- **Timeline:** 8-10 weeks to go-live

### 1.4 Key Value Propositions

1. **Production-Ready Solution:** 95% of requirements pre-built, not promised
2. **Accelerated Timeline:** 8-10 weeks vs. industry standard 6-9 months
3. **100% Compliance:** All 129 features fully comply with tender requirements
4. **Zero Critical VAPT Findings:** CREST-accredited security certification
5. **RM 3.25M Value-Added Services:** Included at no additional cost

### 1.5 Implementation Status Dashboard

| Module | Status | API Endpoints | DB Tables | UI Screens |
|--------|--------|---------------|-----------|------------|
| HMS | ✅ Complete | 15 | 8 | 6 |
| FFS | ✅ Complete | 12 | 5 | 5 |
| WMS | ✅ Complete | 14 | 6 | 5 |
| TMS | ✅ Complete | 12 | 5 | 4 |
| FMS | ✅ Complete | 27 | 11 | 10 |
| **TOTAL** | **✅ 100%** | **80+** | **35+** | **30+** |

**Implementation Metrics:**
- **Lines of Code:** 25,000+ (TypeScript/JavaScript)
- **Test Coverage:** 82% (Unit + Integration)
- **Docker Services:** 4 (Web, API, PostgreSQL, Redis)
- **Build Time:** ~3 minutes
- **Deploy Time:** ~5 minutes (CI/CD)

### 1.6 Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | Next.js | 14.x (App Router) | React framework with SSR |
| **UI Components** | React | 18.x | Component library |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Backend API** | Express.js | 4.x | REST API server |
| **Runtime** | Node.js | 18.x LTS | JavaScript runtime |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Database** | PostgreSQL | 15.x | Primary data store |
| **ORM** | Prisma | 5.x | Database client |
| **Cache** | Redis | 7.x | Session & caching |
| **Auth** | NextAuth.js | 4.x | JWT authentication |
| **Deployment** | Docker | 24.x | Containerization |
| **Hosting** | Railway/Fly.io | - | Cloud platform |

### 1.7 Repository Structure

```
logisticspro/
├── apps/
│   ├── web/                    # Next.js 14 frontend
│   │   ├── src/app/            # App router pages
│   │   │   ├── (auth)/         # Auth routes (login, etc.)
│   │   │   ├── (dashboard)/    # Dashboard layout
│   │   │   ├── hms/            # Haulage module UI
│   │   │   ├── ffs/            # Forwarding module UI
│   │   │   ├── wms/            # Warehouse module UI
│   │   │   ├── tms/            # Terminal module UI
│   │   │   └── fms/            # Finance module UI
│   │   ├── src/components/     # Shared components
│   │   └── package.json
│   │
│   └── api/                    # Express API server
│       ├── src/routes/         # API route handlers
│       │   ├── jobs.ts         # HMS endpoints
│       │   ├── vehicles.ts     # HMS fleet
│       │   ├── shipments.ts    # FFS endpoints
│       │   ├── inventory.ts    # WMS endpoints
│       │   ├── yard.ts         # TMS endpoints
│       │   ├── invoices.ts     # FMS billing
│       │   ├── accounts.ts     # FMS GL
│       │   └── ...
│       ├── src/middleware/     # Auth, validation
│       └── package.json
│
├── packages/
│   ├── database/               # Prisma schema & client
│   │   ├── prisma/
│   │   │   └── schema.prisma   # Database schema (35+ tables)
│   │   └── src/
│   │
│   ├── types/                  # Shared TypeScript types
│   │   └── src/
│   │       ├── enums.ts        # 40+ enums
│   │       └── interfaces.ts   # Shared interfaces
│   │
│   └── auth/                   # Authentication utilities
│       └── src/
│
├── docker-compose.yml          # Local development stack
├── turbo.json                  # Monorepo task runner
└── package.json                # Root workspace config
```

---

## 2. System Overview & Architecture

### 2.1 System Landscape

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LOGISTICSPRO ENTERPRISE SUITE                        │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────────┤
│     HMS     │     FFS     │     WMS     │     TMS     │        FMS          │
│  Haulage    │ Forwarding  │  Warehouse  │  Terminal   │     Finance         │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────────────┤
│ • Fleet     │ • Freight   │ • Inventory │ • Yard      │ • Accounting        │
│   Mgmt      │   Booking   │   Control   │   Mgmt      │ • e-Invoicing       │
│ • GPS       │ • Shipment  │ • Barcode/  │ • Gate      │ • Credit Control    │
│   Tracking  │   Tracking  │   RFID      │   Ops       │ • Tax Compliance    │
│ • Job       │ • Customs   │ • Put-away  │ • Container │ • Multi-Currency    │
│   Planning  │   Clearance │ • Picking   │   Tracking  │ • Fixed Assets      │
│ • Driver    │ • Job       │ • Cycle     │ • Rail      │ • Reporting         │
│   Incentive │   Costing   │   Count     │   Ops       │ • Consolidation     │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTEGRATION & SECURITY LAYER                             │
│  • RESTful APIs  • EDI Support  • 3rd Party Connectors  • Enterprise Bus   │
│  • MFA  • RBAC  • AES-256 Encryption  • Audit Trails  • VAPT Compliant    │
└─────────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AWAN KITA SOVEREIGN CLOUD                              │
│                    Malaysia Data Residency • 99.9% SLA                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Branch Deployment Matrix

| Branch | HMS | FFS | WMS | TMS | FMS |
|--------|-----|-----|-----|-----|-----|
| Headquarters (HQ) | ✅ | — | ✅ | — | ✅ |
| Port Klang (PK) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Global Logistics Dept (GLD) | — | ✅ | — | — | ✅ |
| Pasir Gudang (PGD) | — | ✅ | — | — | ✅ |
| Butterworth (BTW) | — | ✅ | — | ✅ | ✅ |
| Padang Besar | — | — | — | — | ✅ |

### 2.3 Architecture Principles

1. **Modular Monolith:** Clean module separation within a unified codebase for operational simplicity
2. **API-First:** RESTful APIs for all integrations and extensions
3. **Offline-First:** Full functionality without connectivity; sync when available
4. **Multi-Tenant:** Single codebase supporting multiple branches
5. **Cloud-Native:** Containerized deployment on Awan Kita sovereign cloud

### 2.4 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER / MOBILE                         │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         REVERSE PROXY / LOAD BALANCER                   │
│                    (NGINX / Traefik / CloudFlare)                       │
│         • SSL Termination • Rate Limiting • Load Balancing              │
│         • Static Asset Cache • DDoS Protection                          │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────────┐
│   Next.js     │     │   Express     │     │   Static Assets   │
│    (Web)      │     │    (API)      │     │      (CDN)        │
│   Port 3000   │     │   Port 3001   │     │                   │
│               │     │               │     │  • Images         │
│  • React App  │     │  • REST API   │     │  • Documents      │
│  • SSR Pages  │     │  • Middleware │     │  • Uploads        │
│  • API Routes │     │  • Webhooks   │     │                   │
└───────┬───────┘     └───────┬───────┘     └───────────────────┘
        │                     │
        └─────────────────────┼─────────────────────────┐
                              │                         │
                              ▼                         ▼
                     ┌───────────────┐         ┌───────────────┐
                     │   PostgreSQL  │         │     Redis     │
                     │   (Primary)   │         │   (Cache /    │
                     │    Port 5432  │         │   Session /   │
                     │               │         │   Queue)      │
                     │  • 35+ Tables │         │    Port 6379  │
                     │  • Prisma ORM │         │               │
                     │  • 7yr Retention│       │  • Sessions   │
                     └───────────────┘         │  • Rate Limit │
                                               │  • Pub/Sub    │
                                               └───────────────┘
```

### 2.5 Architecture Pattern: Modular Monolith

The LogisticsPro implementation uses a **Modular Monolith** architecture pattern:

| Aspect | Implementation | Rationale |
|--------|----------------|-----------|
| **Code Organization** | Monorepo with clear module boundaries | Easier refactoring, shared types |
| **Database** | Single PostgreSQL instance with schema naming conventions | Simpler backups, ACID transactions |
| **API Server** | Single Express server with route modules | Lower ops overhead, faster inter-module calls |
| **Frontend** | Next.js with route groups per module | Shared UI components, unified auth |
| **Deployment** | Containerized as 2-3 services | Balance of isolation and simplicity |

#### Module Boundaries

Each module (HMS, FFS, WMS, TMS, FMS) has defined boundaries:

| Module | API Routes | Web Routes | Database Models | Shared? |
|--------|------------|------------|-----------------|---------|
| HMS | `/api/jobs`, `/api/vehicles`, `/api/drivers` | `/hms/*` | 8 models | No |
| FFS | `/api/shipments`, `/api/containers` | `/ffs/*` | 5 models | Container (shared with TMS) |
| WMS | `/api/warehouses`, `/api/inventory` | `/wms/*` | 6 models | No |
| TMS | `/api/yard`, `/api/gate-passes` | `/tms/*` | 5 models | Container (shared with FFS) |
| FMS | `/api/invoices`, `/api/accounts`, `/api/payments` | `/fms/*` | 11 models | Customer, Vendor (shared) |
| Core | `/api/auth`, `/api/health`, `/api/users` | `/` (auth) | 5 models | Yes |

#### Import Boundaries (ESLint Enforced)

```javascript
// ✅ Allowed - Within same module
import { createJob } from './jobs/service';

// ✅ Allowed - From shared packages
import { prisma } from '@repo/database';
import { UserRole } from '@repo/types';

// ❌ Forbidden - Cross-module import
import { createInvoice } from '../fms/invoices/service';
```

### 2.6 API Gateway Structure

The Express API server acts as the gateway layer with the following route structure:

| Route Prefix | Module | Purpose | Auth Required |
|--------------|--------|---------|---------------|
| `/api/health` | System | Health checks | No |
| `/api/auth/*` | Auth | Login, logout, session | Partial |
| `/api/users` | Core | User management | Yes |
| `/api/branches` | Core | Branch management | Yes |
| `/api/jobs` | HMS | Haulage jobs CRUD | Yes |
| `/api/jobs/:id/tracking` | HMS | GPS tracking updates | Yes |
| `/api/vehicles` | HMS | Fleet vehicles | Yes |
| `/api/drivers` | HMS | Driver profiles | Yes |
| `/api/drivers/:id/incentives` | HMS | Driver payroll | Yes |
| `/api/shipments` | FFS | Freight shipments | Yes |
| `/api/shipments/:id/tracking` | FFS | Shipment status | Yes |
| `/api/containers` | FFS/TMS | Container master | Yes |
| `/api/customs-entries` | FFS | Customs declarations | Yes |
| `/api/rate-sheets` | FFS | Freight pricing | Yes |
| `/api/warehouses` | WMS | Warehouse master | Yes |
| `/api/inventory` | WMS | Stock management | Yes |
| `/api/inventory/:id/movements` | WMS | Stock transactions | Yes |
| `/api/locations` | WMS | Warehouse locations | Yes |
| `/api/yard/blocks` | TMS | Terminal layout | Yes |
| `/api/yard/slots` | TMS | Container positions | Yes |
| `/api/gate-passes` | TMS | Gate operations | Yes |
| `/api/gate-passes/:id/approve` | TMS | Gate authorization | Yes |
| `/api/rail-operations` | TMS | KTMB manifests | Yes |
| `/api/customers` | FMS | AR/Customer master | Yes |
| `/api/vendors` | FMS | AP/Vendor master | Yes |
| `/api/invoices` | FMS | Billing/e-Invoicing | Yes |
| `/api/invoices/:id/submit-einvoice` | FMS | IRBM submission | Yes |
| `/api/payments` | FMS | Receipts/Payments | Yes |
| `/api/accounts` | FMS | GL Chart of Accounts | Yes |
| `/api/journal-entries` | FMS | GL Transactions | Yes |
| `/api/fixed-assets` | FMS | Asset register | Yes |

**Total: 30+ API route prefixes, 80+ endpoints**

---

## 3. Module Specifications

### 3.1 Haulage Management System (HMS)

**Locations:** Port Klang (PK), HQ  
**Features:** 19  
**Users:** Fleet managers, dispatchers, drivers, customers

#### Core Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| HMS-001 | Dashboards & Analytics | Real-time Operations Command Centre with KPI widgets, predictive maintenance AI | P0 |
| HMS-002 | Multi-Platform Interface | Web, mobile (iOS/Android), desktop with offline-first PWA capability | P0 |
| HMS-003 | 3rd Party Integration | RESTful APIs, SOAP, SFTP, EDI for PCS, JPJ, Customs, customer ERPs | P0 |
| HMS-004 | Cross-System Linkage | ESB integration with FMS, WMS, TMS for real-time data exchange | P0 |
| HMS-005 | User-Friendly Interface | Nielsen heuristics-based UI, role-based navigation, contextual help | P0 |
| HMS-006 | Automated Invoicing | Complex rating, multi-tier pricing, IRBM e-Invoicing via MyInvois API | P0 |
| HMS-007 | Credit & Collections | Credit limit enforcement, automated dunning, promise-to-pay tracking | P0 |
| HMS-008 | Overdue Customer Lock | Auto credit-hold with dual-authorization override and audit trail | P0 |
| HMS-009 | Audit Trail & History | Immutable logs with before/after values, IP tracking, tamper-resistant | P0 |
| HMS-010 | Document Attachments | Unlimited file support (50MB), OCR indexing, encrypted storage | P0 |
| HMS-011 | Security Features | MFA, RBAC (50+ permissions), AES-256, zero-trust architecture | P0 |
| HMS-012 | Online Submission & Tracking | Customer portal with GPS tracking, 12-status-point notifications | P0 |
| HMS-013 | Container Tracking | Mobile app with GPS, photo proof, digital signature, 30-sec sync | P0 |
| HMS-014 | Electronic Work Ticket | Digital Job Cards with one-tap status updates, geolocation capture | P0 |
| HMS-015 | Job Planning & Assignment | AI-powered PM/trailer optimization with drag-and-drop override | P0 |
| HMS-016 | Trailer Monitoring | Registry with 30/60/90-day permit alerts, PUSPAKOM tracking | P0 |
| HMS-017 | GPS Tracking | Geotab/Wialon integration, speed alerts, idle detection, 2-year history | P0 |
| HMS-018 | Driver Incentive | Unlimited formula configs, auto-post to FMS payroll | P0 |
| HMS-019 | Reporting & Enquiries | 50+ standard reports, ad-hoc query builder, PDF/Excel/CSV export | P0 |

#### Value-Add Features

- **AI-Powered Natural Language Query:** Ask questions like "Show underperforming routes" for instant visual answers
- **Predictive Maintenance AI:** 7-14 day breakdown prediction with 89% accuracy
- **Fleet Optimization AI:** Real-time route optimization reducing fuel by 15-20%
- **Driver Behavior Analytics:** Safety scoring with personalized coaching

---

### 3.2 Forwarding Management System (FFS)

**Locations:** PK, GLD, BTW, PGD  
**Features:** 21  
**Users:** Freight coordinators, customs brokers, customers

#### Core Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| FFS-001 | Dashboard - Real-Time | FFS Command Centre with role-based views, drill-down capability | P0 |
| FFS-002 | Multi-Platform Interface | Responsive web, native mobile apps, offline capability | P0 |
| FFS-003 | 3rd Party Integration | PCS, uCustoms (MyGBS), shipping lines, airlines, EDI X12/EDIFACT | P0 |
| FFS-004 | Cross-System Linkage | Real-time exchange with HMS, WMS, FMS for coordinated workflows | P0 |
| FFS-005 | User-Friendly Interface | Workflow-driven UI with visual progress indicators | P0 |
| FFS-006 | Automated Invoicing | Multi-currency, multi-party billing, IRBM e-Invoicing | P0 |
| FFS-007 | Credit & Collections | Consolidated customer view across business units | P0 |
| FFS-008 | Overdue Customer Lock | Unified credit control with escalation matrix | P0 |
| FFS-009 | Audit Trail & History | Complete shipment lifecycle audit with single-click access | P0 |
| FFS-010 | Document Attachments | Trade documents (BL, AWB, CO) with metadata extraction | P0 |
| FFS-011 | Security Features | Role-based access, shipment-level permissions | P0 |
| FFS-012 | Online Submission & Tracking | 24/7 customer portal with document upload | P0 |
| FFS-013 | Job Planning & Tracking | Visual timeline with project management view | P0 |
| FFS-014 | Shipment Tracking | Multi-modal tracking with shipping line API integration | P0 |
| FFS-015 | Job Costing Automation | Real-time P&L per shipment with variance alerts | P0 |
| FFS-016 | Data Bank | Tender management with 3-year rate history | P0 |
| FFS-017 | Document Management | Auto-generation of BL, AWB with digital signatures | P0 |
| FFS-018 | Freight Rate Sheets | Multi-carrier rate management with validity tracking | P0 |
| FFS-019 | Reporting & Enquiry | 40+ freight reports, custom report builder | P0 |
| FFS-020 | Financial Reports | Revenue by trade lane, profitability per customer | P0 |
| FFS-021 | Enquiries | Cross-module search by BL, container, customer ref | P0 |

#### Value-Add Features

- **Shipment Exception Prediction AI:** 48-72 hour delay prediction with 87% accuracy
- **Revenue Intelligence Module:** Cross-selling suggestions increasing revenue 8-12%
- **Blockchain Document Verification:** Tamper-proof document fingerprints
- **AI Document Extraction:** 95%+ accuracy from unstructured documents

---

### 3.3 Warehouse Management System (WMS)

**Locations:** PK, HQ  
**Features:** 27  
**Users:** Warehouse operators, supervisors, inventory managers

#### Core Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| WMS-001 | Dashboards & Analytics | Control Tower with KPIs, predictive analytics for reorder points | P0 |
| WMS-002 | Multi-Platform Interface | Web, RF scanners, tablets, forklift-mounted devices, voice picking | P0 |
| WMS-003 | 3rd Party Integration | PCS, Customs, couriers (DHL, FedEx), e-commerce platforms | P0 |
| WMS-004 | Cross-System Linkage | HMS delivery scheduling, FFS coordination, FMS billing | P0 |
| WMS-005 | User-Friendly Interface | Barcode scanning workflows, color-coded locations | P0 |
| WMS-006 | Automated Invoicing | Storage billing by CBM/sqft, IRBM e-Invoicing | P0 |
| WMS-007 | Credit & Collections | Unified credit, DSO reduction by 15 days | P0 |
| WMS-008 | Overdue Customer Lock | Release blocking with configurable grace periods | P0 |
| WMS-009 | Audit Trail & History | 7-year retention, customs compliance traceability | P0 |
| WMS-010 | Document Attachments | GRN, DO, customs forms with job-based filing | P0 |
| WMS-011 | Security Features | Zone-based access, supervisor approval workflows | P0 |
| WMS-012 | Cargo In/Out | Barcode/RFID scanner support, GS1-128, SSCC standards | P0 |
| WMS-013 | Storage Charges | Flexible charging (pallet/CBM/weight) with tiered rates | P0 |
| WMS-014 | Gate Pass Generation | Auto-generated with barcode/QR, digital signature | P0 |
| WMS-015 | Inventory Management | Real-time tracking, multiple statuses, 99.5%+ accuracy | P0 |
| WMS-016 | Receiving & Inbound | ASN-based with discrepancy reporting, put-away tasks | P0 |
| WMS-017 | Put-Away Management | Intelligent location suggestions based on attributes | P0 |
| WMS-018 | Location Management | Visual warehouse map, zone/aisle/rack/bin hierarchy | P0 |
| WMS-019 | Order Management | Single/batch/wave/zone/cluster picking, pick path optimization | P0 |
| WMS-020 | Packing & Shipping | Cartonization, label generation, carrier integration | P0 |
| WMS-021 | Returns (RMA) | Inspection workflow, condition assessment, credit notes | P0 |
| WMS-022 | Cycle Counting | ABC/random/triggered counts, blind count option | P0 |
| WMS-023 | Labor & Task Management | Skill-based assignment, productivity tracking | P0 |
| WMS-024 | Multi-Warehouse | Single platform, inter-warehouse transfers, consolidated view | P0 |
| WMS-025 | Document Creation | Pick lists, packing slips, BOL with barcode/QR | P0 |
| WMS-026 | Scalability | AGV/AMR/voice picking/RFID ready, AI/ML platform | P0 |
| WMS-027 | Reporting & Enquiry | 50+ reports, inventory/operations/financial/compliance | P0 |

#### Value-Add Features

- **Warehouse Digital Twin:** Real-time 3D visualization for scenario modeling
- **AI Slotting Optimizer:** 20-30% picking efficiency improvement
- **Drone Inventory Counting:** 75% reduction in counting time
- **AR Picking Module:** Smart glasses overlay, 60% training time reduction

---

### 3.4 Terminal Management System (TMS)

**Locations:** PK, BTW  
**Features:** 25  
**Users:** Terminal operators, gate officers, yard planners

#### Core Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| TMS-001 | Dashboards & Analytics | Terminal KPIs, bottleneck visualization, equipment productivity | P0 |
| TMS-002 | Multi-Platform Interface | Desktop, tablets, mobile for outdoor operations | P0 |
| TMS-003 | 3rd Party Integration | KTMB, PPSB, customs (KDM), shipping lines, COPARN/CODECO/COARRI | P0 |
| TMS-004 | Cross-System Linkage | HMS haulier coordination, FFS updates, FMS billing | P0 |
| TMS-005 | User-Friendly Interface | Visual yard maps, touch-friendly, rapid data entry | P0 |
| TMS-006 | Automated Invoicing | Storage/handling charges, IRBM e-Invoicing | P0 |
| TMS-007 | Credit & Collections | Release authorization with credit checks | P0 |
| TMS-008 | Overdue Customer Lock | Container release blocking with dual authorization | P0 |
| TMS-009 | Audit Trail & History | Complete container lifecycle tracking | P0 |
| TMS-010 | Document Attachments | Gate passes, damage photos, inspection reports | P0 |
| TMS-011 | Security Features | Role-based access for gate/yard/manager roles | P0 |
| TMS-012 | Yard Module | Digital layout, zones/blocks/rows/slots, real-time occupancy | P0 |
| TMS-013 | Container Turn In | Gate-in with EDI/file upload, booking validation | P0 |
| TMS-014 | Container Turn Out | Gate-out with clearance checks, billing trigger | P0 |
| TMS-015 | Container Tracking | Real-time location, movement history, dwell time | P0 |
| TMS-016 | Container Putaway | Intelligent slotting based on attributes/schedule | P0 |
| TMS-017 | Damage Repair | Inspection workflow, photo docs, M&R tracking | P0 |
| TMS-018 | Container Railing | KTMB integration, manifest batch upload, schedule visibility | P0 |
| TMS-019 | Gate Module | Weighbridge integration, KDM verification | P0 |
| TMS-020 | Gate Pass Generation | Auto-generated with serial numbers, barcode/QR | P0 |
| TMS-021 | Online Request/Tracking | Booking validation, 48-hour cutoff enforcement | P0 |
| TMS-022 | System Integration | Weighbridge, EDI, PPSB, API gateway | P0 |
| TMS-023 | APAD Requirements | Pre-arrival booking, TAT tracking, advance notifications | P0 |
| TMS-024 | Rate Management | Multi-charge types, customer-specific rates, expiry alerts | P0 |
| TMS-025 | Reporting & Enquiry | 40+ reports, container status, yard operations | P0 |

#### Value-Add Features

- **Yard Optimization AI:** 25-35% rehandle reduction
- **Predictive Gate Congestion:** 4-6 hour advance forecasting
- **Equipment Telemetry:** Real-time crane/forklift/RTG monitoring
- **Carbon Footprint Tracking:** CO2 emissions per container movement

---

### 3.5 Finance Management System (FMS)

**Locations:** ALL Branches (HQ, PK, GLD, PGD, BTW, Padang Besar)  
**Features:** 37  
**Users:** Finance team, management, auditors

#### Core Features

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| FMS-001 | Dashboard - Real-Time | Financial Command Centre, cash flow, budget vs actual | P0 |
| FMS-002 | Multi-Platform Interface | Web browser, mobile approvals, alerts | P0 |
| FMS-003 | Cross-System Linkage | Auto-posting from HMS/FFS/WMS/TMS to GL | P0 |
| FMS-004 | User-Friendly Interface | Simplified for operations, advanced for finance | P0 |
| FMS-005 | 3rd Party Integration | Banking, IRBM MyInvois, payroll, audit systems | P0 |
| FMS-006 | Credit & Collections | AR management, aging analysis, automated workflows | P0 |
| FMS-007 | Overdue Customer Lock | System-wide credit control with grace periods | P0 |
| FMS-008 | Audit Trail & History | Complete financial transaction audit, immutable logs | P0 |
| FMS-009 | Document Attachments | Invoices, receipts, POs, vouchers with OCR | P0 |
| FMS-010 | Security Features | Segregation of duties, dual authorization | P0 |
| FMS-011 | Tax Compliance | SST/GST, withholding tax, statutory returns | P0 |
| FMS-012 | Multi-Currency/Company | Auto exchange rates, gain/loss, consolidation | P0 |
| FMS-013 | AR - Customer Master | Multiple addresses, hierarchy, credit limits | P0 |
| FMS-014 | Invoicing & Billing | Manual/auto/recurring, IRBM e-Invoicing | P0 |
| FMS-015 | Debit & Credit Notes | Auto-linking to invoices, approval workflows | P0 |
| FMS-016 | AR Payments Processing | Multi-channel, auto-reconciliation | P0 |
| FMS-017 | Receipts & Cash Application | Suggestive matching, unapplied tracking | P0 |
| FMS-018 | AP - Vendor Management | Banking details, duplicate detection | P0 |
| FMS-019 | AP Invoice Management | Three-way matching, tolerance levels | P0 |
| FMS-020 | AP Payments Processing | Batch payments, cash flow optimization | P0 |
| FMS-021 | GL - Chart of Accounts | Multi-level, segments, logistics templates | P0 |
| FMS-022 | Journal Entry Processing | Templates, auto-reversal, validation | P0 |
| FMS-023 | Period Management | Soft/hard close, multi-module periods | P0 |
| FMS-024 | Budgeting & Forecasting | Multiple versions, budget controls | P0 |
| FMS-025 | FA - Asset Master | Acquisition info, QR/barcode tracking | P0 |
| FMS-026 | Asset Acquisition | Direct/PO/CWIP, bulk upload | P0 |
| FMS-027 | Depreciation Mgmt | Multiple methods, auto calculation | P0 |
| FMS-028 | Asset Revaluation | Index-based or manual, history tracking | P0 |
| FMS-029 | Asset Transfers | Inter-dept/branch, GL entries | P0 |
| FMS-030 | Asset Disposal | Sale/scrap/donation, gain/loss calc | P0 |
| FMS-031 | Asset Write-off | Authorization workflows, history | P0 |
| FMS-032 | Asset Maintenance | Scheduling, warranty, service tracking | P0 |
| FMS-033 | P&L Reporting | By branch/dept/cost center, drill-down | P0 |
| FMS-034 | Balance Sheet | Comparative, ratio analysis, integrity checks | P0 |
| FMS-035 | Cash Flow Statement | Direct method, 12-month rolling | P0 |
| FMS-036 | Debtors/Creditors Ageing | Configurable buckets, auto reminders | P0 |
| FMS-037 | Daily Revenue Reports | Auto-generated, volume/value analysis | P0 |

#### Value-Add Features

- **AI-Powered Cash Flow Forecasting:** 90-day prediction with 94% accuracy
- **Fraud Detection Engine:** ML-based anomaly detection
- **Automated Financial Consolidation:** Month-end in hours not days
- **AI-Based Credit Scoring:** 20-30% bad debt reduction

---

## 4. Integration Requirements

### 4.1 Internal Integration (System-to-System)

| Integration | Direction | Data Exchanged | Frequency |
|-------------|-----------|----------------|-----------|
| HMS ↔ FFS | Bidirectional | Job status, container details, haulage requests | Real-time |
| HMS ↔ WMS | Bidirectional | Delivery scheduling, inventory updates | Real-time |
| HMS ↔ FMS | Bidirectional | Billing data, driver incentives, receipts | Real-time |
| FFS ↔ WMS | Bidirectional | Booking allocations, inventory reservations | Real-time |
| FFS ↔ FMS | Bidirectional | Freight billing, cost data, customer payments | Real-time |
| WMS ↔ FMS | Bidirectional | Storage charges, handling fees, gate passes | Real-time |
| TMS ↔ HMS | Bidirectional | Container release, haulier coordination | Real-time |
| TMS ↔ FMS | Bidirectional | Terminal charges, storage billing | Real-time |

### 4.2 External Integration (3rd Party)

| System | Integration Partner | Protocol | Purpose |
|--------|---------------------|----------|---------|
| HMS | Port Klang PCS | REST API | Container availability, vessel schedules |
| HMS | JPJ | SOAP | Vehicle registration verification |
| HMS | MyGBS (Customs) | REST API | Customs clearance status |
| FFS | uCustoms/MyGBS | REST API | Import/export declarations |
| FFS | Shipping Lines | EDI/API | BL, vessel tracking |
| FFS | Airlines | API | AWB, flight status |
| WMS | Port Klang PCS | REST API | Cargo availability |
| WMS | Courier Services | API | DHL, FedEx, Pos Laju tracking |
| WMS | E-commerce | API | Shopify, Lazada, Shopee orders |
| TMS | KTMB | EDI/API | Rail manifests, schedules |
| TMS | PPSB | API | Port terminal data exchange |
| TMS | KDM (Customs) | API | Customs clearance verification |
| FMS | IRBM MyInvois | REST API | e-Invoice validation/submission |
| FMS | Banks | API/FTPS | Payment processing, statements |
| All | Customer ERPs | REST/EDI | SAP, Oracle, Microsoft Dynamics |

### 4.3 Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     API GATEWAY (Express)                       │
│         Authentication • Rate Limiting • Request Routing        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌────────────────┐    ┌──────────────┐
│  REST APIs    │    │  EDI Gateway   │    │  SFTP/FTPS   │
│  (JSON/XML)   │    │ (X12/EDIFACT)  │    │  File Exch   │
└───────────────┘    └────────────────┘    └──────────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  MESSAGE QUEUE    │
                    │     (Redis)       │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐           ┌─────────┐
   │  HMS    │          │  FFS    │           │  WMS    │
   └─────────┘          └─────────┘           └─────────┘
        │                     │                     │
        └─────────────────────┼─────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  TMS      │  FMS  │
                    └───────────────────┘
```

### 4.4 API Gateway Implementation

The Express.js API server implements gateway functionality through middleware layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS GATEWAY LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. SECURITY MIDDLEWARE (Helmet.js)                            │
│     ├── HTTP security headers (HSTS, X-Frame-Options)          │
│     ├── XSS protection (Content-Type sniffing prevention)      │
│     ├── CSP (Content Security Policy) headers                  │
│     └── DNS prefetch control                                   │
│                                                                 │
│  2. CORS MIDDLEWARE                                            │
│     ├── Whitelist origins from env config                      │
│     ├── Credentials support for cookies                        │
│     └── Preflight handling for complex requests                │
│                                                                 │
│  3. COMPRESSION MIDDLEWARE                                     │
│     ├── Gzip compression for responses > 1KB                   │
│     └── Brotli support where available                         │
│                                                                 │
│  4. REQUEST PARSING                                            │
│     ├── JSON body parser (limit: 10MB)                         │
│     ├── URL-encoded parser                                     │
│     └── Multipart form data (file uploads)                     │
│                                                                 │
│  5. AUTHENTICATION MIDDLEWARE (JWT)                            │
│     ├── Extract Bearer token from Authorization header         │
│     ├── Verify JWT signature                                   │
│     ├── Check token expiration                                 │
│     └── Attach user to request context                         │
│                                                                 │
│  6. AUTHORIZATION MIDDLEWARE (RBAC)                            │
│     ├── Check user has required permission                     │
│     ├── Verify branch access scope                             │
│     └── Data-level permission filtering                        │
│                                                                 │
│  7. REQUEST LOGGING (Morgan + Winston)                         │
│     ├── Structured access logs (JSON format)                   │
│     ├── Request/response correlation IDs                       │
│     └── Error tracking with stack traces                       │
│                                                                 │
│  8. RATE LIMITING (express-rate-limit + Redis)                 │
│     ├── 100 requests/minute per IP (default)                   │
│     ├── 1000 requests/minute per authenticated user            │
│     ├── Burst handling with token bucket                       │
│     └── IP blocking after repeated violations                  │
│                                                                 │
│  9. VALIDATION MIDDLEWARE (Zod)                                │
│     ├── Request body schema validation                         │
│     ├── Query parameter validation                             │
│     └── Path parameter validation                              │
│                                                                 │
│  10. ROUTING LAYER                                             │
│     ├── Module-specific route handlers                         │
│     └── 404 handler for undefined routes                       │
│                                                                 │
│  11. ERROR HANDLING                                            │
│     ├── Centralized error middleware                           │
│     ├── RFC 7807 Problem Details format                        │
│     └── Error classification and alerting                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

#### Rate Limiting Configuration

| Endpoint Type | Limit | Window | Storage |
|---------------|-------|--------|---------|
| Public (health) | 10 req/min | 1 min | Memory |
| Authentication | 5 req/min | 1 min | Redis |
| API (unauthenticated) | 100 req/min | 1 min | Redis |
| API (authenticated) | 1000 req/min | 1 min | Redis |
| File uploads | 10 req/min | 1 min | Redis |

### 4.5 External Integration Endpoints

| External System | Status | Integration Point | Protocol | Implementation |
|-----------------|--------|-------------------|----------|----------------|
| **IRBM MyInvois** | ✅ Ready | `POST /api/invoices/:id/submit-einvoice` | REST API | Live integration |
| **Port Klang PCS** | 🔄 Planned | `GET /api/integrations/pcs/containers` | REST API | Q2 2026 |
| **KTMB Rail** | 🔄 Planned | `POST /api/rail-operations/import` | EDI/API | Q2 2026 |
| **uCustoms/MyGBS** | 🔄 Planned | CustomsEntry model sync | REST API | Q2 2026 |
| **JPJ Vehicle** | 🔄 Planned | `GET /api/integrations/jpj/vehicles/:reg` | SOAP/REST | Q3 2026 |
| **Banking (FPX)** | 🔄 Planned | `POST /api/payments/fpx/initiate` | REST API | Q3 2026 |
| **Shipping Lines** | 🔄 Planned | `GET /api/integrations/carriers/:id/tracking` | EDI/REST | Q3 2026 |

#### IRBM e-Invoicing Integration

```typescript
// IRBM MyInvois API Integration
interface IRBMInvoiceSubmission {
  document: {
    format: 'XML' | 'JSON';
    version: '1.0';
    content: Base64EncodedInvoice;
  };
  validation: {
    signature: string;
    timestamp: ISO8601DateTime;
  };
}

// Submission endpoint flow
POST /api/invoices/:id/submit-einvoice
  1. Validate invoice is in DRAFT status
  2. Transform to IRBM LHDN format
  3. Digitally sign document
  4. Submit to MyInvois API
  5. Store UUID and validation link
  6. Update invoice status to SUBMITTED
  7. Poll for validation status
  8. Update with IRBM UUID on success
```

**IRBM API Endpoints Used:**
- `POST /api/v1.0/documents` - Submit new invoice
- `GET /api/v1.0/documents/{id}` - Check status
- `POST /api/v1.0/documents/cancel` - Cancel submitted invoice
- `GET /api/v1.0/taxpayer/validate` - Validate TIN

### 4.6 Webhook Support

The system supports outbound webhooks for real-time event notifications:

#### Webhook Events

| Event | Payload | Description |
|-------|---------|-------------|
| `job.created` | `{ jobId, customerId, pickupTime, deliveryTime }` | New haulage job created |
| `job.completed` | `{ jobId, completedAt, driverId, podImage }` | Job marked complete with POD |
| `job.cancelled` | `{ jobId, cancelledAt, reason }` | Job cancelled |
| `shipment.booked` | `{ shipmentId, blNumber, shipper, consignee }` | New freight booking |
| `shipment.arrived` | `{ shipmentId, arrivalDate, port }` | Shipment arrived at destination |
| `invoice.created` | `{ invoiceId, customerId, total, dueDate }` | New invoice generated |
| `invoice.paid` | `{ invoiceId, paymentId, amount, method }` | Payment applied to invoice |
| `invoice.einvoiced` | `{ invoiceId, irbmUuid, validationDate }` | IRBM submission confirmed |
| `inventory.received` | `{ inventoryId, sku, quantity, warehouseId }` | Goods receipt completed |
| `inventory.shipped` | `{ inventoryId, sku, quantity, doNumber }` | Goods shipped |
| `gatepass.approved` | `{ gatePassId, containerNo, approvedBy }` | Gate pass approved |
| `gatepass.gateout` | `{ gatePassId, containerNo, exitTime }` | Container exited terminal |

#### Webhook Configuration

```typescript
interface WebhookConfig {
  id: string;
  url: string;
  events: WebhookEvent[];
  active: boolean;
  secret: string; // For HMAC signature
  headers?: Record<string, string>; // Custom headers
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

// Webhook delivery security
headers: {
  'X-Webhook-Signature': 'sha256=<hmac_signature>',
  'X-Webhook-Event': 'invoice.created',
  'X-Webhook-ID': 'unique-delivery-id',
  'X-Webhook-Timestamp': '1708000000'
}
```

#### Webhook Retry Policy

| Attempt | Delay | Action on Failure |
|---------|-------|-------------------|
| 1st | Immediate | Initial delivery |
| 2nd | 5 seconds | Retry on 5xx or timeout |
| 3rd | 25 seconds | Exponential backoff |
| 4th | 2 minutes | Continue backoff |
| 5th | 10 minutes | Final retry |
| 5+ | - | Mark failed, alert admin |

**Dead Letter Queue:** Failed webhooks stored in Redis for manual replay.

---

## 5. API Specifications

### 5.1 API Standards

| Standard | Implementation | Notes |
|----------|----------------|-------|
| **Protocol** | RESTful HTTP/1.1 | HTTP/2 supported by reverse proxy |
| **Format** | JSON (application/json) | UTF-8 encoding |
| **Authentication** | Bearer JWT | Via Authorization header |
| **Versioning** | URL path (`/api/v1/...`) | Currently v1 only |
| **Pagination** | Offset-based (`limit`/`offset`) | Default: limit=20, max=100 |
| **Error Format** | RFC 7807 Problem Details | Consistent error structure |
| **Date Format** | ISO 8601 (UTC) | `2026-02-15T10:30:00Z` |
| **IDs** | CUID (Collision-resistant) | `clyd2u8x30001abc123def456` |

### 5.2 Common Response Patterns

#### Success Response (Single Resource)
```json
{
  "id": "clyd2u8x30001abc123def456",
  "createdAt": "2026-02-15T10:30:00Z",
  "updatedAt": "2026-02-15T10:30:00Z",
  "createdBy": "clyd1a2b3c4d5e6f7g8h9i0j1",
  "updatedBy": "clyd1a2b3c4d5e6f7g8h9i0j1",
  "branchId": "clyd0001abc123def456ghi789",
  "status": "ACTIVE",
  ...
}
```

#### Success Response (List)
```json
{
  "data": [
    { /* resource 1 */ },
    { /* resource 2 */ }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 156,
    "hasMore": true
  }
}
```

#### Error Response (RFC 7807)
```json
{
  "type": "https://api.logisticspro.com/errors/not-found",
  "title": "Invoice not found",
  "status": 404,
  "detail": "No invoice found with ID: clyd2u8x30001abc123def456",
  "instance": "/api/invoices/clyd2u8x30001abc123def456",
  "code": "INVOICE_NOT_FOUND",
  "timestamp": "2026-02-15T10:30:00Z"
}
```

#### Common HTTP Status Codes
| Code | Usage |
|------|-------|
| 200 | OK - GET, PUT success |
| 201 | Created - POST success |
| 204 | No Content - DELETE success |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Missing/invalid JWT |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Business rule violation |
| 422 | Unprocessable Entity - Semantic errors |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Unexpected error |

### 5.3 Core Endpoints Reference

#### HMS - Haulage Management

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| GET | `/api/jobs` | List haulage jobs | ✓ | jobs:read |
| POST | `/api/jobs` | Create new job | ✓ | jobs:create |
| GET | `/api/jobs/:id` | Get job details | ✓ | jobs:read |
| PATCH | `/api/jobs/:id` | Update job | ✓ | jobs:update |
| DELETE | `/api/jobs/:id` | Delete job | ✓ | jobs:delete |
| POST | `/api/jobs/:id/assign` | Assign driver/vehicle | ✓ | jobs:assign |
| POST | `/api/jobs/:id/tracking` | Update GPS location | ✓ | jobs:update |
| GET | `/api/jobs/:id/tracking` | Get tracking history | ✓ | jobs:read |
| GET | `/api/jobs/stats` | Dashboard statistics | ✓ | reports:view |
| GET | `/api/vehicles` | List fleet vehicles | ✓ | vehicles:read |
| POST | `/api/vehicles` | Add vehicle | ✓ | vehicles:create |
| GET | `/api/vehicles/:id` | Get vehicle details | ✓ | vehicles:read |
| PATCH | `/api/vehicles/:id` | Update vehicle | ✓ | vehicles:update |
| GET | `/api/vehicles/:id/maintenance` | Get maintenance history | ✓ | vehicles:read |
| GET | `/api/drivers` | List drivers | ✓ | drivers:read |
| POST | `/api/drivers` | Add driver | ✓ | drivers:create |
| GET | `/api/drivers/:id` | Get driver details | ✓ | drivers:read |
| GET | `/api/drivers/:id/incentives` | Get incentive calculation | ✓ | reports:view |
| GET | `/api/drivers/:id/jobs` | Get driver's job history | ✓ | jobs:read |

#### FFS - Freight Forwarding

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| GET | `/api/shipments` | List shipments | ✓ | shipments:read |
| POST | `/api/shipments` | Create shipment | ✓ | shipments:create |
| GET | `/api/shipments/:id` | Get shipment details | ✓ | shipments:read |
| PATCH | `/api/shipments/:id` | Update shipment | ✓ | shipments:update |
| POST | `/api/shipments/:id/status` | Update status | ✓ | shipments:update |
| GET | `/api/shipments/:id/tracking` | Get tracking events | ✓ | shipments:read |
| POST | `/api/shipments/:id/documents` | Attach document | ✓ | shipments:update |
| GET | `/api/containers` | List containers | ✓ | shipments:read |
| POST | `/api/containers` | Register container | ✓ | shipments:create |
| GET | `/api/containers/:id` | Get container details | ✓ | shipments:read |
| GET | `/api/customs-entries` | List customs declarations | ✓ | customs:read |
| POST | `/api/customs-entries` | Create customs entry | ✓ | customs:create |
| GET | `/api/customs-entries/:id` | Get customs details | ✓ | customs:read |
| PATCH | `/api/customs-entries/:id` | Update customs entry | ✓ | customs:update |
| GET | `/api/rate-sheets` | List freight rates | ✓ | rates:read |
| POST | `/api/rate-sheets` | Add rate sheet | ✓ | rates:create |

#### WMS - Warehouse Management

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| GET | `/api/warehouses` | List warehouses | ✓ | inventory:read |
| POST | `/api/warehouses` | Create warehouse | ✓ | inventory:create |
| GET | `/api/warehouses/:id` | Get warehouse details | ✓ | inventory:read |
| GET | `/api/warehouses/:id/locations` | Get storage locations | ✓ | inventory:read |
| GET | `/api/inventory` | List inventory items | ✓ | inventory:read |
| POST | `/api/inventory` | Create stock record | ✓ | inventory:create |
| GET | `/api/inventory/:id` | Get stock details | ✓ | inventory:read |
| PATCH | `/api/inventory/:id` | Update stock | ✓ | inventory:update |
| POST | `/api/inventory/:id/movements` | Record movement | ✓ | inventory:move |
| GET | `/api/inventory/:id/movements` | Get movement history | ✓ | inventory:read |
| POST | `/api/inventory/count` | Submit cycle count | ✓ | inventory:adjust |
| GET | `/api/locations` | List all locations | ✓ | inventory:read |
| POST | `/api/locations` | Create location | ✓ | inventory:create |
| GET | `/api/locations/:id/inventory` | Get inventory at location | ✓ | inventory:read |
| POST | `/api/locations/:id/putaway` | Suggest putaway location | ✓ | inventory:move |

#### TMS - Terminal Management

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| GET | `/api/yard/blocks` | List yard blocks | ✓ | yard:read |
| POST | `/api/yard/blocks` | Create block | ✓ | yard:create |
| GET | `/api/yard/blocks/:id` | Get block details | ✓ | yard:read |
| GET | `/api/yard/slots` | List yard slots | ✓ | yard:read |
| POST | `/api/yard/slots` | Create slot | ✓ | yard:create |
| GET | `/api/yard/slots/:id` | Get slot details | ✓ | yard:read |
| PATCH | `/api/yard/slots/:id/assign` | Assign container | ✓ | yard:update |
| GET | `/api/gate-passes` | List gate passes | ✓ | gate:read |
| POST | `/api/gate-passes` | Create gate pass | ✓ | gate:create |
| GET | `/api/gate-passes/:id` | Get pass details | ✓ | gate:read |
| POST | `/api/gate-passes/:id/approve` | Approve gate pass | ✓ | gate:approve |
| POST | `/api/gate-passes/:id/gate-in` | Record gate-in | ✓ | gate:process |
| POST | `/api/gate-passes/:id/gate-out` | Record gate-out | ✓ | gate:process |
| GET | `/api/rail-operations` | List rail manifests | ✓ | rail:read |
| POST | `/api/rail-operations` | Import KTMB manifest | ✓ | rail:create |
| POST | `/api/rail-operations/:id/confirm` | Confirm rail departure | ✓ | rail:update |

#### FMS - Finance Management

| Method | Endpoint | Description | Auth | Permissions |
|--------|----------|-------------|------|-------------|
| GET | `/api/customers` | List customers (AR) | ✓ | customers:read |
| POST | `/api/customers` | Create customer | ✓ | customers:create |
| GET | `/api/customers/:id` | Get customer details | ✓ | customers:read |
| PATCH | `/api/customers/:id` | Update customer | ✓ | customers:update |
| GET | `/api/customers/:id/invoices` | Get customer invoices | ✓ | invoices:read |
| GET | `/api/vendors` | List vendors (AP) | ✓ | vendors:read |
| POST | `/api/vendors` | Create vendor | ✓ | vendors:create |
| GET | `/api/invoices` | List invoices | ✓ | invoices:read |
| POST | `/api/invoices` | Create invoice | ✓ | invoices:create |
| GET | `/api/invoices/:id` | Get invoice details | ✓ | invoices:read |
| PATCH | `/api/invoices/:id` | Update invoice | ✓ | invoices:update |
| POST | `/api/invoices/:id/submit-einvoice` | Submit to IRBM | ✓ | invoices:einvoice |
| POST | `/api/invoices/:id/void` | Void invoice | ✓ | invoices:void |
| GET | `/api/invoices/:id/payments` | Get invoice payments | ✓ | payments:read |
| GET | `/api/payments` | List all payments | ✓ | payments:read |
| POST | `/api/payments` | Record payment | ✓ | payments:create |
| POST | `/api/payments/:id/allocate` | Allocate to invoices | ✓ | payments:apply |
| GET | `/api/accounts` | List GL accounts | ✓ | accounts:read |
| POST | `/api/accounts` | Create account | ✓ | accounts:create |
| GET | `/api/accounts/:id/entries` | Get account entries | ✓ | journals:read |
| GET | `/api/journal-entries` | List journal entries | ✓ | journals:read |
| POST | `/api/journal-entries` | Create journal entry | ✓ | journals:post |
| POST | `/api/journal-entries/:id/post` | Post to GL | ✓ | journals:post |
| GET | `/api/fixed-assets` | List fixed assets | ✓ | assets:read |
| POST | `/api/fixed-assets` | Create asset | ✓ | assets:create |
| GET | `/api/fixed-assets/:id` | Get asset details | ✓ | assets:read |
| POST | `/api/fixed-assets/:id/depreciate` | Run depreciation | ✓ | assets:update |

#### System/Core Endpoints

| Method | Endpoint | Description | Auth | Notes |
|--------|----------|-------------|------|-------|
| GET | `/api/health` | Health check | ✗ | System status |
| GET | `/api/health/db` | Database health | ✗ | DB connectivity |
| GET | `/api/health/redis` | Redis health | ✗ | Cache connectivity |
| POST | `/api/auth/login` | User login | Partial | MFA if enabled |
| POST | `/api/auth/logout` | User logout | ✓ | Invalidate session |
| POST | `/api/auth/refresh` | Refresh JWT | ✓ | Extend session |
| GET | `/api/auth/session` | Get session | ✓ | Current user info |
| GET | `/api/users` | List users | ✓ | admin:users |
| POST | `/api/users` | Create user | ✓ | admin:users |
| GET | `/api/users/:id` | Get user | ✓ | Own record or admin |
| PATCH | `/api/users/:id` | Update user | ✓ | admin:users |
| GET | `/api/branches` | List branches | ✓ | Any authenticated |

**Total: 80+ API endpoints across all modules**

### 5.4 Query Parameters Reference

#### Common Parameters (All List Endpoints)

| Parameter | Type | Default | Description | Example |
|-----------|------|---------|-------------|---------|
| `search` | string | - | Full-text search across searchable fields | `?search=ABC123` |
| `limit` | number | 20 | Page size (max 100) | `?limit=50` |
| `offset` | number | 0 | Pagination offset | `?offset=100` |
| `sort` | string | createdAt | Sort field | `?sort=status` |
| `order` | enum | desc | Sort direction | `?order=asc` |

#### Filter Parameters (Resource-Specific)

| Parameter | Type | Applies To | Description | Example |
|-----------|------|------------|-------------|---------|
| `status` | enum | Jobs, Shipments, Invoices | Filter by status | `?status=PENDING` |
| `branchId` | string | Most resources | Filter by branch | `?branchId=clyd123...` |
| `from` | date | Date ranges | Start date filter | `?from=2026-01-01` |
| `to` | date | Date ranges | End date filter | `?to=2026-02-01` |
| `customerId` | string | AR resources | Filter by customer | `?customerId=clyd456...` |
| `vehicleId` | string | Jobs | Filter by vehicle | `?vehicleId=clyd789...` |
| `driverId` | string | Jobs | Filter by driver | `?driverId=clydabc...` |
| `warehouseId` | string | Inventory | Filter by warehouse | `?warehouseId=clyddef...` |
| `containerNo` | string | Containers | Filter by container number | `?containerNo=ABCU1234567` |
| `invoiceType` | enum | Invoices | AR, AP, or CN | `?invoiceType=AR` |
| `isOverdue` | boolean | Invoices | Overdue only | `?isOverdue=true` |

---

## 6. Data Model Reference

### 6.1 Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CORE ENTITY LAYER                               │
│                    (Shared across all modules)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────────────┐  │
│  │    Branch    │◄────►│     User     │◄────►│   Session (JWT)      │  │
│  │  (6 records) │      │ (200+ users) │      │                      │  │
│  └──────┬───────┘      └──────┬───────┘      └──────────────────────┘  │
│         │                     │                                         │
│         │              ┌──────┴───────┐                                 │
│         │              │              │                                 │
│         ▼              ▼              ▼                                 │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────┐                      │
│  │   Customer   │  │  Driver  │  │    AuditLog  │                      │
│  │   (Party)    │  │(User ext)│  │  (Immutable) │                      │
│  └──────┬───────┘  └──────────┘  └──────────────┘                      │
│         │                                                               │
│  ┌──────┴───────┐      ┌──────────────┐      ┌──────────────┐         │
│  │    Vendor    │      │   Document   │      │   Setting    │         │
│  │   (Party)    │      │(File Attach) │      │  (Config)    │         │
│  └──────────────┘      └──────────────┘      └──────────────┘         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                      MODULE-SPECIFIC ENTITIES                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  HMS (Haulage)         FFS (Forwarding)        WMS (Warehouse)         │
│  ═══════════════       ═════════════════       ════════════════         │
│  ┌──────────────┐      ┌──────────────┐       ┌──────────────┐         │
│  │   Vehicle    │      │   Shipment   │◄─────►│  Warehouse   │         │
│  │ (Fleet Mgmt) │      │  (Booking)   │       │   (Master)   │         │
│  └──────┬───────┘      └──────┬───────┘       └──────┬───────┘         │
│         │                     │                      │                  │
│  ┌──────┴───────┐      ┌──────┴───────┐      ┌──────┴───────┐         │
│  │HaulageJob    │      │   Container  │◄────►│   Location   │         │
│  │(Job Tracking)│      │(Shared w/TMS)│      │ (Bin/Rack)   │         │
│  └──────┬───────┘      └──────┬───────┘      └──────┬───────┘         │
│         │                     │                      │                  │
│  ┌──────┴───────┐      ┌──────┴───────┐      ┌──────┴───────┐         │
│  │   Trailer    │      │ CustomsEntry │      │   Inventory  │         │
│  │   (Registry) │      │(Declaration) │      │(Stock Level) │         │
│  └──────────────┘      └──────────────┘      └──────┬───────┘         │
│                                                      │                  │
│  ┌──────────────┐      ┌──────────────┐      ┌──────┴───────┐         │
│  │MaintenanceRec│      │   Document   │      │  InvMovement │         │
│  │(Service Hist)│      │   (Files)    │      │(Transaction) │         │
│  └──────────────┘      └──────────────┘      └──────────────┘         │
│                                                                         │
│  TMS (Terminal)        FMS (Finance)                                    │
│  ═══════════════       ═════════════                                    │
│  ┌──────────────┐      ┌──────────────┐                                │
│  │   YardBlock  │      │   Customer   │◄─── AR Master (extends Party) │
│  │   (Layout)   │      │   (AR)       │                                │
│  └──────┬───────┘      └──────┬───────┘                                │
│         │                     │                                         │
│  ┌──────┴───────┐      ┌──────┴───────┐      ┌──────────────┐         │
│  │   YardSlot   │      │   Invoice    │◄────►│ InvoiceItem  │         │
│  │(Container    │      │   (Billing)  │      │  (Line Item) │         │
│  │  Position)   │      └──────┬───────┘      └──────────────┘         │
│  └──────┬───────┘             │                                        │
│         │              ┌──────┴───────┐      ┌──────────────┐         │
│  ┌──────┴───────┐      │   Payment    │      │   Vendor     │         │
│  │   GatePass   │      │ (Receipts)   │      │   (AP)       │         │
│  │ (Gate Op)    │      └──────┬───────┘      └──────┬───────┘         │
│  └──────┬───────┘             │                      │                  │
│         │              ┌──────┴───────┐      ┌──────┴───────┐         │
│  ┌──────┴───────┐      │    Account   │      │     Bill     │         │
│  │ RailOperation│      │  (GL CoA)    │      │   (AP Inv)   │         │
│  │(KTMB Import) │      └──────┬───────┘      └──────────────┘         │
│  └──────────────┘             │                                        │
│                        ┌──────┴───────┐      ┌──────────────┐         │
│                        │ JournalEntry │◄────►│ JournalLine  │         │
│                        │   (GL Txn)   │      │  (Entry Dtl) │         │
│                        └──────┬───────┘      └──────────────┘         │
│                               │                                         │
│                        ┌──────┴───────┐      ┌──────────────┐         │
│                        │  FixedAsset  │      │AssetMovement │         │
│                        │   (Register) │      │(Trans/Deprec)│         │
│                        └──────────────┘      └──────────────┘         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Prisma Schema Reference

#### Core Tables

| Model | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `Branch` | Multi-tenancy | `code`, `type`, `isActive`, `address` | Has many Users, Customers, etc. |
| `User` | Authentication | `email`, `password`, `role`, `mfaEnabled`, `mfaSecret` | Belongs to Branch, has Sessions |
| `Session` | Token storage | `sessionToken`, `expires`, `userId` | Belongs to User |
| `Customer` | AR Party | `code`, `name`, `tin`, `creditLimit`, `creditTerms` | Extends Party, has Invoices, Shipments |
| `Vendor` | AP Party | `code`, `name`, `tin`, `paymentTerms` | Extends Party, has Bills |
| `AuditLog` | Compliance | `action`, `entityType`, `entityId`, `oldValues`, `newValues`, `userId`, `ipAddress` | Immutable records |
| `Document` | File attachments | `filename`, `path`, `mimeType`, `size`, `entityType`, `entityId` | Polymorphic attachment |
| `Setting` | Configuration | `key`, `value`, `category`, `branchId` | Branch-scoped settings |

#### HMS Tables

| Model | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `Vehicle` | Fleet registry | `registrationNo`, `type`, `capacity`, `branchId` | Has HaulageJobs, MaintenanceRecords |
| `Driver` | Driver profiles | `licenseNo`, `licenseExpiry`, `userId` | Belongs to User, has HaulageJobs |
| `Trailer` | Trailer registry | `trailerNo`, `type`, `permitExpiry` | Has HaulageJobs |
| `HaulageJob` | Job tracking | `jobNo`, `status`, `pickupLocation`, `deliveryLocation`, `containerNo` | Belongs to Vehicle, Driver, Trailer, Customer |
| `MaintenanceRecord` | Service history | `serviceDate`, `type`, `cost`, `nextServiceDue` | Belongs to Vehicle |
| `DriverIncentive` | Payroll calc | `period`, `amount`, `formulaUsed` | Belongs to Driver |

#### FFS Tables

| Model | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `Shipment` | Freight booking | `blNumber`, `status`, `mode`, `origin`, `destination`, `etd`, `eta` | Belongs to Shipper, Consignee, has Containers |
| `Container` | Container details | `containerNo`, `size`, `type`, `sealNo`, `weight` | Belongs to Shipment, shared with TMS |
| `CustomsEntry` | Customs declarations | `entryNo`, `type`, `status`, `dutyAmount` | Belongs to Shipment |
| `RateSheet` | Freight pricing | `carrier`, `origin`, `destination`, `rate`, `validFrom`, `validTo` | Branch-scoped |
| `Document` | Trade docs | `type` (BL, AWB, CO, etc.), `referenceNo` | Belongs to Shipment |

#### WMS Tables

| Model | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `Warehouse` | Facility master | `code`, `name`, `address`, `capacity` | Belongs to Branch, has Locations |
| `WarehouseLocation` | Bin/rack locations | `zone`, `aisle`, `rack`, `bin`, `type` | Belongs to Warehouse, has Inventory |
| `Inventory` | Stock records | `sku`, `description`, `quantity`, `uom`, `status` | Belongs to Location, has Movements |
| `InventoryMovement` | Transaction log | `type`, `quantity`, `reference`, `reason` | Belongs to Inventory |
| `ReceivingOrder` | ASN/GRN | `roNumber`, `status`, `supplier`, `expectedDate` | Has line items |
| `PickingOrder` | Pick lists | `poNumber`, `status`, `priority` | Has line items with locations |

#### TMS Tables

| Model | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `YardBlock` | Terminal layout | `code`, `zone`, `rowCount`, `slotCount` | Has YardSlots |
| `YardSlot` | Container positions | `row`, `slot`, `status`, `containerId` | Belongs to YardBlock, may have Container |
| `GatePass` | Gate operations | `passNo`, `type`, `status`, `containerNo`, `vehicleNo` | Belongs to Vendor/Customer |
| `RailOperation` | KTMB manifests | `manifestNo`, `trainNo`, `origin`, `destination` | Has containers |
| `WeighbridgeRecord` | Weight capture | `grossWeight`, `tareWeight`, `netWeight`, `timestamp` | Belongs to GatePass |

#### FMS Tables

| Model | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `Invoice` | Billing | `invoiceNo`, `type` (AR/AP/CN), `status`, `total`, `tax`, `grandTotal` | Belongs to Customer/Vendor, has Items, Payments |
| `InvoiceItem` | Line items | `description`, `quantity`, `rate`, `amount` | Belongs to Invoice |
| `Payment` | Receipts | `paymentNo`, `amount`, `method`, `reference` | Allocated to Invoices |
| `PaymentAllocation` | Payment distribution | `amount`, `invoiceId` | Links Payment to Invoice |
| `Account` | GL Chart of Accounts | `code`, `name`, `type`, `category`, `isActive` | Has JournalLines |
| `JournalEntry` | GL transactions | `entryNo`, `date`, `reference`, `totalDebit`, `totalCredit` | Has JournalLines |
| `JournalLine` | Entry details | `description`, `debit`, `credit` | Belongs to JournalEntry and Account |
| `FixedAsset` | Asset register | `assetNo`, `description`, `acquisitionCost`, `acquisitionDate` | Has depreciations |
| `AssetDepreciation` | Depreciation history | `period`, `amount`, `accumulated`, `nbv` | Belongs to FixedAsset |
| `TaxCode` | Tax configuration | `code`, `rate`, `type` (SST/GST) | Used in Invoices |

### 6.3 Enum Reference

| Enum | Values | Usage |
|------|--------|-------|
| `UserRole` | `SUPER_ADMIN`, `BRANCH_ADMIN`, `MANAGER`, `SUPERVISOR`, `OPERATOR`, `READ_ONLY`, `DRIVER` | RBAC role assignment |
| `BranchType` | `HEADQUARTERS`, `PORT`, `WAREHOUSE`, `TERMINAL` | Branch categorization |
| `HaulageJobStatus` | `PENDING`, `ASSIGNED`, `DISPATCHED`, `AT_PICKUP`, `LOADED`, `IN_TRANSIT`, `AT_DELIVERY`, `DELIVERED`, `COMPLETED`, `CANCELLED` | Job tracking |
| `VehicleType` | `PRIME_MOVER`, `LORRY`, `TRAILER`, `VAN` | Fleet classification |
| `ShipmentStatus` | `BOOKED`, `CONFIRMED`, `IN_TRANSIT`, `ARRIVED`, `CUSTOMS_HOLD`, `CLEARED`, `DELIVERED`, `COMPLETED`, `CANCELLED` | Freight tracking |
| `ShipmentMode` | `SEA`, `AIR`, `LAND`, `MULTIMODAL` | Transport mode |
| `ContainerSize` | `TWENTY_FT`, `FORTY_FT`, `FORTY_FT_HC`, `FORTY_FIVE_FT` | Container types |
| `ContainerType` | `DRY`, `REEFER`, `OPEN_TOP`, `FLAT_RACK`, `TANK` | Container category |
| `InventoryStatus` | `AVAILABLE`, `RESERVED`, `QUARANTINE`, `DAMAGED`, `DISPOSED` | Stock availability |
| `MovementType` | `RECEIPT`, `ISSUE`, `TRANSFER_IN`, `TRANSFER_OUT`, `ADJUSTMENT`, `RETURN`, `CYCLE_COUNT` | Inventory transactions |
| `YardZone` | `IMPORT`, `EXPORT`, `EMPTY`, `REEFER`, `DANGEROUS` | Terminal zones |
| `GatePassType` | `GATE_IN`, `GATE_OUT` | Gate operation direction |
| `GatePassStatus` | `PENDING`, `APPROVED`, `REJECTED`, `COMPLETED` | Gate pass workflow |
| `InvoiceType` | `AR`, `AP`, `CREDIT_NOTE`, `DEBIT_NOTE` | Billing type |
| `InvoiceStatus` | `DRAFT`, `SENT`, `PARTIAL`, `PAID`, `OVERDUE`, `VOID`, `CANCELLED`, `WRITTEN_OFF` | Invoice lifecycle |
| `EInvoiceStatus` | `PENDING`, `VALIDATED`, `REJECTED`, `CANCELLED` | IRBM compliance |
| `PaymentMethod` | `CASH`, `CHEQUE`, `BANK_TRANSFER`, `CREDIT_CARD`, `FPX`, `ONLINE_BANKING` | Payment types |
| `PaymentStatus` | `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED` | Payment state |
| `AccountType` | `ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, `EXPENSE` | Chart of accounts |
| `JournalEntryStatus` | `DRAFT`, `POSTED`, `REVERSED` | GL entry state |
| `FixedAssetStatus` | `ACTIVE`, `DISPOSED`, `WRITTEN_OFF` | Asset lifecycle |
| `DepreciationMethod` | `STRAIGHT_LINE`, `REDUCING_BALANCE` | Asset depreciation |
| `AuditAction` | `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`, `EXPORT` | Audit log types |
| `DocumentType` | `INVOICE`, `RECEIPT`, `PO`, `GRN`, `DO`, `BL`, `AWB`, `CUSTOMS`, `PHOTO`, `OTHER` | File categorization |

**Total: 40+ enums for type safety**

---

## 7. Security & Compliance

### 6.1 Security Framework

| Layer | Control | Implementation |
|-------|---------|----------------|
| **Network** | Firewall, DDoS Protection | WAF, VPC isolation, intrusion detection |
| **Application** | Authentication, Authorization | OAuth 2.0, JWT tokens, RBAC (50+ permissions) |
| **Data** | Encryption | AES-256 at rest, TLS 1.3 in transit |
| **Access** | MFA, Password Policy | TOTP/SMS, NIST 800-63B compliant |
| **Audit** | Logging, Monitoring | Immutable logs, SIEM integration, real-time alerts |
| **Physical** | Data Center Security | Awan Kita sovereign cloud, Malaysia-only data |

### 6.2 Authentication & Authorization

**Multi-Factor Authentication (MFA):**
- TOTP (Time-based One-Time Password) via authenticator apps (Google Authenticator, Authy)
- SMS OTP fallback for recovery
- Hardware token support for privileged accounts
- MFA enforced for: SUPER_ADMIN, BRANCH_ADMIN, and all finance users

**Role-Based Access Control (RBAC):**
- Granular permissions (50+ distinct permissions)
- Role hierarchies with inheritance
- Data-level permissions: Branch, department, customer, shipment restrictions
- Permission caching in Redis for performance

**Zero-Trust Architecture:**
- Behavioral biometrics (typing patterns, device posture)
- Continuous authentication via session rotation
- Anomalous access detection with auto-suspension

### 6.3 RBAC Implementation Details

#### Role Hierarchy

```
SUPER_ADMIN
    └── BRANCH_ADMIN
            ├── MANAGER
            │       ├── SUPERVISOR
            │       │       └── OPERATOR
            │       └── READ_ONLY
            └── DRIVER (limited HMS access only)
```

**Role Definitions:**

| Role | Scope | Description |
|------|-------|-------------|
| SUPER_ADMIN | System-wide | Full access to all branches and functions |
| BRANCH_ADMIN | Single branch | Branch manager with user management |
| MANAGER | Module | Department manager (HMS, FFS, etc.) |
| SUPERVISOR | Module | Team lead with approval authority |
| OPERATOR | Module | Standard user, creates/updates records |
| READ_ONLY | Module | View access only, no modifications |
| DRIVER | Self | Mobile app access to own jobs only |

#### Permission System

Permissions are stored as string arrays in the `User.permissions` field and checked via middleware:

| Permission | Module | Description | Default Roles |
|------------|--------|-------------|---------------|
| `jobs:create` | HMS | Create haulage jobs | MANAGER, SUPERVISOR, OPERATOR |
| `jobs:read` | HMS | View jobs | All except DRIVER (own only) |
| `jobs:update` | HMS | Update job details | MANAGER, SUPERVISOR, OPERATOR |
| `jobs:delete` | HMS | Delete/cancel jobs | MANAGER, SUPERVISOR |
| `jobs:assign` | HMS | Assign drivers/vehicles | MANAGER, SUPERVISOR |
| `vehicles:create` | HMS | Add vehicles to fleet | MANAGER |
| `vehicles:read` | HMS | View vehicle registry | All |
| `vehicles:update` | HMS | Update vehicle info | MANAGER, SUPERVISOR |
| `drivers:create` | HMS | Add new drivers | MANAGER |
| `drivers:read` | HMS | View driver profiles | All |
| `shipments:create` | FFS | Create freight bookings | MANAGER, SUPERVISOR, OPERATOR |
| `shipments:read` | FFS | View shipments | All |
| `shipments:update` | FFS | Update shipment | MANAGER, SUPERVISOR, OPERATOR |
| `shipments:delete` | FFS | Cancel shipment | MANAGER, SUPERVISOR |
| `customs:create` | FFS | Create customs entries | MANAGER, SUPERVISOR |
| `customs:read` | FFS | View customs data | All |
| `customs:update` | FFS | Update customs entry | MANAGER, SUPERVISOR |
| `rates:create` | FFS | Manage rate sheets | MANAGER |
| `rates:read` | FFS | View rates | All |
| `inventory:create` | WMS | Create stock records | MANAGER, SUPERVISOR |
| `inventory:read` | WMS | View inventory | All |
| `inventory:update` | WMS | Update stock | MANAGER, SUPERVISOR, OPERATOR |
| `inventory:move` | WMS | Record movements | MANAGER, SUPERVISOR, OPERATOR |
| `inventory:adjust` | WMS | Cycle count adjustments | MANAGER, SUPERVISOR |
| `yard:read` | TMS | View yard layout | All |
| `yard:create` | TMS | Modify yard structure | MANAGER |
| `yard:update` | TMS | Update container positions | MANAGER, SUPERVISOR, OPERATOR |
| `gate:create` | TMS | Create gate passes | MANAGER, SUPERVISOR, OPERATOR |
| `gate:read` | TMS | View gate passes | All |
| `gate:approve` | TMS | Approve gate passes | MANAGER, SUPERVISOR |
| `gate:process` | TMS | Process gate-in/out | MANAGER, SUPERVISOR, OPERATOR |
| `rail:create` | TMS | Import rail manifests | MANAGER, SUPERVISOR |
| `rail:read` | TMS | View rail operations | All |
| `rail:update` | TMS | Confirm rail movements | MANAGER, SUPERVISOR |
| `customers:create` | FMS | Create customer master | MANAGER, SUPERVISOR |
| `customers:read` | FMS | View customer data | All |
| `customers:update` | FMS | Update customer | MANAGER, SUPERVISOR |
| `vendors:create` | FMS | Create vendor master | MANAGER, SUPERVISOR |
| `vendors:read` | FMS | View vendor data | All |
| `invoices:create` | FMS | Create invoices | MANAGER, SUPERVISOR, OPERATOR |
| `invoices:read` | FMS | View invoices | All |
| `invoices:update` | FMS | Update invoices | MANAGER, SUPERVISOR |
| `invoices:delete` | FMS | Delete draft invoices | MANAGER, SUPERVISOR |
| `invoices:void` | FMS | Void posted invoices | MANAGER |
| `invoices:einvoice` | FMS | Submit to IRBM | MANAGER, SUPERVISOR |
| `payments:create` | FMS | Record payments | MANAGER, SUPERVISOR, OPERATOR |
| `payments:read` | FMS | View payments | All |
| `payments:apply` | FMS | Allocate payments | MANAGER, SUPERVISOR |
| `accounts:create` | FMS | Create GL accounts | MANAGER |
| `accounts:read` | FMS | View chart of accounts | All |
| `journals:post` | FMS | Post journal entries | MANAGER, SUPERVISOR |
| `journals:read` | FMS | View GL transactions | All |
| `assets:create` | FMS | Create fixed assets | MANAGER, SUPERVISOR |
| `assets:read` | FMS | View asset register | All |
| `assets:update` | FMS | Update assets, depreciate | MANAGER, SUPERVISOR |
| `reports:view` | All | View reports/dashboards | All |
| `admin:users` | System | User management | SUPER_ADMIN, BRANCH_ADMIN |
| `admin:branches` | System | Branch configuration | SUPER_ADMIN |
| `admin:settings` | System | System settings | SUPER_ADMIN |

**Total: 50+ distinct permissions**

#### Permission Assignment by Role

| Role | Default Permissions | Data Scope |
|------|---------------------|------------|
| SUPER_ADMIN | `*` (all permissions) | All branches, all records |
| BRANCH_ADMIN | All permissions for assigned modules | Assigned branch only |
| MANAGER | Full CRUD within module | Assigned branch + department |
| SUPERVISOR | Read + most write operations | Assigned branch + team records |
| OPERATOR | Create/read/update own records | Own records + branch data |
| READ_ONLY | `*:read` only | Assigned branch |
| DRIVER | `jobs:read` (own only) | Assigned jobs only |

#### MFA Implementation

```typescript
// Authentication flow with MFA
async function authenticateUser(credentials: Credentials) {
  // 1. Verify username/password
  const user = await verifyPassword(credentials);
  if (!user) throw new AuthError('Invalid credentials');
  
  // 2. Check if MFA is enabled
  if (user.mfaEnabled) {
    // 3. Verify TOTP code
    const valid = verifyTOTP(user.mfaSecret, credentials.mfaCode);
    if (!valid) throw new AuthError('Invalid MFA code');
  }
  
  // 4. Generate JWT session
  const session = await createSession(user);
  return { user, session };
}

// MFA setup for users
async function setupMFA(userId: string) {
  const secret = generateTOTPSecret();
  const qrCode = generateQRCode(secret, userId);
  await saveMFAsecret(userId, secret, { verified: false });
  return { qrCode, backupCodes: generateBackupCodes() };
}
```

**MFA Enforcement Rules:**
- Mandatory for SUPER_ADMIN and BRANCH_ADMIN roles
- Mandatory for all FMS users (financial data access)
- Optional but recommended for MANAGER roles
- Recovery codes generated on setup (10 single-use codes)
- Account lockout after 5 failed MFA attempts

### 6.4 Compliance Requirements

| Regulation | Requirement | Implementation |
|------------|-------------|----------------|
| **IRBM e-Invoicing** | MyInvois API integration | Automatic validation and submission |
| **APAD** | Pre-arrival booking, TAT tracking | TMS module compliance |
| **MFRS** | Accounting standards | FMS module compliant |
| **SST/GST** | Tax calculation and reporting | Automated tax engine |
| **Personal Data Protection (PDPA)** | Data privacy | Encryption, consent management, data retention |
| **Awan Kita** | Sovereign cloud, local data | Malaysia-only data centers, local encryption keys |

### 6.5 VAPT Compliance

| Finding Level | Count | Status |
|---------------|-------|--------|
| Critical | 0 | ✅ Compliant |
| High | 0 | ✅ Compliant |
| Medium | 3 | Remediated with compensating controls |
| Low | 5 | Documented, scheduled for patching |

**Certification:** CREST-accredited penetration testing completed annually

### 6.6 Audit & Logging

- **Immutable Audit Logs:** Tamper-resistant database tables
- **Captured Data:** Before/after values, user ID, timestamp, IP address
- **Retention:** 7 years for financial/compliance data
- **Access:** Real-time inquiry screens with export capability
- **Alerts:** Real-time notifications for sensitive operations

---

## 8. User Stories by Module

### 7.1 HMS User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| HMS-US-001 | Fleet Manager | View real-time fleet utilization dashboard | I can optimize asset deployment | P0 |
| HMS-US-002 | Dispatcher | Assign jobs to drivers with drag-and-drop | I can respond quickly to urgent bookings | P0 |
| HMS-US-003 | Driver | Receive digital job cards on my mobile | I have all job details at my fingertips | P0 |
| HMS-US-004 | Driver | Update job status with one tap | I can minimize time spent on paperwork | P0 |
| HMS-US-005 | Customer | Track my container location on a map | I know when to expect delivery | P0 |
| HMS-US-006 | Finance User | Generate invoices automatically from completed jobs | I can bill customers promptly | P0 |
| HMS-US-007 | Credit Controller | See customers approaching credit limits | I can take proactive collection action | P0 |
| HMS-US-008 | Maintenance Manager | Receive predictive maintenance alerts | I can schedule repairs before breakdowns | P1 |
| HMS-US-009 | HR/Payroll | Calculate driver incentives automatically | I ensure accurate and timely payments | P0 |
| HMS-US-010 | Operations Manager | View driver performance analytics | I can identify training needs | P1 |

### 7.2 FFS User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| FFS-US-001 | Freight Coordinator | Create shipment bookings online | I can capture customer requirements accurately | P0 |
| FFS-US-002 | Freight Coordinator | Track multi-modal shipments in one view | I have complete visibility | P0 |
| FFS-US-003 | Customs Broker | Submit declarations to uCustoms | I can clear shipments efficiently | P0 |
| FFS-US-004 | Customer | Book freight services online 24/7 | I don't need to wait for business hours | P0 |
| FFS-US-005 | Customer | Upload shipping documents | I can provide required paperwork easily | P0 |
| FFS-US-006 | Sales Manager | View revenue by trade lane | I can identify growth opportunities | P0 |
| FFS-US-007 | Operations Manager | See predicted shipment delays | I can proactively notify customers | P1 |
| FFS-US-008 | Finance User | Generate freight invoices with multi-party splits | Billing reflects complex agreements | P0 |
| FFS-US-009 | Pricing Manager | Manage rate sheets with validity periods | I can maintain accurate pricing | P0 |
| FFS-US-010 | Manager | Analyze tender win/loss rates | I can improve bid success | P1 |

### 7.3 WMS User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| WMS-US-001 | Warehouse Operator | Scan barcodes to receive goods | I can process inbound quickly and accurately | P0 |
| WMS-US-002 | Warehouse Operator | View put-away location suggestions | I can store items efficiently | P0 |
| WMS-US-003 | Warehouse Operator | Follow optimized pick paths | I minimize travel time | P0 |
| WMS-US-004 | Warehouse Supervisor | View real-time inventory accuracy | I can identify discrepancies early | P0 |
| WMS-US-005 | Inventory Manager | Schedule cycle counts | I maintain high inventory accuracy | P0 |
| WMS-US-006 | Customer Service | Check stock availability instantly | I can respond to customer queries | P0 |
| WMS-US-007 | 3PL Customer | View their inventory online | They have self-service visibility | P0 |
| WMS-US-008 | Finance User | Bill storage based on occupied space | Revenue matches actual usage | P0 |
| WMS-US-009 | Operations Manager | View warehouse productivity metrics | I can optimize labor allocation | P0 |
| WMS-US-010 | Returns Clerk | Process RMAs with condition assessment | Returns are handled efficiently | P0 |

### 7.4 TMS User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| TMS-US-001 | Yard Planner | View digital yard map with container locations | I can optimize container placement | P0 |
| TMS-US-002 | Gate Officer | Process container gate-in quickly | I can handle high volumes at peak | P0 |
| TMS-US-003 | Gate Officer | Validate container release authorization | I prevent unauthorized removals | P0 |
| TMS-US-004 | Rail Coordinator | Upload KTMB manifests in batch | Rail operations are efficient | P0 |
| TMS-US-005 | Customer | Book container slots online | I can plan haulage in advance | P0 |
| TMS-US-006 | Haulier | Submit pre-arrival booking | I comply with APAD requirements | P0 |
| TMS-US-007 | Maintenance Staff | Record container damage with photos | Claims are documented properly | P0 |
| TMS-US-008 | Terminal Manager | View yard utilization analytics | I can plan capacity expansion | P0 |
| TMS-US-009 | Finance User | Calculate storage charges automatically | Billing is accurate and timely | P0 |
| TMS-US-010 | Compliance Officer | Generate APAD compliance reports | Regulatory requirements are met | P0 |

### 7.5 FMS User Stories

| ID | As a... | I want to... | So that... | Priority |
|----|---------|--------------|------------|----------|
| FMS-US-001 | AR Clerk | Generate invoices with IRBM validation | Compliance with e-Invoicing regulations | P0 |
| FMS-US-002 | AR Clerk | Apply payments with suggestive matching | Reconciliation is faster | P0 |
| FMS-US-003 | Credit Controller | Block overdue customers automatically | Credit risk is minimized | P0 |
| FMS-US-004 | AP Clerk | Process three-way matched invoices | Only valid invoices are paid | P0 |
| FMS-US-005 | Accountant | Post journals with template support | Recurring entries are efficient | P0 |
| FMS-US-006 | Financial Controller | View consolidated group reports | I have complete financial visibility | P0 |
| FMS-US-007 | CFO | View 90-day cash flow forecast | I can manage working capital | P1 |
| FMS-US-008 | Asset Manager | Track fixed assets with QR codes | Physical verification is easy | P0 |
| FMS-US-009 | Tax Accountant | Generate SST/GST returns | Statutory compliance is maintained | P0 |
| FMS-US-010 | Auditor | Export complete audit trails | Audit preparation is streamlined | P0 |

---

## 8. Technical Stack

### 8.1 Application Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend (Web)** | React.js | 18.x | Responsive web interface |
| **Frontend (Mobile)** | React Native | 0.72+ | iOS/Android native apps |
| **Backend API** | Node.js / Express | 18.x LTS | REST API services |
| **Microservices** | Python / FastAPI | 3.11+ | AI/ML services |
| **Database** | PostgreSQL | 15+ | Primary data store |
| **Cache** | Redis | 7+ | Session, caching, pub/sub |
| **Message Queue** | RabbitMQ | 3.12+ | Async processing, ESB |
| **Search** | Elasticsearch | 8.x | Full-text search, analytics |
| **File Storage** | MinIO | Latest | S3-compatible object storage |

### 8.2 Infrastructure Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Container Orchestration** | Kubernetes | Container management, auto-scaling |
| **Service Mesh** | Istio | Traffic management, observability |
| **API Gateway** | Kong | Routing, auth, rate limiting |
| **Load Balancer** | NGINX | Traffic distribution |
| **Monitoring** | Prometheus + Grafana | Metrics, dashboards |
| **Logging** | ELK Stack | Centralized logging |
| **CI/CD** | GitLab CI / ArgoCD | Build, test, deployment |
| **IaC** | Terraform | Infrastructure provisioning |

### 8.3 Development Standards

- **Code Quality:** ESLint, Prettier, SonarQube
- **Testing:** Jest (unit), Cypress (E2E), Postman (API)
- **Documentation:** OpenAPI/Swagger for APIs, Storybook for UI
- **Version Control:** Git with trunk-based development

---

## 9. Deployment Model

### 9.1 Awan Kita Sovereign Cloud

All systems deployed on **Awan Kita** sovereign cloud infrastructure ensuring:

| Requirement | Implementation |
|-------------|----------------|
| Data Residency | 100% Malaysia-based data centers |
| Encryption Keys | Managed within Malaysia |
| Compliance | Meets Malaysian government cloud requirements |
| Network Isolation | VPC with private subnets |
| Availability | 99.9% uptime SLA |

### 9.2 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRODUCTION ENVIRONMENT                      │
│                              Awan Kita Cloud                        │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────────────────┐  │
│  │   Web Tier    │  │   App Tier    │  │      Data Tier          │  │
│  │  (Kubernetes) │  │  (Kubernetes) │  │  (Managed Services)     │  │
│  │               │  │               │  │                         │  │
│  │  • React SPA  │  │  • Microsvcs  │  │  • PostgreSQL Cluster   │  │
│  │  • PWA        │  │  • API Gateway│  │  • Redis Cluster        │  │
│  │  • Static     │  │  • Workers    │  │  • RabbitMQ Cluster     │  │
│  │    Assets     │  │  • AI/ML      │  │  • Elasticsearch        │  │
│  │               │  │    Services   │  │  • Object Storage       │  │
│  └───────────────┘  └───────────────┘  └─────────────────────────┘  │
│         │                  │                      │                 │
│         └──────────────────┼──────────────────────┘                 │
│                            │                                        │
│                   ┌────────▼────────┐                               │
│                   │  Load Balancer  │                               │
│                   │   (WAF/DDOS)    │                               │
│                   └────────┬────────┘                               │
│                            │                                        │
│                         INTERNET                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### 9.3 Environment Strategy

| Environment | Purpose | Data |
|-------------|---------|------|
| Development | Feature development | Synthetic |
| Testing | QA, integration testing | Anonymized production |
| Staging | UAT, pre-production | Production mirror |
| Production | Live operations | Live data |
| DR | Disaster recovery | Async replication |

### 9.4 Backup & Disaster Recovery

| Metric | Target | Implementation |
|--------|--------|----------------|
| RTO (Recovery Time Objective) | < 4 hours | Hot standby in secondary AZ |
| RPO (Recovery Point Objective) | < 1 hour | Continuous replication |
| Backup Frequency | Daily full, hourly incremental | Automated with verification |
| Retention | 30 days online, 7 years archive | Tiered storage |
| DR Testing | Annual | Full failover drill |

---

## 10. Success Metrics

### 10.1 Key Performance Indicators (KPIs)

| Category | Metric | Baseline | Target | Measurement |
|----------|--------|----------|--------|-------------|
| **Operational** | On-time Delivery | 75% | 95% | Monthly |
| | Order Processing Time | 4 hours | < 1 hour | Weekly |
| | Invoice Generation Time | 3 days | Same day | Daily |
| **Financial** | DSO (Days Sales Outstanding) | 60 days | 45 days | Monthly |
| | Revenue Leakage Recovery | 0% | 3-5% | Quarterly |
| | Billing Accuracy | 92% | 99.5% | Monthly |
| **System** | System Uptime | N/A | 99.9% | Continuous |
| | User Adoption | N/A | >90% | Monthly |
| | Data Entry Reduction | N/A | 40% | Quarterly |
| **Customer** | Customer Satisfaction | 3.5/5 | 4.5/5 | Quarterly |
| | Customer Portal Usage | 0% | >70% | Monthly |

### 10.2 Project Success Criteria

| Criteria | Definition |
|----------|------------|
| On Time | Go-live within 8-10 weeks of project start |
| On Budget | Delivery within agreed contract value |
| Quality | 98%+ UAT pass rate on first attempt |
| Compliance | 100% of 129 features verified and accepted |
| Security | Zero high/critical VAPT findings |
| Adoption | >90% active user adoption within 30 days of go-live |

---

## 11. Definition of Done

### 11.1 Feature Definition of Done

A feature is considered **Done** when:

- [ ] Code developed and peer-reviewed
- [ ] Unit tests written with >80% coverage
- [ ] Integration tests passing
- [ ] Security review completed
- [ ] Documentation updated (user guide, technical docs)
- [ ] Deployed to staging environment
- [ ] UAT completed with sign-off
- [ ] Performance benchmarks met
- [ ] Accessibility standards met (WCAG 2.1 AA)

### 11.2 Sprint Definition of Done

A sprint is **Done** when:

- [ ] All committed features meet Definition of Done
- [ ] Regression tests passing
- [ ] Demo completed with stakeholders
- [ ] Sprint retrospective completed
- [ ] Known issues documented

### 11.3 Release Definition of Done

A release is **Done** when:

- [ ] All features tested and UAT signed off
- [ ] Security scan passed (zero critical/high)
- [ ] Performance testing passed
- [ ] Documentation complete and reviewed
- [ ] Training materials delivered
- [ ] Go-live checklist completed
- [ ] Rollback plan documented and tested
- [ ] Business sign-off obtained

### 11.4 Project Definition of Done

The project is **Done** when:

- [ ] All 129 features deployed and operational
- [ ] All 6 branches live on production
- [ ] Integration with all 3rd party systems verified
- [ ] IRBM e-Invoicing compliance certified
- [ ] APAD compliance verified (TMS)
- [ ] Security certification (VAPT) current
- [ ] Training completed for all users
- [ ] Documentation handed over
- [ ] Warranty period commenced
- [ ] Final acceptance signed by MMF

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

```
                    ┌─────────────┐
                    │     E2E     │  (Cypress/Playwright)
                    │  ~20 tests  │  Critical user flows
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

### 12.2 Test Categories

| Category | Tools | Coverage Target | Priority | Responsibility |
|----------|-------|-----------------|----------|----------------|
| **Unit Tests** | Jest, ts-jest | 80%+ | P0 | Developer |
| **API Integration** | Jest, Supertest | All endpoints | P0 | Developer + QA |
| **Component Tests** | React Testing Library | Shared components | P1 | Developer |
| **E2E Tests** | Cypress | Critical flows | P1 | QA |
| **Load Tests** | k6 / Artillery | 100 concurrent users | P1 | DevOps |
| **Security Tests** | OWASP ZAP | VAPT compliance | P0 | Security Team |
| **Accessibility** | axe-core | WCAG 2.1 AA | P1 | QA |

### 12.3 Critical Test Scenarios

#### HMS - Haulage Management
| Test ID | Scenario | Test Type | Priority |
|---------|----------|-----------|----------|
| HMS-TC-001 | Create job → Assign driver → Complete with POD | E2E | P0 |
| HMS-TC-002 | Driver conflict detection (double-booking) | Unit | P0 |
| HMS-TC-003 | GPS tracking data storage and retrieval | Integration | P0 |
| HMS-TC-004 | Driver incentive calculation accuracy | Unit | P0 |
| HMS-TC-005 | Vehicle maintenance alert generation | Unit | P1 |
| HMS-TC-006 | Credit hold enforcement on job booking | Integration | P0 |

#### FFS - Freight Forwarding
| Test ID | Scenario | Test Type | Priority |
|---------|----------|-----------|----------|
| FFS-TC-001 | Create shipment → Book container → Track | E2E | P0 |
| FFS-TC-002 | Customs entry submission workflow | Integration | P0 |
| FFS-TC-003 | Multi-modal tracking status updates | Unit | P0 |
| FFS-TC-004 | Document upload and retrieval | Integration | P0 |
| FFS-TC-005 | Rate sheet validity enforcement | Unit | P1 |
| FFS-TC-006 | Revenue leakage detection (unbilled shipments) | Unit | P1 |

#### WMS - Warehouse Management
| Test ID | Scenario | Test Type | Priority |
|---------|----------|-----------|----------|
| WMS-TC-001 | Goods receipt → Put-away → Pick → Ship | E2E | P0 |
| WMS-TC-002 | Inventory movement transaction posting | Integration | P0 |
| WMS-TC-003 | Cycle count adjustment workflow | E2E | P0 |
| WMS-TC-004 | Location capacity enforcement | Unit | P1 |
| WMS-TC-005 | FIFO pick path optimization | Unit | P1 |
| WMS-TC-006 | Stock reservation for allocated orders | Integration | P0 |

#### TMS - Terminal Management
| Test ID | Scenario | Test Type | Priority |
|---------|----------|-----------|----------|
| TMS-TC-001 | Container yard put-away and tracking | E2E | P0 |
| TMS-TC-002 | Gate pass approval workflow | E2E | P0 |
| TMS-TC-003 | Rail manifest import and validation | Integration | P0 |
| TMS-TC-004 | APAD pre-arrival booking validation | Unit | P0 |
| TMS-TC-005 | Weighbridge integration data capture | Integration | P1 |
| TMS-TC-006 | Container release with credit check | Integration | P0 |

#### FMS - Finance Management
| Test ID | Scenario | Test Type | Priority |
|---------|----------|-----------|----------|
| FMS-TC-001 | Create invoice → Submit e-invoice → Record payment | E2E | P0 |
| FMS-TC-002 | IRBM e-invoice submission and validation | Integration | P0 |
| FMS-TC-003 | Three-way matching (PO-GRN-Invoice) | Unit | P0 |
| FMS-TC-004 | GL journal entry balancing | Unit | P0 |
| FMS-TC-005 | Fixed asset depreciation calculation | Unit | P0 |
| FMS-TC-006 | Overdue customer auto-lock enforcement | Integration | P0 |
| FMS-TC-007 | Multi-currency conversion and rounding | Unit | P1 |
| FMS-TC-008 | Financial period close workflow | E2E | P0 |

### 12.4 Test Data Strategy

| Environment | Data Source | Refresh Frequency | Volume |
|-------------|-------------|-------------------|--------|
| **Development** | Synthetic (faker.js) | Per test run | 100-1000 records |
| **Testing/CI** | Seeded fixtures | Per deployment | 1000-5000 records |
| **Staging/UAT** | Anonymized production | Weekly | Production-like |
| **Load Testing** | Generated + production patterns | Per test | 100K+ records |

#### Test Data Seeding

```typescript
// Seed script for test data
async function seedTestData() {
  // Clear existing test data
  await clearTestData();
  
  // Seed reference data
  await seedBranches();
  await seedUsers();
  await seedCustomers();
  await seedVendors();
  
  // Seed module data
  await seedVehicles(50);
  await seedDrivers(30);
  await seedHaulageJobs(500);
  await seedShipments(300);
  await seedInventory(1000);
  await seedInvoices(200);
}
```

### 12.5 CI/CD Test Execution

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: ESLint
        run: npm run lint
      - name: TypeScript Check
        run: npm run typecheck

  unit-tests:
    runs-on: ubuntu-latest
    needs: lint-and-typecheck
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Unit Tests
        run: npm run test:unit -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    needs: unit-tests
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Database setup
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test
      - name: API Integration Tests
        run: npm run test:api
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379

  e2e-tests:
    runs-on: ubuntu-latest
    needs: integration-tests
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Build application
        run: npm run build
      - name: Start services
        run: docker-compose -f docker-compose.test.yml up -d
      - name: E2E Tests
        run: npm run test:e2e
        env:
          BASE_URL: http://localhost:3000
```

### 12.6 Test Coverage Requirements

| Module | Unit Coverage | Integration | E2E |
|--------|---------------|-------------|-----|
| HMS | 85% | 100% endpoints | 5 flows |
| FFS | 80% | 100% endpoints | 5 flows |
| WMS | 85% | 100% endpoints | 4 flows |
| TMS | 80% | 100% endpoints | 4 flows |
| FMS | 90% | 100% endpoints | 6 flows |
| **Overall** | **82%** | **100%** | **24 flows** |

---

## 13. Deployment Guide

### 13.1 Local Development Setup

#### Prerequisites
- Node.js 18+ (recommend using nvm)
- Docker & Docker Compose
- Git

#### Quick Start

```bash
# 1. Clone repository
git clone <repo-url>
cd logisticspro

# 2. Install dependencies
npm install

# 3. Setup environment
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env

# Edit environment files with your settings:
# - DATABASE_URL
# - REDIS_URL
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - JWT_SECRET

# 4. Start infrastructure services
docker-compose up -d postgres redis

# 5. Setup database
npx prisma migrate dev
npx prisma db seed

# 6. Start development servers
npm run dev

# Services will be available at:
# - Web: http://localhost:3000
# - API: http://localhost:3001
# - PostgreSQL: localhost:5432
# - Redis: localhost:6379
```

### 13.2 Docker Deployment

#### Production Docker Compose

```yaml
version: '3.8'

services:
  web:
    image: logisticspro/web:latest
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - API_URL=http://api:3001
    ports:
      - "3000:3000"
    depends_on:
      - api
      - postgres
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  api:
    image: logisticspro/api:latest
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - PORT=3001
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=${DB_USER:-postgres}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME:-logisticspro}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - uploads:/var/www/uploads:ro
    depends_on:
      - web
      - api
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  uploads:
```

#### Build and Deploy

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Push to registry
docker-compose -f docker-compose.prod.yml push

# Deploy on server
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale API instances
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

### 13.3 Railway Deployment

Railway provides the simplest deployment path for this application.

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and initialize
railway login
railway init

# 3. Add PostgreSQL and Redis plugins
railway add --database postgres
railway add --database redis

# 4. Configure environment variables
railway variables set \
  NODE_ENV=production \
  NEXTAUTH_SECRET=$(openssl rand -base64 32) \
  NEXTAUTH_URL=https://your-app.up.railway.app \
  JWT_SECRET=$(openssl rand -base64 32)

# Variables are automatically injected:
# - DATABASE_URL (from Postgres plugin)
# - REDIS_URL (from Redis plugin)

# 5. Deploy
railway up

# 6. View logs
railway logs

# 7. Open deployed app
railway open
```

### 13.4 Environment Variables Reference

| Variable | Service | Required | Description | Example |
|----------|---------|----------|-------------|---------|
| `DATABASE_URL` | All | ✓ | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | All | ✓ | Redis connection string | `redis://localhost:6379` |
| `NEXTAUTH_SECRET` | Web | ✓ | NextAuth encryption key | 32-byte base64 |
| `NEXTAUTH_URL` | Web | ✓ | Base URL for callbacks | `https://app.example.com` |
| `JWT_SECRET` | API | ✓ | JWT signing secret | 32-byte base64 |
| `API_URL` | Web | - | Internal API URL | `http://api:3001` |
| `PORT` | API | - | API server port | `3001` |
| `NODE_ENV` | All | ✓ | Environment mode | `production` |
| `LOG_LEVEL` | All | - | Winston log level | `info` |
| `UPLOAD_DIR` | API | - | File upload path | `/app/uploads` |
| `MAX_FILE_SIZE` | API | - | Upload limit (bytes) | `52428800` (50MB) |
| `RATE_LIMIT_WINDOW_MS` | API | - | Rate limit window | `60000` |
| `RATE_LIMIT_MAX` | API | - | Requests per window | `100` |
| `IRBM_API_KEY` | API | - | MyInvois API key | `live_xxx` |
| `IRBM_API_URL` | API | - | MyInvois endpoint | `https://api.myinvois...` |

### 13.5 Database Migration Strategy

```bash
# Development: Create new migration
npx prisma migrate dev --name add_invoice_status

# Staging: Apply pending migrations
npx prisma migrate deploy

# Production: Apply pending migrations (zero-downtime)
npx prisma migrate deploy

# Generate Prisma client after schema changes
npx prisma generate

# Reset database (development only!)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

#### Migration Best Practices

1. **Always backup before production migration:**
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql
```

2. **Test migrations on staging first**

3. **Keep migrations small and focused**

4. **Never modify existing migration files after commit**

5. **Use shadow database for development:**
```bash
npx prisma migrate dev --create-only
# Edit SQL if needed, then:
npx prisma migrate dev
```

### 13.6 Health Checks & Monitoring

#### Health Check Endpoints

| Endpoint | Service | Expected Response | Use Case |
|----------|---------|-------------------|----------|
| `GET /api/health` | Web | `{"status":"ok"}` | Load balancer |
| `GET /health` | API | `{"status":"ok","timestamp":"..."}` | Container health |
| `GET /health/db` | API | `{"status":"ok","latency":5}` | DB connectivity |
| `GET /health/redis` | API | `{"status":"ok","latency":2}` | Cache connectivity |

#### Key Metrics to Monitor

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Request latency (p95) | < 500ms | > 1000ms |
| Request latency (p99) | < 1000ms | > 2000ms |
| Error rate | < 0.1% | > 1% |
| Database connection pool | < 80% | > 90% |
| Redis memory usage | < 80% | > 90% |
| Container restart count | 0 | > 3 in 5 min |
| Disk usage | < 70% | > 85% |

#### Log Aggregation

```typescript
// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'logisticspro-api',
    version: process.env.APP_VERSION 
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 13.7 Backup & Recovery

#### Automated Backups

```bash
#!/bin/bash
# backup.sh - Run via cron daily at 2 AM

BACKUP_DIR="/backups"
DB_NAME="logisticspro"
DATE=$(date +%Y%m%d-%H%M%S)
FILENAME="${DB_NAME}-${DATE}.sql.gz"

# Database backup
docker exec postgres pg_dump -U postgres $DB_NAME | gzip > "$BACKUP_DIR/$FILENAME"

# Keep only last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp "$BACKUP_DIR/$FILENAME" s3://logisticspro-backups/

# Notify on failure
if [ $? -ne 0 ]; then
  echo "Backup failed: $FILENAME" | mail -s "Backup Alert" admin@example.com
fi
```

#### Recovery Procedures

```bash
# Restore from backup
gunzip < backup-20240215-020000.sql.gz | docker exec -i postgres psql -U postgres logisticspro

# Point-in-time recovery (if WAL archiving enabled)
# 1. Stop application
# 2. Restore base backup
# 3. Apply WAL logs up to desired point
# 4. Start application

# Redis data restore
docker exec -i redis redis-cli FLUSHDB
docker exec -i redis redis-cli --pipe < backup-redis.aof
```

| Metric | Target | Implementation |
|--------|--------|----------------|
| **RTO** (Recovery Time Objective) | < 4 hours | Hot standby + automated failover |
| **RPO** (Recovery Point Objective) | < 1 hour | Continuous WAL archiving |
| **Backup Frequency** | Daily full + continuous WAL | Automated at 2 AM |
| **Retention** | 30 days local + 1 year archive | Tiered storage |
| **DR Testing** | Quarterly | Full failover drill |

---

## Appendix A: Feature Summary

### Total Feature Count

| System | Features | Status |
|--------|----------|--------|
| HMS | 19 | ✅ Complete |
| FFS | 21 | ✅ Complete |
| WMS | 27 | ✅ Complete |
| TMS | 25 | ✅ Complete |
| FMS | 37 | ✅ Complete |
| **TOTAL** | **129** | **✅ 100%** |

### Compliance Matrix

| Requirement Category | Count | Status |
|----------------------|-------|--------|
| Core Features | 129 | Fully Comply |
| Security Requirements | 11 | Fully Comply |
| Integration Requirements | 20+ | Fully Comply |
| Compliance Requirements | 6 | Fully Comply |
| **Overall** | **100%** | **Fully Comply** |

---

## Appendix B: Complete API Endpoint Reference

### B.1 Endpoint Summary by Module

| Module | Endpoints | CRUD | Actions | Total |
|--------|-----------|------|---------|-------|
| System | 4 | 0 | 4 | 4 |
| Auth | 4 | 0 | 4 | 4 |
| HMS | 19 | 15 | 4 | 19 |
| FFS | 14 | 10 | 4 | 14 |
| WMS | 16 | 12 | 4 | 16 |
| TMS | 14 | 10 | 4 | 14 |
| FMS | 33 | 24 | 9 | 33 |
| **TOTAL** | **104** | **71** | **33** | **104** |

### B.2 Complete Endpoint List

| # | Method | Endpoint | Module | Description |
|---|--------|----------|--------|-------------|
| 1 | GET | /api/health | System | Health check |
| 2 | GET | /api/health/db | System | Database health |
| 3 | GET | /api/health/redis | System | Redis health |
| 4 | GET | /api/health/version | System | Version info |
| 5 | POST | /api/auth/login | Auth | User login |
| 6 | POST | /api/auth/logout | Auth | User logout |
| 7 | POST | /api/auth/refresh | Auth | Refresh token |
| 8 | GET | /api/auth/session | Auth | Get session |
| 9 | GET | /api/users | Core | List users |
| 10 | POST | /api/users | Core | Create user |
| 11 | GET | /api/users/:id | Core | Get user |
| 12 | PATCH | /api/users/:id | Core | Update user |
| 13 | DELETE | /api/users/:id | Core | Delete user |
| 14 | GET | /api/branches | Core | List branches |
| 15 | GET | /api/branches/:id | Core | Get branch |
| 16 | GET | /api/jobs | HMS | List jobs |
| 17 | POST | /api/jobs | HMS | Create job |
| 18 | GET | /api/jobs/:id | HMS | Get job |
| 19 | PATCH | /api/jobs/:id | HMS | Update job |
| 20 | DELETE | /api/jobs/:id | HMS | Delete job |
| 21 | POST | /api/jobs/:id/assign | HMS | Assign job |
| 22 | POST | /api/jobs/:id/tracking | HMS | Update tracking |
| 23 | GET | /api/jobs/:id/tracking | HMS | Get tracking |
| 24 | GET | /api/jobs/stats | HMS | Job statistics |
| 25 | GET | /api/vehicles | HMS | List vehicles |
| 26 | POST | /api/vehicles | HMS | Create vehicle |
| 27 | GET | /api/vehicles/:id | HMS | Get vehicle |
| 28 | PATCH | /api/vehicles/:id | HMS | Update vehicle |
| 29 | DELETE | /api/vehicles/:id | HMS | Delete vehicle |
| 30 | GET | /api/vehicles/:id/maintenance | HMS | Maintenance history |
| 31 | POST | /api/vehicles/:id/maintenance | HMS | Add maintenance |
| 32 | GET | /api/drivers | HMS | List drivers |
| 33 | POST | /api/drivers | HMS | Create driver |
| 34 | GET | /api/drivers/:id | HMS | Get driver |
| 35 | PATCH | /api/drivers/:id | HMS | Update driver |
| 36 | GET | /api/drivers/:id/incentives | HMS | Driver incentives |
| 37 | GET | /api/drivers/:id/jobs | HMS | Driver jobs |
| 38 | GET | /api/shipments | FFS | List shipments |
| 39 | POST | /api/shipments | FFS | Create shipment |
| 40 | GET | /api/shipments/:id | FFS | Get shipment |
| 41 | PATCH | /api/shipments/:id | FFS | Update shipment |
| 42 | DELETE | /api/shipments/:id | FFS | Delete shipment |
| 43 | POST | /api/shipments/:id/status | FFS | Update status |
| 44 | GET | /api/shipments/:id/tracking | FFS | Get tracking |
| 45 | POST | /api/shipments/:id/documents | FFS | Attach document |
| 46 | GET | /api/containers | FFS/TMS | List containers |
| 47 | POST | /api/containers | FFS/TMS | Create container |
| 48 | GET | /api/containers/:id | FFS/TMS | Get container |
| 49 | PATCH | /api/containers/:id | FFS/TMS | Update container |
| 50 | GET | /api/customs-entries | FFS | List customs entries |
| 51 | POST | /api/customs-entries | FFS | Create customs entry |
| 52 | GET | /api/customs-entries/:id | FFS | Get customs entry |
| 53 | PATCH | /api/customs-entries/:id | FFS | Update customs entry |
| 54 | GET | /api/rate-sheets | FFS | List rate sheets |
| 55 | POST | /api/rate-sheets | FFS | Create rate sheet |
| 56 | GET | /api/warehouses | WMS | List warehouses |
| 57 | POST | /api/warehouses | WMS | Create warehouse |
| 58 | GET | /api/warehouses/:id | WMS | Get warehouse |
| 59 | PATCH | /api/warehouses/:id | WMS | Update warehouse |
| 60 | GET | /api/warehouses/:id/locations | WMS | Warehouse locations |
| 61 | GET | /api/inventory | WMS | List inventory |
| 62 | POST | /api/inventory | WMS | Create inventory |
| 63 | GET | /api/inventory/:id | WMS | Get inventory |
| 64 | PATCH | /api/inventory/:id | WMS | Update inventory |
| 65 | POST | /api/inventory/:id/movements | WMS | Record movement |
| 66 | GET | /api/inventory/:id/movements | WMS | Get movements |
| 67 | POST | /api/inventory/count | WMS | Cycle count |
| 68 | GET | /api/locations | WMS | List locations |
| 69 | POST | /api/locations | WMS | Create location |
| 70 | GET | /api/locations/:id | WMS | Get location |
| 71 | GET | /api/locations/:id/inventory | WMS | Location inventory |
| 72 | GET | /api/yard/blocks | TMS | List yard blocks |
| 73 | POST | /api/yard/blocks | TMS | Create yard block |
| 74 | GET | /api/yard/blocks/:id | TMS | Get yard block |
| 75 | GET | /api/yard/slots | TMS | List yard slots |
| 76 | POST | /api/yard/slots | TMS | Create yard slot |
| 77 | GET | /api/yard/slots/:id | TMS | Get yard slot |
| 78 | PATCH | /api/yard/slots/:id/assign | TMS | Assign container |
| 79 | GET | /api/gate-passes | TMS | List gate passes |
| 80 | POST | /api/gate-passes | TMS | Create gate pass |
| 81 | GET | /api/gate-passes/:id | TMS | Get gate pass |
| 82 | POST | /api/gate-passes/:id/approve | TMS | Approve pass |
| 83 | POST | /api/gate-passes/:id/gate-in | TMS | Record gate-in |
| 84 | POST | /api/gate-passes/:id/gate-out | TMS | Record gate-out |
| 85 | GET | /api/rail-operations | TMS | List rail operations |
| 86 | POST | /api/rail-operations | TMS | Create rail operation |
| 87 | GET | /api/rail-operations/:id | TMS | Get rail operation |
| 88 | GET | /api/customers | FMS | List customers |
| 89 | POST | /api/customers | FMS | Create customer |
| 90 | GET | /api/customers/:id | FMS | Get customer |
| 91 | PATCH | /api/customers/:id | FMS | Update customer |
| 92 | GET | /api/customers/:id/invoices | FMS | Customer invoices |
| 93 | GET | /api/vendors | FMS | List vendors |
| 94 | POST | /api/vendors | FMS | Create vendor |
| 95 | GET | /api/vendors/:id | FMS | Get vendor |
| 96 | GET | /api/invoices | FMS | List invoices |
| 97 | POST | /api/invoices | FMS | Create invoice |
| 98 | GET | /api/invoices/:id | FMS | Get invoice |
| 99 | PATCH | /api/invoices/:id | FMS | Update invoice |
| 100 | DELETE | /api/invoices/:id | FMS | Delete invoice |
| 101 | POST | /api/invoices/:id/submit-einvoice | FMS | Submit e-invoice |
| 102 | POST | /api/invoices/:id/void | FMS | Void invoice |
| 103 | GET | /api/invoices/:id/payments | FMS | Invoice payments |
| 104 | GET | /api/payments | FMS | List payments |
| 105 | POST | /api/payments | FMS | Create payment |
| 106 | POST | /api/payments/:id/allocate | FMS | Allocate payment |
| 107 | GET | /api/accounts | FMS | List accounts |
| 108 | POST | /api/accounts | FMS | Create account |
| 109 | GET | /api/accounts/:id | FMS | Get account |
| 110 | GET | /api/accounts/:id/entries | FMS | Account entries |
| 111 | GET | /api/journal-entries | FMS | List journal entries |
| 112 | POST | /api/journal-entries | FMS | Create journal entry |
| 113 | GET | /api/journal-entries/:id | FMS | Get journal entry |
| 114 | POST | /api/journal-entries/:id/post | FMS | Post journal entry |
| 115 | GET | /api/fixed-assets | FMS | List fixed assets |
| 116 | POST | /api/fixed-assets | FMS | Create fixed asset |
| 117 | GET | /api/fixed-assets/:id | FMS | Get fixed asset |
| 118 | PATCH | /api/fixed-assets/:id | FMS | Update fixed asset |
| 119 | POST | /api/fixed-assets/:id/depreciate | FMS | Run depreciation |

**Total: 119 API endpoints**

---

## Appendix C: Database Schema Reference

### C.1 Table Size Estimates

| Table | Estimated Rows (Year 1) | Growth Rate | Primary Key | Indexes |
|-------|------------------------|-------------|-------------|---------|
| audit_logs | 1M+ | High | id (CUID) | createdAt, userId, entityType |
| users | 200 | Low | id (CUID) | email (unique), branchId |
| sessions | 500 | Medium | sessionToken | userId, expires |
| branches | 6 | Static | id (CUID) | code (unique) |
| customers | 2,000 | Medium | id (CUID) | code, branchId, name |
| vendors | 1,000 | Medium | id (CUID) | code, branchId |
| vehicles | 100 | Low | id (CUID) | registrationNo, branchId |
| drivers | 150 | Low | id (CUID) | userId, licenseNo |
| trailers | 200 | Low | id (CUID) | trailerNo, branchId |
| haulage_jobs | 50,000 | High | id (CUID) | jobNo, status, driverId, vehicleId |
| maintenance_records | 2,000 | Medium | id (CUID) | vehicleId, serviceDate |
| driver_incentives | 5,000 | Medium | id (CUID) | driverId, period |
| shipments | 25,000 | High | id (CUID) | blNumber, status, shipperId |
| containers | 40,000 | High | id (CUID) | containerNo, shipmentId |
| customs_entries | 20,000 | High | id (CUID) | entryNo, shipmentId |
| warehouses | 10 | Static | id (CUID) | code, branchId |
| warehouse_locations | 5,000 | Medium | id (CUID) | warehouseId, zone, aisle |
| inventory | 50,000 | High | id (CUID) | sku, warehouseId, locationId |
| inventory_movements | 200,000 | Very High | id (CUID) | inventoryId, type, createdAt |
| yard_blocks | 50 | Static | id (CUID) | code, zone |
| yard_slots | 5,000 | Medium | id (CUID) | yardBlockId, row, slot |
| gate_passes | 100,000 | Very High | id (CUID) | passNo, status, containerNo |
| rail_operations | 5,000 | Medium | id (CUID) | manifestNo, trainNo |
| invoices | 100,000 | Very High | id (CUID) | invoiceNo, status, customerId |
| invoice_items | 300,000 | Very High | id (CUID) | invoiceId |
| payments | 80,000 | High | id (CUID) | paymentNo, status, customerId |
| payment_allocations | 100,000 | High | id (CUID) | paymentId, invoiceId |
| accounts | 500 | Low | id (CUID) | code, type, category |
| journal_entries | 50,000 | High | id (CUID) | entryNo, date, status |
| journal_lines | 150,000 | Very High | id (CUID) | journalEntryId, accountId |
| fixed_assets | 2,000 | Medium | id (CUID) | assetNo, status |
| asset_depreciations | 20,000 | High | id (CUID) | assetId, period |
| documents | 100,000 | High | id (CUID) | entityType, entityId, type |
| settings | 200 | Low | id (CUID) | key, category |

**Total estimated rows (Year 1): ~1.5M records**

### C.2 Index Strategy

```sql
-- High-traffic indexes for performance

-- HMS indexes
CREATE INDEX idx_haulage_jobs_status ON haulage_jobs(status);
CREATE INDEX idx_haulage_jobs_driver ON haulage_jobs(driverId);
CREATE INDEX idx_haulage_jobs_vehicle ON haulage_jobs(vehicleId);
CREATE INDEX idx_haulage_jobs_dates ON haulage_jobs(createdAt, completedAt);

-- FFS indexes
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_dates ON shipments(etd, eta);
CREATE INDEX idx_containers_number ON containers(containerNo);

-- WMS indexes
CREATE INDEX idx_inventory_sku ON inventory(sku);
CREATE INDEX idx_inventory_location ON inventory(locationId);
CREATE INDEX idx_inventory_movements_type ON inventory_movements(type, createdAt);

-- TMS indexes
CREATE INDEX idx_gate_passes_status ON gate_passes(status);
CREATE INDEX idx_gate_passes_container ON gate_passes(containerNo);

-- FMS indexes
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_customer ON invoices(customerId);
CREATE INDEX idx_invoices_dates ON invoices(invoiceDate, dueDate);
CREATE INDEX idx_journal_lines_account ON journal_lines(accountId);

-- Audit and logging
CREATE INDEX idx_audit_logs_entity ON audit_logs(entityType, entityId);
CREATE INDEX idx_audit_logs_user ON audit_logs(userId, createdAt);
CREATE INDEX idx_audit_logs_date ON audit_logs(createdAt DESC);
```

### C.3 Partitioning Strategy

| Table | Partition Key | Strategy |
|-------|---------------|----------|
| audit_logs | createdAt | Monthly partitions |
| inventory_movements | createdAt | Monthly partitions |
| gate_passes | createdAt | Monthly partitions |
| invoices | invoiceDate | Monthly partitions |
| journal_entries | date | Monthly partitions |
| journal_lines | createdAt | Monthly partitions (reference) |

---

## Appendix D: Troubleshooting Guide

### D.1 Common Issues and Solutions

| Symptom | Possible Cause | Solution |
|---------|---------------|----------|
| **Database connection errors** | Connection pool exhausted | Increase `connection_limit` in Prisma; check for connection leaks |
| **Slow invoice queries** | Missing indexes | Run `ANALYZE` on invoice tables; verify indexes exist |
| **E-invoice submission fails** | IRBM API unavailable | Check IRBM service status; implement retry with exponential backoff |
| **Redis timeout errors** | Memory pressure or eviction | Increase Redis memory limit; check `maxmemory-policy` |
| **Prisma client errors** | Schema drift | Run `npx prisma generate`; ensure schema matches database |
| **High memory usage** | Memory leak or large queries | Enable query logging; check for unbounded `findMany` queries |
| **JWT validation fails** | Clock skew or secret mismatch | Verify server clocks synced; check JWT_SECRET env var |
| **File upload fails** | Disk space or size limit | Check disk space; verify `MAX_FILE_SIZE` configuration |
| **Email notifications not sent** | SMTP configuration | Verify SMTP settings; check spam filters |
| **Session expires quickly** | Redis eviction or TTL | Check Redis memory; verify session configuration |

### D.2 Debug Commands

```bash
# Check database connection pool
docker exec postgres psql -U postgres -c "
  SELECT count(*), state 
  FROM pg_stat_activity 
  WHERE datname = 'logisticspro'
  GROUP BY state;
"

# Check for long-running queries
docker exec postgres psql -U postgres -c "
  SELECT pid, now() - query_start AS duration, query
  FROM pg_stat_activity
  WHERE state != 'idle' AND now() - query_start > interval '30 seconds';
"

# Check Redis memory usage
docker exec redis redis-cli info memory

# Check Redis key count by pattern
docker exec redis redis-cli keys "session:*" | wc -l

# View API logs (last 100 lines)
docker logs --tail 100 logisticspro-api

# Follow API logs in real-time
docker logs -f logisticspro-api

# Prisma debug mode
DEBUG=prisma:* npm run dev

# Database migration dry run
npx prisma migrate deploy --preview-feature
```

### D.3 Emergency Procedures

#### Reset Admin Password
```bash
# Access database directly
docker exec -it postgres psql -U postgres logisticspro

# Update password (bcrypt hash)
UPDATE users 
SET password = '$2b$10$...'  -- bcrypt hash of new password
WHERE email = 'admin@example.com';
```

#### Clear Redis Cache
```bash
# Clear all cache (caution!)
docker exec redis redis-cli FLUSHDB

# Clear specific pattern
docker exec redis redis-cli --eval "
  local keys = redis.call('keys', ARGV[1])
  for i=1,#keys,5000 do
    redis.call('del', unpack(keys, i, math.min(i+4999, #keys)))
  end
" 0 "session:*"
```

#### Rollback Failed Migration
```bash
# Identify last successful migration
npx prisma migrate status

# Mark migration as rolled back (development only)
npx prisma migrate resolve --rolled-back migration_name

# Or force migration as applied if manual fix applied
npx prisma migrate resolve --applied migration_name
```

### D.4 Performance Tuning

```sql
-- Analyze table statistics
ANALYZE verbose;

-- Check table bloat
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Find missing indexes (tables with sequential scans)
SELECT schemaname, tablename, seq_scan, seq_tup_read,
       idx_scan, n_tup_ins, n_tup_upd, n_tup_del
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC;
```

---

## Appendix E: Glossary

### E.1 Business Terms

| Term | Definition |
|------|------------|
| **3PL** | Third-Party Logistics - outsourcing logistics operations |
| **APAD** | Land Public Transport Agency (Agensi Pengangkutan Awam Darat) |
| **AR** | Accounts Receivable - money owed by customers |
| **AP** | Accounts Payable - money owed to vendors |
| **AWB** | Air Waybill - document accompanying air freight |
| **BL** | Bill of Lading - document of title for sea freight |
| **CBM** | Cubic Meter - volume measurement for cargo |
| **CN** | Credit Note - negative invoice for refunds/adjustments |
| **CO** | Certificate of Origin - trade document |
| **COPARN** | Container Release Order message (EDIFACT) |
| **CWIP** | Capital Work In Progress - unfinished fixed assets |
| **DN** | Debit Note - additional charge invoice |
| **DO** | Delivery Order - document for cargo release |
| **DSO** | Days Sales Outstanding - average collection period |
| **EDI** | Electronic Data Interchange - structured data exchange |
| **e-Invoicing** | Electronic invoicing compliant with IRBM |
| **ETA** | Estimated Time of Arrival |
| **ETD** | Estimated Time of Departure |
| **FPX** | Financial Process Exchange - online payment system |
| **GL** | General Ledger - main accounting record |
| **GRN** | Goods Received Note - receipt confirmation |
| **GST** | Goods and Services Tax |
| **IRBM** | Inland Revenue Board of Malaysia (LHDN) |
| **JPJ** | Road Transport Department (Jabatan Pengangkutan Jalan) |
| **KTMB** | Keretapi Tanah Melayu Berhad - railway operator |
| **KDM** | Customs Declaration Module (Customs) |
| **M&R** | Maintenance & Repair - container repairs |
| **MFRS** | Malaysian Financial Reporting Standards |
| **MMF** | Multimodal Freight Sdn Bhd - client organization |
| **P&L** | Profit & Loss statement |
| **PCS** | Port Community System - port data exchange |
| **POD** | Proof of Delivery - delivery confirmation |
| **PO** | Purchase Order |
| **RMA** | Return Merchandise Authorization |
| **RTG** | Rubber-Tired Gantry crane |
| **SKU** | Stock Keeping Unit - inventory identifier |
| **SST** | Sales and Service Tax |
| **TAT** | Turnaround Time - port dwell time |
| **TIN** | Tax Identification Number |
| **UOM** | Unit of Measure |
| **VAPT** | Vulnerability Assessment & Penetration Testing |

### E.2 Technical Terms

| Term | Definition |
|------|------------|
| **CUID** | Collision-resistant Unique Identifier |
| **ESB** | Enterprise Service Bus - integration middleware |
| **JWT** | JSON Web Token - authentication token format |
| **MFA** | Multi-Factor Authentication |
| **ORM** | Object-Relational Mapping (Prisma) |
| **RBAC** | Role-Based Access Control |
| **REST** | Representational State Transfer - API architecture |
| **RTO** | Recovery Time Objective - disaster recovery metric |
| **RPO** | Recovery Point Objective - data loss tolerance |
| **SLA** | Service Level Agreement |
| **TOTP** | Time-based One-Time Password |
| **VPC** | Virtual Private Cloud |
| **WAF** | Web Application Firewall |
| **WAL** | Write-Ahead Logging - PostgreSQL durability |

### E.3 System Abbreviations

| Abbreviation | Full Name |
|--------------|-----------|
| **HMS** | Haulage Management System |
| **FFS** | Freight Forwarding System |
| **WMS** | Warehouse Management System |
| **TMS** | Terminal Management System |
| **FMS** | Finance Management System |

---

## Document Control

| Field | Value |
|-------|-------|
| Document | Product Requirements Document (PRD) |
| Project | TSH-2604 - Business Operating & Finance IT System |
| Client | Multimodal Freight Sdn Bhd (MMF) |
| System | LogisticsPro Enterprise Suite v4.2 |
| Version | 2.0 |
| Date | February 2026 |
| Author | Project Management Office |
| Status | Living Document |

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | PMO | Initial PRD based on tender requirements |
| 2.0 | Feb 2026 | PMO | Phase 3 improvements: API specs, data model, deployment guide, testing strategy |

---

*End of Document*
