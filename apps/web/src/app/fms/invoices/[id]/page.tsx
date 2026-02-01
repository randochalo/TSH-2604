import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  ArrowLeft, 
  FileText, 
  Calendar,
  DollarSign,
  Building2,
  CheckCircle,
  Clock,
  AlertCircle,
  Printer,
  Send,
  CreditCard
} from 'lucide-react'

async function getInvoice(id: string) {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/invoices/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const invoice = await getInvoice(params.id)

  if (!invoice) {
    return (
      <DashboardLayout user={session.user}>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Invoice not found</h2>
          <Link href="/fms/invoices" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Back to Invoices
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount || 0)
  }

  const statusColors: Record<string, string> = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    PARTIAL: 'bg-blue-100 text-blue-800',
    OVERDUE: 'bg-red-100 text-red-800',
    SENT: 'bg-purple-100 text-purple-800',
    DRAFT: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  }

  const isOverdue = invoice.dueDate && new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID'

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Back Link */}
        <Link href="/fms/invoices" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Invoices
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{invoice.invoiceNo}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[invoice.status]}`}>
                  {invoice.status}
                </span>
                {isOverdue && (
                  <span className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            {invoice.status === 'DRAFT' && (
              <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Send className="w-4 h-4 mr-2" />
                Send
              </button>
            )}
            {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && invoice.type === 'AR' && (
              <Link
                href="/fms/payments"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Record Payment
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoice Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Invoice Date</p>
                  <p className="font-medium">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Reference</p>
                  <p className="font-medium">{invoice.referenceNo || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Currency</p>
                  <p className="font-medium">{invoice.currency || 'MYR'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Party Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {invoice.type === 'AR' ? 'Bill To' : 'Vendor'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-lg">{invoice.customer?.name || invoice.vendor?.name}</p>
                  <p className="text-sm text-gray-500">{invoice.customer?.code || invoice.vendor?.code}</p>
                </div>
              </div>
              {invoice.customer && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-1">Contact Person</p>
                  <p className="font-medium">{invoice.customer.contactPerson || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{invoice.customer.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Amount Summary</h2>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Tax</span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-green-600">-{formatCurrency(invoice.discountAmount)}</span>
                </div>
              )}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">{formatCurrency(invoice.total)}</span>
                </div>
              </div>
              {invoice.paidAmount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Paid</span>
                  <span className="text-green-600">{formatCurrency(invoice.paidAmount)}</span>
                </div>
              )}
              {invoice.balance > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Balance</span>
                  <span className="text-orange-600 font-medium">{formatCurrency(invoice.balance)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Quantity</th>
                  <th className="px-6 py-4 text-right">Unit Price</th>
                  <th className="px-6 py-4 text-right">Tax</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items?.length > 0 ? (
                  invoice.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium">{item.description}</p>
                        {item.sku && <p className="text-xs text-gray-500">{item.sku}</p>}
                      </td>
                      <td className="px-6 py-4 text-right">{item.quantity}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(item.taxAmount)}</td>
                      <td className="px-6 py-4 text-right font-medium">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No line items
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* e-Invoice Section */}
        {invoice.eInvoiceStatus && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">e-Invoice (MyInvois)</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    invoice.eInvoiceStatus === 'VALIDATED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {invoice.eInvoiceStatus}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">UUID</p>
                  <p className="font-medium text-sm font-mono">{invoice.eInvoiceUuid || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Validated At</p>
                  <p className="font-medium">{invoice.eInvoiceValidatedAt ? new Date(invoice.eInvoiceValidatedAt).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        {invoice.payments?.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Reference</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.payments.map((payment: any) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">{payment.referenceNo || '-'}</td>
                      <td className="px-6 py-4 text-right font-medium text-green-600">{formatCurrency(payment.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
