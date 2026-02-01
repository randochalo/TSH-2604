import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Search, FileText, CheckCircle, AlertCircle, Clock, XCircle, RefreshCw, Send, Shield } from 'lucide-react'

async function getEInvoiceData() {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:3001'
    
    const [invoicesRes, einvoiceStatusRes] = await Promise.all([
      fetch(`${apiUrl}/api/invoices`, { cache: 'no-store' }),
      fetch(`${apiUrl}/api/einvoice/status`, { cache: 'no-store' }).catch(() => null),
    ])

    const invoices = invoicesRes.ok ? await invoicesRes.json() : []
    
    // Filter invoices with e-invoice status or pending submission
    const einvoiceInvoices = invoices.filter((inv: any) => 
      inv.eInvoiceStatus || inv.status === 'SENT' || inv.status === 'PENDING'
    )

    return {
      invoices: einvoiceInvoices,
      summary: {
        pending: einvoiceInvoices.filter((inv: any) => !inv.eInvoiceStatus).length,
        validated: einvoiceInvoices.filter((inv: any) => inv.eInvoiceStatus === 'VALIDATED').length,
        rejected: einvoiceInvoices.filter((inv: any) => inv.eInvoiceStatus === 'REJECTED').length,
        cancelled: einvoiceInvoices.filter((inv: any) => inv.eInvoiceStatus === 'CANCELLED').length,
      },
      integrationStatus: {
        connected: true, // Mock status - would come from API
        lastSync: new Date().toISOString(),
      }
    }
  } catch (error) {
    return {
      invoices: [],
      summary: { pending: 0, validated: 0, rejected: 0, cancelled: 0 },
      integrationStatus: { connected: false, lastSync: null }
    }
  }
}

export default async function EInvoicingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const data = await getEInvoiceData()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount || 0)
  }

  const statusColors: Record<string, string> = {
    VALIDATED: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    REJECTED: 'bg-red-100 text-red-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    PENDING_CANCELLATION: 'bg-orange-100 text-orange-800',
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">e-Invoicing (MyInvois)</h1>
            <p className="text-gray-600">IRBM MyInvois integration and submission status</p>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Status
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Send className="w-4 h-4 mr-2" />
              Submit Pending
            </button>
          </div>
        </div>

        {/* Integration Status Banner */}
        <div className={`rounded-lg p-4 ${data.integrationStatus.connected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center">
            {data.integrationStatus.connected ? (
              <>
                <Shield className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-green-800">MyInvois Integration Active</p>
                  <p className="text-sm text-green-600">
                    Last synced: {data.integrationStatus.lastSync ? new Date(data.integrationStatus.lastSync).toLocaleString() : 'Never'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <div>
                  <p className="font-medium text-red-800">MyInvois Integration Disconnected</p>
                  <p className="text-sm text-red-600">Please check your API credentials and connection settings</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Submission</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">{data.summary.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validated</p>
                <p className="text-2xl font-bold mt-1 text-green-600">{data.summary.validated}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold mt-1 text-red-600">{data.summary.rejected}</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Submitted</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">
                  {data.summary.validated + data.summary.rejected + data.summary.cancelled}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoice number..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="VALIDATED">Validated</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <input
            type="date"
            placeholder="From Date"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* e-Invoice Submissions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">e-Invoice Submissions</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Invoice No</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">e-Invoice Status</th>
                <th className="px-6 py-4">UUID</th>
                <th className="px-6 py-4">Validated At</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.invoices.length > 0 ? (
                data.invoices.map((invoice: any) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{invoice.invoiceNo}</td>
                    <td className="px-6 py-4">{invoice.customer?.name || '-'}</td>
                    <td className="px-6 py-4">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(invoice.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[invoice.eInvoiceStatus] || 'bg-gray-100 text-gray-800'}`}>
                        {invoice.eInvoiceStatus || 'PENDING'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {invoice.eInvoiceUuid ? (
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {invoice.eInvoiceUuid.substring(0, 16)}...
                        </code>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {invoice.eInvoiceValidatedAt 
                        ? new Date(invoice.eInvoiceValidatedAt).toLocaleString()
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/fms/invoices/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                        {!invoice.eInvoiceStatus && (
                          <button className="text-green-600 hover:text-green-800 text-xs font-medium">
                            Submit
                          </button>
                        )}
                        {invoice.eInvoiceStatus === 'REJECTED' && (
                          <button className="text-orange-600 hover:text-orange-800 text-xs font-medium">
                            Retry
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No e-invoice submissions found</p>
                    <p className="text-sm">Submit invoices to MyInvois to see them here</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Validation Results Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Validation Results</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Sample validation entries - in real app these would come from API */}
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">Invoice INV-ABC123 Validated</p>
                  <p className="text-sm text-green-600">Successfully validated by IRBM MyInvois</p>
                  <p className="text-xs text-green-500 mt-1">{new Date().toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800">Invoice INV-XYZ789 Submitted</p>
                  <p className="text-sm text-yellow-600">Pending validation from IRBM</p>
                  <p className="text-xs text-yellow-500 mt-1">{new Date().toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Handling Interface */}
        {data.summary.rejected > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-red-800">Rejected Submissions</h3>
            </div>
            <p className="text-sm text-red-600 mb-3">
              {data.summary.rejected} invoice(s) were rejected by MyInvois. Please review and resubmit.
            </p>
            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                View Rejected
              </button>
              <button className="px-4 py-2 border border-red-300 rounded-lg hover:bg-red-100 text-sm text-red-700">
                Download Error Report
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
