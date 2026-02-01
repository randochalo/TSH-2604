import { Request, Response, NextFunction } from 'express'
import { prisma } from '@logisticspro/database'

export interface CreditCheckOptions {
  entityType: 'job' | 'shipment' | 'invoice'
  getCustomerId: (req: Request) => string | undefined
}

/**
 * Middleware to check customer credit status before allowing operations
 * Blocks creation of jobs, shipments, and invoices for overdue customers
 */
export function creditCheck(options: CreditCheckOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const customerId = options.getCustomerId(req)
      
      if (!customerId) {
        return res.status(400).json({ 
          error: 'Customer ID is required',
          code: 'MISSING_CUSTOMER'
        })
      }

      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
          invoices: {
            where: {
              status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
              type: 'SALES',
              dueDate: { lt: new Date() }
            },
            select: {
              id: true,
              invoiceNo: true,
              balance: true,
              dueDate: true,
            }
          }
        }
      })

      if (!customer) {
        return res.status(404).json({ 
          error: 'Customer not found',
          code: 'CUSTOMER_NOT_FOUND'
        })
      }

      // Calculate total overdue amount
      const totalOverdue = customer.invoices.reduce((sum, inv) => sum + inv.balance, 0)
      const overdueInvoices = customer.invoices.length

      // Check if customer is on credit hold
      if (customer.creditStatus === 'SUSPENDED' || customer.creditStatus === 'BLACKLISTED') {
        return res.status(403).json({
          error: `Customer credit status is ${customer.creditStatus.toLowerCase()}. Operation blocked.`,
          code: 'CREDIT_BLOCKED',
          details: {
            customerId: customer.id,
            customerName: customer.name,
            creditStatus: customer.creditStatus,
            totalOverdue,
            overdueInvoices
          }
        })
      }

      // Check if customer has exceeded credit limit
      const totalOutstanding = await prisma.invoice.aggregate({
        where: {
          customerId: customer.id,
          status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
          type: 'SALES'
        },
        _sum: { balance: true }
      })

      const currentBalance = totalOutstanding._sum.balance || 0
      
      if (customer.creditLimit > 0 && currentBalance > customer.creditLimit) {
        return res.status(403).json({
          error: 'Customer has exceeded credit limit',
          code: 'CREDIT_LIMIT_EXCEEDED',
          details: {
            customerId: customer.id,
            customerName: customer.name,
            creditLimit: customer.creditLimit,
            currentBalance,
            exceededBy: currentBalance - customer.creditLimit
          }
        })
      }

      // Check for overdue invoices
      if (overdueInvoices > 0) {
        // Allow if overdue amount is small (< 10% of credit limit)
        const threshold = customer.creditLimit * 0.1
        if (totalOverdue > threshold) {
          return res.status(403).json({
            error: 'Customer has significant overdue invoices. Operation blocked.',
            code: 'OVERDUE_INVOICES',
            details: {
              customerId: customer.id,
              customerName: customer.name,
              totalOverdue,
              overdueInvoices,
              overdueInvoiceDetails: customer.invoices.map(inv => ({
                invoiceNo: inv.invoiceNo,
                balance: inv.balance,
                dueDate: inv.dueDate
              }))
            }
          })
        }
      }

      // Attach credit info to request for later use
      ;(req as any).creditInfo = {
        customerId: customer.id,
        customerName: customer.name,
        creditStatus: customer.creditStatus,
        creditLimit: customer.creditLimit,
        currentBalance,
        availableCredit: customer.creditLimit - currentBalance,
        totalOverdue,
        overdueInvoices
      }

      next()
    } catch (error) {
      console.error('Credit check error:', error)
      res.status(500).json({ 
        error: 'Credit check failed',
        code: 'CREDIT_CHECK_ERROR'
      })
    }
  }
}

/**
 * Standalone function to check credit status (for use in services)
 */
