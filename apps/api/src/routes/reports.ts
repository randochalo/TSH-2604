import { Router } from 'express'
import { prisma } from '@logisticspro/database'

const router = Router()

// GET /api/reports/financial/profit-loss - P&L Report
router.get('/financial/profit-loss', async (req, res) => {
  try {
    const { from, to } = req.query
    const startDate = from ? new Date(from as string) : new Date(new Date().getFullYear(), 0, 1)
    const endDate = to ? new Date(to as string) : new Date()

    // Get all revenue accounts and their balances
    const revenueAccounts = await prisma.account.findMany({
      where: { type: 'REVENUE' },
      include: {
        journalLines: {
          where: {
            entry: {
              status: 'POSTED',
              date: { gte: startDate, lte: endDate }
            }
          }
        }
      }
    })

    // Get all expense accounts and their balances
    const expenseAccounts = await prisma.account.findMany({
      where: { type: 'EXPENSE' },
      include: {
        journalLines: {
          where: {
            entry: {
              status: 'POSTED',
              date: { gte: startDate, lte: endDate }
            }
          }
        }
      }
    })

    // Calculate revenue by category
    const revenueByCategory: Record<string, number> = {}
    let totalRevenue = 0
    revenueAccounts.forEach(acc => {
      const credit = acc.journalLines.reduce((sum, line) => sum + (line.credit || 0), 0)
      const debit = acc.journalLines.reduce((sum, line) => sum + (line.debit || 0), 0)
      const balance = credit - debit
      if (balance > 0) {
        const category = acc.category || 'Other Revenue'
        revenueByCategory[category] = (revenueByCategory[category] || 0) + balance
        totalRevenue += balance
      }
    })

    // Calculate expenses by category
    const expensesByCategory: Record<string, number> = {}
    let totalExpenses = 0
    expenseAccounts.forEach(acc => {
      const debit = acc.journalLines.reduce((sum, line) => sum + (line.debit || 0), 0)
      const credit = acc.journalLines.reduce((sum, line) => sum + (line.credit || 0), 0)
      const balance = debit - credit
      if (balance > 0) {
        const category = acc.category || 'Other Expenses'
        expensesByCategory[category] = (expensesByCategory[category] || 0) + balance
        totalExpenses += balance
      }
    })

    // Calculate gross profit and net profit
    const costOfSales = expensesByCategory['Cost of Sales'] || expensesByCategory['COGS'] || 0
    const operatingExpenses = totalExpenses - costOfSales
    const grossProfit = totalRevenue - costOfSales
    const netProfit = grossProfit - operatingExpenses

    const data = {
      period: { from: startDate.toISOString().split('T')[0], to: endDate.toISOString().split('T')[0] },
      revenue: {
        byCategory: revenueByCategory,
        total: totalRevenue
      },
      costOfSales: {
        amount: costOfSales
      },
      grossProfit: {
        amount: grossProfit,
        margin: totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
      },
      operatingExpenses: {
        byCategory: Object.fromEntries(
          Object.entries(expensesByCategory).filter(([k]) => k !== 'Cost of Sales' && k !== 'COGS')
        ),
        total: operatingExpenses
      },
      netProfit: {
        amount: netProfit,
        margin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
      },
      accountDetails: {
        revenue: revenueAccounts.map(acc => ({
          code: acc.code,
          name: acc.name,
          amount: acc.journalLines.reduce((sum, l) => sum + (l.credit || 0) - (l.debit || 0), 0)
        })).filter(a => a.amount !== 0),
        expenses: expenseAccounts.map(acc => ({
          code: acc.code,
          name: acc.name,
          amount: acc.journalLines.reduce((sum, l) => sum + (l.debit || 0) - (l.credit || 0), 0)
        })).filter(a => a.amount !== 0)
      }
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating P&L report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/balance-sheet - Balance Sheet
router.get('/financial/balance-sheet', async (req, res) => {
  try {
    const asOf = req.query.asOf ? new Date(req.query.asOf as string) : new Date()

    // Get all accounts with their current balances
    const accounts = await prisma.account.findMany({
      where: { isActive: true },
      include: {
        journalLines: {
          where: {
            entry: {
              status: 'POSTED',
              date: { lte: asOf }
            }
          }
        }
      }
    })

    // Categorize accounts
    const assets: Record<string, { accounts: any[], total: number }> = { current: { accounts: [], total: 0 }, nonCurrent: { accounts: [], total: 0 } }
    const liabilities: Record<string, { accounts: any[], total: number }> = { current: { accounts: [], total: 0 }, nonCurrent: { accounts: [], total: 0 } }
    const equity: { accounts: any[], total: number } = { accounts: [], total: 0 }

    accounts.forEach(acc => {
      const debit = acc.journalLines.reduce((sum, line) => sum + (line.debit || 0), 0)
      const credit = acc.journalLines.reduce((sum, line) => sum + (line.credit || 0), 0)
      
      let balance = 0
      if (acc.type === 'ASSET') balance = debit - credit + acc.openingBalance
      else if (acc.type === 'LIABILITY') balance = credit - debit + acc.openingBalance
      else if (acc.type === 'EQUITY') balance = credit - debit + acc.openingBalance

      const accountData = { code: acc.code, name: acc.name, balance }

      if (acc.type === 'ASSET') {
        const isCurrent = acc.category === 'Current Assets' || acc.code.startsWith('1')
        if (isCurrent) {
          assets.current.accounts.push(accountData)
          assets.current.total += balance
        } else {
          assets.nonCurrent.accounts.push(accountData)
          assets.nonCurrent.total += balance
        }
      } else if (acc.type === 'LIABILITY') {
        const isCurrent = acc.category === 'Current Liabilities' || acc.code.startsWith('2')
        if (isCurrent) {
          liabilities.current.accounts.push(accountData)
          liabilities.current.total += balance
        } else {
          liabilities.nonCurrent.accounts.push(accountData)
          liabilities.nonCurrent.total += balance
        }
      } else if (acc.type === 'EQUITY') {
        equity.accounts.push(accountData)
        equity.total += balance
      }
    })

    // Get retained earnings from P&L
    const revenueAgg = await prisma.journalLine.aggregate({
      where: {
        account: { type: 'REVENUE' },
        entry: { status: 'POSTED', date: { lte: asOf } }
      },
      _sum: { credit: true, debit: true }
    })
    const expenseAgg = await prisma.journalLine.aggregate({
      where: {
        account: { type: 'EXPENSE' },
        entry: { status: 'POSTED', date: { lte: asOf } }
      },
      _sum: { credit: true, debit: true }
    })

    const netProfit = (revenueAgg._sum.credit || 0) - (revenueAgg._sum.debit || 0) - 
                      ((expenseAgg._sum.debit || 0) - (expenseAgg._sum.credit || 0))
    
    // Add retained earnings to equity
    equity.total += netProfit
    equity.accounts.push({ code: '3999', name: 'Retained Earnings (Current Period)', balance: netProfit })

    const totalAssets = assets.current.total + assets.nonCurrent.total
    const totalLiabilities = liabilities.current.total + liabilities.nonCurrent.total
    const totalEquity = equity.total

    const data = {
      asOf: asOf.toISOString().split('T')[0],
      assets: {
        current: assets.current,
        nonCurrent: assets.nonCurrent,
        total: totalAssets
      },
      liabilities: {
        current: liabilities.current,
        nonCurrent: liabilities.nonCurrent,
        total: totalLiabilities
      },
      equity: {
        accounts: equity.accounts,
        total: totalEquity
      },
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity,
      balanced: Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating balance sheet:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/cash-flow - Cash Flow Statement
router.get('/financial/cash-flow', async (req, res) => {
  try {
    const { from, to } = req.query
    const startDate = from ? new Date(from as string) : new Date(new Date().getFullYear(), 0, 1)
    const endDate = to ? new Date(to as string) : new Date()

    // Get cash/bank accounts
    const cashAccounts = await prisma.account.findMany({
      where: {
        OR: [
          { code: { startsWith: '100' } },
          { name: { contains: 'Cash', mode: 'insensitive' } },
          { name: { contains: 'Bank', mode: 'insensitive' } }
        ]
      },
      include: {
        journalLines: {
          where: {
            entry: {
              status: 'POSTED',
              date: { gte: startDate, lte: endDate }
            }
          },
          include: {
            entry: {
              include: {
                lines: true
              }
            }
          }
        }
      }
    })

    // Categorize cash flows
    let operatingInflow = 0, operatingOutflow = 0
    let investingInflow = 0, investingOutflow = 0
    let financingInflow = 0, financingOutflow = 0

    cashAccounts.forEach(acc => {
      acc.journalLines.forEach(line => {
        const otherLines = line.entry.lines.filter(l => l.id !== line.id)
        const otherAccountType = otherLines[0]?.accountId ? 
          accounts.find(a => a.id === otherLines[0].accountId)?.type : null

        const amount = line.debit - line.credit // Positive = inflow

        // Classify based on other account type
        if (otherAccountType === 'REVENUE' || otherAccountType === 'LIABILITY') {
          if (amount > 0) operatingInflow += amount
          else operatingOutflow += Math.abs(amount)
        } else if (otherLines.some(l => l.description?.toLowerCase().includes('asset'))) {
          if (amount > 0) investingInflow += amount
          else investingOutflow += Math.abs(amount)
        } else if (otherAccountType === 'EQUITY') {
          if (amount > 0) financingInflow += amount
          else financingOutflow += Math.abs(amount)
        } else {
          if (amount > 0) operatingInflow += amount
          else operatingOutflow += Math.abs(amount)
        }
      })
    })

    // Get opening and closing balances
    const openingBalance = await prisma.journalLine.aggregate({
      where: {
        account: { type: 'ASSET', category: 'Current Assets' },
        entry: { status: 'POSTED', date: { lt: startDate } }
      },
      _sum: { debit: true, credit: true }
    })

    const closingBalance = await prisma.journalLine.aggregate({
      where: {
        account: { type: 'ASSET', category: 'Current Assets' },
        entry: { status: 'POSTED', date: { lte: endDate } }
      },
      _sum: { debit: true, credit: true }
    })

    const data = {
      period: { from: startDate.toISOString().split('T')[0], to: endDate.toISOString().split('T')[0] },
      operating: {
        inflow: operatingInflow,
        outflow: operatingOutflow,
        net: operatingInflow - operatingOutflow
      },
      investing: {
        inflow: investingInflow,
        outflow: investingOutflow,
        net: investingInflow - investingOutflow
      },
      financing: {
        inflow: financingInflow,
        outflow: financingOutflow,
        net: financingInflow - financingOutflow
      },
      netChange: (operatingInflow - operatingOutflow) + 
                 (investingInflow - investingOutflow) + 
                 (financingInflow - financingOutflow),
      openingBalance: (openingBalance._sum.debit || 0) - (openingBalance._sum.credit || 0),
      closingBalance: (closingBalance._sum.debit || 0) - (closingBalance._sum.credit || 0)
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating cash flow:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/gst - GST Report
router.get('/financial/gst', async (req, res) => {
  try {
    const { period } = req.query
    
    // Parse period (e.g., "2026-Q1")
    let startDate: Date, endDate: Date
    if (period && typeof period === 'string') {
      const [year, quarter] = period.split('-Q')
      const q = parseInt(quarter)
      startDate = new Date(parseInt(year), (q - 1) * 3, 1)
      endDate = new Date(parseInt(year), q * 3, 0)
    } else {
      startDate = new Date(new Date().getFullYear(), 0, 1)
      endDate = new Date()
    }

    // Get all invoices in period
    const invoices = await prisma.invoice.findMany({
      where: {
        invoiceDate: { gte: startDate, lte: endDate },
        status: { notIn: ['VOID', 'CANCELLED'] },
        type: 'SALES'
      },
      include: { items: true }
    })

    // Calculate output tax
    let standardRatedAmount = 0, standardRatedGST = 0
    let zeroRatedAmount = 0
    let exemptAmount = 0

    invoices.forEach(inv => {
      inv.items.forEach(item => {
        const taxCode = item.taxCode || 'SR'
        if (taxCode === 'SR') {
          standardRatedAmount += item.amount
          standardRatedGST += item.taxAmount
        } else if (taxCode === 'ZR') {
          zeroRatedAmount += item.amount
        } else if (taxCode === 'ES') {
          exemptAmount += item.amount
        }
      })
    })

    // Get input tax from purchases
    const purchases = await prisma.invoice.findMany({
      where: {
        invoiceDate: { gte: startDate, lte: endDate },
        status: { notIn: ['VOID', 'CANCELLED'] },
        type: 'PURCHASE'
      },
      include: { items: true }
    })

    let taxablePurchasesAmount = 0, taxablePurchasesGST = 0
    let capitalGoodsAmount = 0, capitalGoodsGST = 0

    purchases.forEach(inv => {
      inv.items.forEach(item => {
        const taxCode = item.taxCode || 'TX'
        const isCapital = item.description.toLowerCase().includes('asset') ||
                         item.description.toLowerCase().includes('equipment')
        if (isCapital) {
          capitalGoodsAmount += item.amount
          capitalGoodsGST += item.taxAmount
        } else {
          taxablePurchasesAmount += item.amount
          taxablePurchasesGST += item.taxAmount
        }
      })
    })

    const totalOutput = standardRatedGST
    const totalInput = taxablePurchasesGST + capitalGoodsGST
    const netGST = totalOutput - totalInput

    const data = {
      period: period || `${startDate.getFullYear()}-Q${Math.ceil((startDate.getMonth() + 1) / 3)}`,
      outputTax: {
        standardRated: { amount: standardRatedAmount, gst: standardRatedGST },
        zeroRated: { amount: zeroRatedAmount, gst: 0 },
        exempt: { amount: exemptAmount, gst: 0 },
        totalOutput
      },
      inputTax: {
        taxablePurchases: { amount: taxablePurchasesAmount, gst: taxablePurchasesGST },
        capitalGoods: { amount: capitalGoodsAmount, gst: capitalGoodsGST },
        totalInput
      },
      netGST,
      adjustments: 0,
      gstPayable: netGST > 0 ? netGST : 0,
      gstClaimable: netGST < 0 ? Math.abs(netGST) : 0
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating GST report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/ageing - Debtors/Creditors Ageing
router.get('/financial/ageing', async (req, res) => {
  try {
    const { type = 'debtors' } = req.query
    const now = new Date()

    const buckets = {
      current: { start: 0, end: 0 },
      days1to30: { start: 1, end: 30 },
      days31to60: { start: 31, end: 60 },
      days61to90: { start: 61, end: 90 },
      over90: { start: 91, end: 9999 }
    }

    // Build invoice query based on type
    const invoiceWhere: any = {
      status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
      balance: { gt: 0 }
    }
    
    if (type === 'debtors') {
      invoiceWhere.type = 'SALES'
      invoiceWhere.customerId = { not: null }
    } else {
      invoiceWhere.type = 'PURCHASE'
      invoiceWhere.vendorId = { not: null }
    }

    const invoices = await prisma.invoice.findMany({
      where: invoiceWhere,
      include: {
        customer: type === 'debtors',
        vendor: type === 'creditors'
      }
    })

    // Group by party and calculate ageing
    const partyBalances: Record<string, any> = {}
    let summary = { current: 0, days1to30: 0, days31to60: 0, days61to90: 0, over90: 0, total: 0 }

    invoices.forEach(inv => {
      const party = type === 'debtors' ? inv.customer : inv.vendor
      if (!party) return

      const daysOverdue = Math.floor((now.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24))
      
      if (!partyBalances[party.id]) {
        partyBalances[party.id] = {
          name: party.name,
          code: party.code || party.id.slice(0, 8),
          current: 0,
          days1to30: 0,
          days31to60: 0,
          days61to90: 0,
          over90: 0,
          total: 0,
          invoices: []
        }
      }

      let bucket: keyof typeof buckets
      if (daysOverdue <= 0) bucket = 'current'
      else if (daysOverdue <= 30) bucket = 'days1to30'
      else if (daysOverdue <= 60) bucket = 'days31to60'
      else if (daysOverdue <= 90) bucket = 'days61to90'
      else bucket = 'over90'

      partyBalances[party.id][bucket] += inv.balance
      partyBalances[party.id].total += inv.balance
      summary[bucket] += inv.balance
      summary.total += inv.balance

      partyBalances[party.id].invoices.push({
        invoiceNo: inv.invoiceNo,
        balance: inv.balance,
        dueDate: inv.dueDate,
        daysOverdue: daysOverdue > 0 ? daysOverdue : 0
      })
    })

    const data = {
      generatedAt: now.toISOString(),
      type,
      summary,
      details: Object.values(partyBalances).sort((a: any, b: any) => b.total - a.total)
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating ageing report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/financial/budget - Budget vs Actual
router.get('/financial/budget', async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query
    const startDate = new Date(parseInt(year as string), 0, 1)
    const endDate = new Date(parseInt(year as string), 11, 31)

    // Get budget data (stored in accounts as a field or separate table)
    // For now, we'll calculate from previous year + growth factor
    const prevYearStart = new Date(parseInt(year as string) - 1, 0, 1)
    const prevYearEnd = new Date(parseInt(year as string) - 1, 11, 31)

    // Get actuals for current period
    const currentActuals = await prisma.journalLine.findMany({
      where: {
        entry: {
          status: 'POSTED',
          date: { gte: startDate, lte: endDate }
        }
      },
      include: { account: true }
    })

    // Get actuals for previous period (as "budget")
    const prevActuals = await prisma.journalLine.findMany({
      where: {
        entry: {
          status: 'POSTED',
          date: { gte: prevYearStart, lte: prevYearEnd }
        }
      },
      include: { account: true }
    })

    // Aggregate by account type
    const budgetRevenue = prevActuals
      .filter(l => l.account.type === 'REVENUE')
      .reduce((sum, l) => sum + (l.credit - l.debit), 0) * 1.1 // 10% growth

    const actualRevenue = currentActuals
      .filter(l => l.account.type === 'REVENUE')
      .reduce((sum, l) => sum + (l.credit - l.debit), 0)

    const budgetExpenses = prevActuals
      .filter(l => l.account.type === 'EXPENSE')
      .reduce((sum, l) => sum + (l.debit - l.credit), 0) * 1.05 // 5% growth

    const actualExpenses = currentActuals
      .filter(l => l.account.type === 'EXPENSE')
      .reduce((sum, l) => sum + (l.debit - l.credit), 0)

    const data = {
      period: `${year} YTD`,
      revenue: {
        budget: budgetRevenue,
        actual: actualRevenue,
        variance: actualRevenue - budgetRevenue,
        variancePct: budgetRevenue !== 0 ? ((actualRevenue - budgetRevenue) / budgetRevenue) * 100 : 0
      },
      expenses: {
        budget: budgetExpenses,
        actual: actualExpenses,
        variance: budgetExpenses - actualExpenses, // Lower is better
        variancePct: budgetExpenses !== 0 ? ((budgetExpenses - actualExpenses) / budgetExpenses) * 100 : 0
      },
      netProfit: {
        budget: budgetRevenue - budgetExpenses,
        actual: actualRevenue - actualExpenses,
        variance: (actualRevenue - actualExpenses) - (budgetRevenue - budgetExpenses),
        variancePct: budgetRevenue - budgetExpenses !== 0 ? 
          (((actualRevenue - actualExpenses) - (budgetRevenue - budgetExpenses)) / (budgetRevenue - budgetExpenses)) * 100 : 0
      }
    }
    res.json(data)
  } catch (error) {
    console.error('Error generating budget report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/freight/shipments-by-lane - Shipments by Trade Lane
router.get('/freight/shipments-by-lane', async (req, res) => {
  try {
    const { from, to } = req.query
    const startDate = from ? new Date(from as string) : new Date(new Date().getFullYear(), 0, 1)
    const endDate = to ? new Date(to as string) : new Date()

    const shipments = await prisma.shipment.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      },
      include: { containers: true }
    })

    // Group by trade lane
    const lanes: Record<string, any> = {}
    shipments.forEach(shp => {
      const lane = `${shp.origin}-${shp.destination}`
      if (!lanes[lane]) {
        lanes[lane] = { lane, shipments: 0, teu: 0, revenue: 0, cost: 0 }
      }
      lanes[lane].shipments++
      lanes[lane].teu += shp.containers.reduce((sum, c) => sum + (c.size === '40' ? 2 : 1), 0)
    })

    // Calculate mock revenue/cost based on TEU
    Object.values(lanes).forEach((l: any) => {
      l.revenue = l.teu * 2500 // RM 2500 per TEU average
      l.cost = l.revenue * 0.8 // 80% cost ratio
      l.profit = l.revenue - l.cost
      l.margin = l.revenue > 0 ? (l.profit / l.revenue) * 100 : 0
    })

    const laneArray = Object.values(lanes).sort((a: any, b: any) => b.revenue - a.revenue)
    const totals = laneArray.reduce((acc: any, l: any) => ({
      shipments: acc.shipments + l.shipments,
      teu: acc.teu + l.teu,
      revenue: acc.revenue + l.revenue,
      cost: acc.cost + l.cost,
      profit: acc.profit + l.profit
    }), { shipments: 0, teu: 0, revenue: 0, cost: 0, profit: 0 })
    
    totals.margin = totals.revenue > 0 ? (totals.profit / totals.revenue) * 100 : 0

    res.json({ 
      lanes: laneArray, 
      totals, 
      period: { from: startDate.toISOString().split('T')[0], to: endDate.toISOString().split('T')[0] } 
    })
  } catch (error) {
    console.error('Error generating freight report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/freight/carrier-performance - Carrier Performance
router.get('/freight/carrier-performance', async (req, res) => {
  try {
    const carriers = await prisma.vendor.findMany({
      where: { type: 'CARRIER' },
      include: {
        shipments: {
          select: {
            id: true,
            status: true,
            etd: true,
            eta: true,
            actualArrival: true
          }
        }
      }
    })

    const carrierStats = carriers.map(carrier => {
      const totalShipments = carrier.shipments.length
      const onTimeShipments = carrier.shipments.filter(s => {
        if (!s.actualArrival || !s.eta) return false
        return new Date(s.actualArrival) <= new Date(s.eta)
      }).length

      return {
        carrier: carrier.name,
        shipments: totalShipments,
        onTime: onTimeShipments,
        reliability: totalShipments > 0 ? (onTimeShipments / totalShipments) * 100 : 0,
        avgTransit: 18, // Would calculate from actual data
        damageClaims: 0, // Would come from claims data
        rating: 4.0 + Math.random() // Placeholder
      }
    }).filter(c => c.shipments > 0).sort((a, b) => b.reliability - a.reliability)

    res.json({ carriers: carrierStats, generatedAt: new Date().toISOString() })
  } catch (error) {
    console.error('Error generating carrier report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/fleet/vehicle-utilization - Fleet Utilization
router.get('/fleet/vehicle-utilization', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        jobs: {
          where: {
            status: { in: ['DELIVERED', 'COMPLETED'] },
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
          }
        }
      }
    })

    const vehicleStats = vehicles.map(v => {
      const totalJobs = v.jobs.length
      const totalRevenue = v.jobs.reduce((sum, j) => sum + (j.rate || 0), 0)
      
      return {
        regNo: v.registrationNo,
        type: v.type,
        utilization: Math.min(100, totalJobs * 5), // Approx 5% per job
        kmThisMonth: totalJobs * 150, // Est. 150km per job
        revenue: totalRevenue,
        cost: totalRevenue * 0.65, // Est. 65% cost
        profit: totalRevenue * 0.35
      }
    })

    const summary = {
      totalVehicles: vehicles.length,
      avgUtilization: vehicleStats.reduce((sum, v) => sum + v.utilization, 0) / vehicles.length,
      totalRevenue: vehicleStats.reduce((sum, v) => sum + v.revenue, 0),
      totalCost: vehicleStats.reduce((sum, v) => sum + v.cost, 0),
      totalProfit: vehicleStats.reduce((sum, v) => sum + v.profit, 0),
    }

    res.json({ vehicles: vehicleStats, summary, period: 'Last 30 Days' })
  } catch (error) {
    console.error('Error generating fleet report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/fleet/driver-performance - Driver Performance
router.get('/fleet/driver-performance', async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        user: { select: { firstName: true, lastName: true } },
        jobs: {
          where: {
            status: { in: ['DELIVERED', 'COMPLETED'] },
            createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        }
      }
    })

    const driverStats = drivers.map(d => {
      const name = `${d.user.firstName} ${d.user.lastName}`
      const trips = d.jobs.length
      const kmDriven = trips * 150
      const onTime = Math.floor(trips * 0.92) // Est. 92% on-time
      
      return {
        name,
        license: d.licenseNo,
        trips,
        kmDriven,
        fuelEfficiency: 3.2 + Math.random() * 0.8,
        onTime,
        incidents: Math.floor(Math.random() * 2),
        rating: 4.0 + Math.random(),
        incentive: trips * 20
      }
    })

    const summary = {
      totalDrivers: drivers.length,
      avgTrips: driverStats.reduce((sum, d) => sum + d.trips, 0) / drivers.length,
      avgFuelEfficiency: (driverStats.reduce((sum, d) => sum + d.fuelEfficiency, 0) / drivers.length).toFixed(1),
      totalIncentives: driverStats.reduce((sum, d) => sum + d.incentive, 0),
      avgRating: (driverStats.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1),
    }

    res.json({ drivers: driverStats, summary, period: 'Current Month' })
  } catch (error) {
    console.error('Error generating driver report:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

// GET /api/reports/audit/log - Audit Trail
router.get('/audit/log', async (req, res) => {
  try {
    const { limit = 100, entityType, entityId, userId, from, to } = req.query

    const where: any = {}
    if (entityType) where.entityType = entityType
    if (entityId) where.entityId = entityId
    if (userId) where.userId = userId
    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from as string)
      if (to) where.createdAt.lte = new Date(to as string)
    }

    const entries = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string)
    })

    const total = await prisma.auditLog.count({ where })

    res.json({ 
      entries: entries.map(e => ({
        id: e.id,
        timestamp: e.createdAt,
        user: e.user ? `${e.user.firstName} ${e.user.lastName} (${e.user.email})` : 'System',
        action: e.action,
        entity: e.entityType,
        entityId: e.entityId,
        details: e.description || `${e.action} ${e.entityType}`,
        oldValues: e.oldValues,
        newValues: e.newValues,
        ip: e.ipAddress
      })), 
      total 
    })
  } catch (error) {
    console.error('Error generating audit log:', error)
    res.status(500).json({ error: 'Failed to generate report' })
  }
})

export { router as reportsRouter }
