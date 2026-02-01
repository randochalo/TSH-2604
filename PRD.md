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
5. [Security & Compliance](#5-security--compliance)
6. [User Stories by Module](#6-user-stories-by-module)
7. [Technical Stack](#7-technical-stack)
8. [Deployment Model](#8-deployment-model)
9. [Success Metrics](#9-success-metrics)
10. [Definition of Done](#10-definition-of-done)

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

1. **Microservices-Based:** Modular architecture enabling independent scaling
2. **API-First:** RESTful APIs for all integrations and extensions
3. **Offline-First:** Full functionality without connectivity; sync when available
4. **Multi-Tenant:** Single codebase supporting multiple branches
5. **Cloud-Native:** Containerized deployment on Awan Kita sovereign cloud

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
│                     API GATEWAY (Kong)                          │
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
                    │  ENTERPRISE BUS   │
                    │  (Message Queue)  │
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

---

## 5. Security & Compliance

### 5.1 Security Framework

| Layer | Control | Implementation |
|-------|---------|----------------|
| **Network** | Firewall, DDoS Protection | WAF, VPC isolation, intrusion detection |
| **Application** | Authentication, Authorization | OAuth 2.0, JWT tokens, RBAC (50+ permissions) |
| **Data** | Encryption | AES-256 at rest, TLS 1.3 in transit |
| **Access** | MFA, Password Policy | TOTP/SMS, NIST 800-63B compliant |
| **Audit** | Logging, Monitoring | Immutable logs, SIEM integration, real-time alerts |
| **Physical** | Data Center Security | Awan Kita sovereign cloud, Malaysia-only data |

### 5.2 Authentication & Authorization

**Multi-Factor Authentication (MFA):**
- TOTP (Time-based One-Time Password) via authenticator apps
- SMS OTP fallback
- Hardware token support for privileged accounts

**Role-Based Access Control (RBAC):**
- Granular permissions (50+ distinct permissions)
- Role hierarchies: Super Admin, Branch Admin, Manager, Supervisor, Operator, Read-Only
- Data-level permissions: Branch, department, customer, shipment restrictions

**Zero-Trust Architecture:**
- Behavioral biometrics (typing patterns, device posture)
- Continuous authentication
- Anomalous access detection with auto-suspension

### 5.3 Compliance Requirements

| Regulation | Requirement | Implementation |
|------------|-------------|----------------|
| **IRBM e-Invoicing** | MyInvois API integration | Automatic validation and submission |
| **APAD** | Pre-arrival booking, TAT tracking | TMS module compliance |
| **MFRS** | Accounting standards | FMS module compliant |
| **SST/GST** | Tax calculation and reporting | Automated tax engine |
| **Personal Data Protection (PDPA)** | Data privacy | Encryption, consent management, data retention |
| **Awan Kita** | Sovereign cloud, local data | Malaysia-only data centers, local encryption keys |

### 5.4 VAPT Compliance

| Finding Level | Count | Status |
|---------------|-------|--------|
| Critical | 0 | ✅ Compliant |
| High | 0 | ✅ Compliant |
| Medium | 3 | Remediated with compensating controls |
| Low | 5 | Documented, scheduled for patching |

**Certification:** CREST-accredited penetration testing completed annually

### 5.5 Audit & Logging

- **Immutable Audit Logs:** Tamper-resistant database tables
- **Captured Data:** Before/after values, user ID, timestamp, IP address
- **Retention:** 7 years for financial/compliance data
- **Access:** Real-time inquiry screens with export capability
- **Alerts:** Real-time notifications for sensitive operations

---

## 6. User Stories by Module

### 6.1 HMS User Stories

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

### 6.2 FFS User Stories

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

### 6.3 WMS User Stories

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

### 6.4 TMS User Stories

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

### 6.5 FMS User Stories

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

## 7. Technical Stack

### 7.1 Application Stack

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

### 7.2 Infrastructure Stack

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

### 7.3 Development Standards

- **Code Quality:** ESLint, Prettier, SonarQube
- **Testing:** Jest (unit), Cypress (E2E), Postman (API)
- **Documentation:** OpenAPI/Swagger for APIs, Storybook for UI
- **Version Control:** Git with trunk-based development

---

## 8. Deployment Model

### 8.1 Awan Kita Sovereign Cloud

All systems deployed on **Awan Kita** sovereign cloud infrastructure ensuring:

| Requirement | Implementation |
|-------------|----------------|
| Data Residency | 100% Malaysia-based data centers |
| Encryption Keys | Managed within Malaysia |
| Compliance | Meets Malaysian government cloud requirements |
| Network Isolation | VPC with private subnets |
| Availability | 99.9% uptime SLA |

### 8.2 Deployment Architecture

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

### 8.3 Environment Strategy

| Environment | Purpose | Data |
|-------------|---------|------|
| Development | Feature development | Synthetic |
| Testing | QA, integration testing | Anonymized production |
| Staging | UAT, pre-production | Production mirror |
| Production | Live operations | Live data |
| DR | Disaster recovery | Async replication |

### 8.4 Backup & Disaster Recovery

| Metric | Target | Implementation |
|--------|--------|----------------|
| RTO (Recovery Time Objective) | < 4 hours | Hot standby in secondary AZ |
| RPO (Recovery Point Objective) | < 1 hour | Continuous replication |
| Backup Frequency | Daily full, hourly incremental | Automated with verification |
| Retention | 30 days online, 7 years archive | Tiered storage |
| DR Testing | Annual | Full failover drill |

---

## 9. Success Metrics

### 9.1 Key Performance Indicators (KPIs)

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

### 9.2 Project Success Criteria

| Criteria | Definition |
|----------|------------|
| On Time | Go-live within 8-10 weeks of project start |
| On Budget | Delivery within agreed contract value |
| Quality | 98%+ UAT pass rate on first attempt |
| Compliance | 100% of 129 features verified and accepted |
| Security | Zero high/critical VAPT findings |
| Adoption | >90% active user adoption within 30 days of go-live |

---

## 10. Definition of Done

### 10.1 Feature Definition of Done

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

### 10.2 Sprint Definition of Done

A sprint is **Done** when:

- [ ] All committed features meet Definition of Done
- [ ] Regression tests passing
- [ ] Demo completed with stakeholders
- [ ] Sprint retrospective completed
- [ ] Known issues documented

### 10.3 Release Definition of Done

A release is **Done** when:

- [ ] All features tested and UAT signed off
- [ ] Security scan passed (zero critical/high)
- [ ] Performance testing passed
- [ ] Documentation complete and reviewed
- [ ] Training materials delivered
- [ ] Go-live checklist completed
- [ ] Rollback plan documented and tested
- [ ] Business sign-off obtained

### 10.4 Project Definition of Done

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

## Document Control

| Field | Value |
|-------|-------|
| Document | Product Requirements Document (PRD) |
| Project | TSH-2604 - Business Operating & Finance IT System |
| Client | Multimodal Freight Sdn Bhd (MMF) |
| System | LogisticsPro Enterprise Suite v4.2 |
| Version | 1.0 |
| Date | February 2026 |
| Author | Project Management Office |
| Status | Draft |

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2026 | PMO | Initial PRD based on tender requirements |

---

*End of Document*