export async function checkCustomerCredit(customerId: string): Promise<{
  allowed: boolean
  reason?: string
  details: {
    creditStatus: string
    creditLimit: number
    currentBalance: number
    availableCredit: number
    totalOverdue: number
    overdueInvoices: number
  }
}> {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      invoices: {
        where: {
          status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
          type: 'SALES',
          dueDate: { lt: new Date() }
        },
        select: { balance: true }
      }
    }
  })

  if (!customer) {
    return {
      allowed: false,
      reason: 'Customer not found',
      details: null as any
    }
  }

  const totalOverdue = customer.invoices.reduce((sum, inv) => sum + inv.balance, 0)
  const overdueInvoices = customer.invoices.length

  const totalOutstanding = await prisma.invoice.aggregate({
    where: {
      customerId: customer.id,
      status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
      type: 'SALES'
    },
    _sum: { balance: true }
  })

  const currentBalance = totalOutstanding._sum.balance || 0

  // Check various credit block conditions
  if (customer.creditStatus === 'SUSPENDED' || customer.creditStatus === 'BLACKLISTED') {
    return {
      allowed: false,
      reason: `Credit status is ${customer.creditStatus.toLowerCase()}`,
      details: {
        creditStatus: customer.creditStatus,
        creditLimit: customer.creditLimit,
        currentBalance,
        availableCredit: customer.creditLimit - currentBalance,
        totalOverdue,
        overdueInvoices
      }
    }
  }

  if (customer.creditLimit > 0 && currentBalance > customer.creditLimit) {
    return {
      allowed: false,
      reason: 'Credit limit exceeded',
      details: {
        creditStatus: customer.creditStatus,
        creditLimit: customer.creditLimit,
        currentBalance,
        availableCredit: 0,
        totalOverdue,
        overdueInvoices
      }
    }
  }

  const threshold = customer.creditLimit * 0.1
  if (totalOverdue > threshold) {
    return {
      allowed: false,
      reason: 'Significant overdue invoices',
      details: {
        creditStatus: customer.creditStatus,
        creditLimit: customer.creditLimit,
        currentBalance,
        availableCredit: customer.creditLimit - currentBalance,
        totalOverdue,
        overdueInvoices
      }
    }
  }

  return {
    allowed: true,
    details: {
      creditStatus: customer.creditStatus,
      creditLimit: customer.creditLimit,
      currentBalance,
      availableCredit: customer.creditLimit - currentBalance,
      totalOverdue,
      overdueInvoices
    }
  }
}

/**
 * Update customer credit status based on ageing
 */
export async function updateCustomerCreditStatus(customerId: string): Promise<void> {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: {
      invoices: {
        where: {
          status: { in: ['SENT', 'PARTIAL', 'OVERDUE'] },
          type: 'SALES',
          dueDate: { lt: new Date() }
        },
        select: {
          balance: true,
          dueDate: true
        }
      }
    }
  })

  if (!customer) return

  const totalOverdue = customer.invoices.reduce((sum, inv) => sum + inv.balance, 0)
  
  // Determine new credit status based on ageing
  let newStatus = customer.creditStatus
  
  if (totalOverdue > customer.creditLimit * 0.5) {
    newStatus = 'BLACKLISTED'
  } else if (totalOverdue > customer.creditLimit * 0.2) {
    newStatus = 'SUSPENDED'
  } else if (totalOverdue > 0) {
    newStatus = 'HOLD'
  } else {
    newStatus = 'ACTIVE'
  }

  if (newStatus !== customer.creditStatus) {
    await prisma.customer.update({
      where: { id: customerId },
      data: { creditStatus: newStatus }
    })

    // Log the credit status change
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        entityType: 'Customer',
        entityId: customerId,
        oldValues: { creditStatus: customer.creditStatus },
        newValues: { creditStatus: newStatus },
        description: `Credit status auto-updated from ${customer.creditStatus} to ${newStatus}`
      }
    })
  }
}
