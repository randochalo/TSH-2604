'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Customer {
  id: string
  code: string
  name: string
  creditStatus: 'ACTIVE' | 'HOLD' | 'SUSPENDED' | 'BLACKLISTED'
  creditLimit: number
  creditDays: number
}

interface CustomerSelectProps {
  value: string
  onChange: (customerId: string, customer?: Customer) => void
  filter?: 'all' | 'active-only'
  showCreditWarning?: boolean
  disabled?: boolean
  className?: string
  placeholder?: string
  required?: boolean
}

const creditStatusConfig = {
  ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Active', icon: '✓' },
  HOLD: { color: 'bg-yellow-100 text-yellow-800', label: 'On Hold', icon: '⚠' },
  SUSPENDED: { color: 'bg-orange-100 text-orange-800', label: 'Suspended', icon: '⛔' },
  BLACKLISTED: { color: 'bg-red-100 text-red-800', label: 'Blacklisted', icon: '✕' },
}

export function CustomerSelect({
  value,
  onChange,
  filter = 'all',
  showCreditWarning = true,
  disabled = false,
  className = '',
  placeholder = 'Select a customer...',
  required = false,
}: CustomerSelectProps) {
  const { data: session } = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (value && customers.length > 0) {
      const customer = customers.find(c => c.id === value)
      setSelectedCustomer(customer || null)
    }
  }, [value, customers])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (!response.ok) throw new Error('Failed to fetch customers')
      const data = await response.json()
      
      let filteredCustomers = data
      if (filter === 'active-only') {
        filteredCustomers = data.filter((c: Customer) => c.creditStatus === 'ACTIVE')
      }
      
      setCustomers(filteredCustomers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value
    const customer = customers.find(c => c.id === customerId)
    setSelectedCustomer(customer || null)
    onChange(customerId, customer)
  }

  const isCreditBlocked = selectedCustomer && 
    (selectedCustomer.creditStatus === 'SUSPENDED' || 
     selectedCustomer.creditStatus === 'BLACKLISTED')

  if (loading) {
    return (
      <select disabled className={`border rounded-md px-3 py-2 bg-gray-100 ${className}`}>
        <option>Loading customers...</option>
      </select>
    )
  }

  if (error) {
    return (
      <div className={`text-red-600 text-sm ${className}`}>
        Error: {error}
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          isCreditBlocked ? 'border-red-300 bg-red-50' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        <option value="">{placeholder}</option>
        {customers.map((customer) => {
          const status = creditStatusConfig[customer.creditStatus]
          return (
            <option key={customer.id} value={customer.id}>
              {customer.code} - {customer.name}
            </option>
          )
        })}
      </select>

      {selectedCustomer && showCreditWarning && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            creditStatusConfig[selectedCustomer.creditStatus].color
          }`}>
            {creditStatusConfig[selectedCustomer.creditStatus].icon} {' '}
            {creditStatusConfig[selectedCustomer.creditStatus].label}
          </span>
          
          {selectedCustomer.creditLimit > 0 && (
            <span className="text-gray-600">
              Credit Limit: RM {selectedCustomer.creditLimit.toLocaleString()}
            </span>
          )}
          
          {selectedCustomer.creditDays > 0 && (
            <span className="text-gray-600">
              Terms: {selectedCustomer.creditDays} days
            </span>
          )}
        </div>
      )}

      {isCreditBlocked && showCreditWarning && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-red-500 text-lg">⚠</span>
            <div>
              <p className="font-medium text-red-800">
                Credit Restriction Active
              </p>
              <p className="text-red-600 mt-1">
                This customer has {selectedCustomer?.creditStatus.toLowerCase()} status. 
                New jobs, shipments, and invoices will be blocked until outstanding payments are resolved.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedCustomer?.creditStatus === 'HOLD' && showCreditWarning && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 text-lg">⚠</span>
            <div>
              <p className="font-medium text-yellow-800">
                Credit Hold Warning
              </p>
              <p className="text-yellow-600 mt-1">
                This customer has overdue invoices. Operations may be restricted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function CustomerCreditBadge({ status }: { status: Customer['creditStatus'] }) {
  const config = creditStatusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon} {config.label}
    </span>
  )
}

export function CustomerCreditSummary({ customerId }: { customerId: string }) {
  const [creditInfo, setCreditInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!customerId) return
    fetchCreditInfo()
  }, [customerId])

  const fetchCreditInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/customers/${customerId}/credit`)
      if (response.ok) {
        const data = await response.json()
        setCreditInfo(data)
      }
    } catch (error) {
      console.error('Failed to fetch credit info:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-sm text-gray-500">Loading credit info...</div>
  if (!creditInfo) return null

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Credit Status</span>
        <CustomerCreditBadge status={creditInfo.creditStatus} />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Credit Limit</span>
        <span className="text-sm font-medium">RM {creditInfo.creditLimit.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Current Balance</span>
        <span className="text-sm font-medium">RM {creditInfo.currentBalance.toLocaleString()}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Available Credit</span>
        <span className={`text-sm font-medium ${creditInfo.availableCredit < 0 ? 'text-red-600' : 'text-green-600'}`}>
          RM {creditInfo.availableCredit.toLocaleString()}
        </span>
      </div>
      {creditInfo.totalOverdue > 0 && (
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm text-red-600">Total Overdue</span>
          <span className="text-sm font-medium text-red-600">
            RM {creditInfo.totalOverdue.toLocaleString()} ({creditInfo.overdueInvoices} invoices)
          </span>
        </div>
      )}
    </div>
  )
}
