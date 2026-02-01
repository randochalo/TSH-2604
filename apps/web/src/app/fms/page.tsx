import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  DollarSign, 
  Users, 
  FileText, 
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3
} from 'lucide-react'

async function getDashboardData() {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3001'
    
    const [customersRes, vendorsRes, invoicesRes, paymentsRes] = await Promise.all([
      fetch(`${apiUrl}/api/customers`, { cache: 'no-store' }),
      fetch(`${apiUrl}/api/vendors`, { cache: 'no-store' }),
      fetch(`${apiUrl}/api/invoices`, { cache: 'no-store' }),
      fetch(`${apiUrl}/api/payments`, { cache: 'no-store' }),
    ])

    const customers = customersRes.ok ? await customersRes.json() : []
    const vendors = vendorsRes.ok ? await vendorsRes.json() : []
    const invoices = invoicesRes.ok ? await invoicesRes.json() : []
    const payments = paymentsRes.ok ? await paymentsRes.json() : []

    // Calculate KPIs
    const totalAR = invoices
      .filter((inv: any) => inv.type === 'AR')
      .reduce((sum: number, inv: any) => sum + (inv.balance || 0), 0)
    
    const totalAP = invoices
      .filter((inv: any) => inv.type === 'AP')
      .reduce((sum: number, inv: any) => sum + (inv.balance || 0), 0)

    const monthlyRevenue = invoices
      .filter((inv: any) => inv.type === 'AR' && inv.status === 'PAID')
      .filter((inv: any) => {
        const date = new Date(inv.invoiceDate)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      })
      .reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)

    const outstandingInvoices = invoices.filter((inv: any) => inv.status !== 'PAID' && inv.status !== 'CANCELLED').length

    const overdueInvoices = invoices.filter((inv: any) => {
      if (inv.status === 'PAID' || inv.status === 'CANCELLED') return false
      const dueDate = new Date(inv.dueDate)
      return dueDate < new Date()
    })

    const recentInvoices = invoices.slice(0, 5)
    const pendingPayments = payments.filter((p: any) => p.status === 'PENDING').slice(0, 5)

    return {
      kpis: {
        totalAR,
        totalAP,
        monthlyRevenue,
        outstandingInvoices,
      },
      overdueInvoices,
      recentInvoices,
      pendingPayments,
      counts: {
        customers: customers.length,
        vendors: vendors.length,
        invoices: invoices.length,
      }
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return {
      kpis: { totalAR: 0, totalAP: 0, monthlyRevenue: 0, outstandingInvoices: 0 },
      overdueInvoices: [],
      recentInvoices: [],
      pendingPayments: [],
      counts: { customers: 0, vendors: 0, invoices: 0 }
    }
  }
}

export default async function FMSPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const data = await getDashboardData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount)
  }

  const stats = [
    { 
      name: 'Total A/R', 
      value: formatCurrency(data.kpis.totalAR), 
      icon: TrendingUp,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      name: 'Total A/P', 
      value: formatCurrency(data.kpis.totalAP), 
      icon: TrendingDown,
      color: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    { 
      name: 'Monthly Revenue', 
      value: formatCurrency(data.kpis.monthlyRevenue), 
      icon: DollarSign,
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    { 
      name: 'Outstanding', 
      value: data.kpis.outstandingInvoices.toString(), 
      icon: Clock,
      color: 'bg-yellow-50',
      iconColor: 'text-yellow-600'
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PAID: 'bg-green-100 text-green-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      PARTIAL: 'bg-blue-100 text-blue-800',
      OVERDUE: 'bg-red-100 text-red-800',
      SENT: 'bg-purple-100 text-purple-800',
      DRAFT: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
            <p className="text-gray-600">Financial operations and accounting</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/fms/invoices"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Invoices
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold mt-1 text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Alerts Section */}
        {data.overdueInvoices.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="font-medium text-red-800">
                {data.overdueInvoices.length} overdue invoice{data.overdueInvoices.length > 1 ? 's' : ''} requiring attention
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <Link
                href="/fms/invoices"
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="p-3 rounded-lg bg-blue-500 mb-2">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Create Invoice</span>
              </Link>
              <Link
                href="/fms/payments"
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <div className="p-3 rounded-lg bg-green-500 mb-2">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Record Payment</span>
              </Link>
              <Link
                href="/fms/customers"
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <div className="p-3 rounded-lg bg-purple-500 mb-2">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Add Customer</span>
              </Link>
              <Link
                href="/fms/e-invoicing"
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors"
              >
                <div className="p-3 rounded-lg bg-orange-500 mb-2">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">e-Invoice</span>
              </Link>
            </div>
          </div>

          {/* Recent Invoices */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
              <Link href="/fms/invoices" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {data.recentInvoices.length > 0 ? (
                data.recentInvoices.map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{invoice.invoiceNo}</p>
                        <p className="text-sm text-gray-500">
                          {invoice.customer?.name || invoice.vendor?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(invoice.total)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>No recent invoices</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/fms/customers" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Customers</h3>
                <p className="text-sm text-gray-500">{data.counts.customers} accounts</p>
              </div>
            </div>
          </Link>

          <Link href="/fms/vendors" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Vendors</h3>
                <p className="text-sm text-gray-500">{data.counts.vendors} suppliers</p>
              </div>
            </div>
          </Link>

          <Link href="/fms/chart-of-accounts" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Chart of Accounts</h3>
                <p className="text-sm text-gray-500">GL management</p>
              </div>
            </div>
          </Link>

          <Link href="/fms/fixed-assets" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Fixed Assets</h3>
                <p className="text-sm text-gray-500">Asset register</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
