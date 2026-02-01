import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  FileText,
  Edit,
  Package,
  Users
} from 'lucide-react'

async function getCustomer(id: string) {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/customers/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const customer = await getCustomer(params.id)

  if (!customer) {
    return (
      <DashboardLayout user={session.user}>
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Customer not found</h2>
          <Link href="/fms/customers" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Back to Customers
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount || 0)
  }

  const statusColors: Record<string, string> = {
    GOOD: 'bg-green-100 text-green-800',
    HOLD: 'bg-yellow-100 text-yellow-800',
    BLOCKED: 'bg-red-100 text-red-800',
  }

  const invoiceStatusColors: Record<string, string> = {
    PAID: 'bg-green-100 text-green-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    PARTIAL: 'bg-blue-100 text-blue-800',
    OVERDUE: 'bg-red-100 text-red-800',
    SENT: 'bg-purple-100 text-purple-800',
    DRAFT: 'bg-gray-100 text-gray-800',
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Back Link */}
        <Link href="/fms/customers" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customers
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-sm text-gray-500">{customer.code}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[customer.creditStatus] || 'bg-gray-100 text-gray-800'}`}>
                  {customer.creditStatus}
                </span>
              </div>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Company Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Registration No</p>
                  <p className="font-medium">{customer.registrationNo || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.phone || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{customer.address || 'N/A'}</p>
                  <p className="text-sm text-gray-500">
                    {customer.city}{customer.city && customer.postcode ? ', ' : ''}{customer.postcode}
                  </p>
                  <p className="text-sm text-gray-500">{customer.state}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Info */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Credit Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Credit Limit</p>
                  <p className="font-medium text-lg">{formatCurrency(customer.creditLimit)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Credit Terms</p>
                  <p className="font-medium">{customer.creditTerms ? `${customer.creditTerms} days` : 'N/A'}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Outstanding Invoices</span>
                  <span className="font-medium">{customer._count?.invoices || 0}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">Active Jobs</span>
                  <span className="font-medium">{customer._count?.haulageJobs || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Person */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Primary Contact</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{customer.contactPerson || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.contactEmail || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.contactPhone || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4">Invoice No</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Due Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {customer.invoices?.length > 0 ? (
                  customer.invoices.map((invoice: any) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{invoice.invoiceNo}</td>
                      <td className="px-6 py-4">{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{formatCurrency(invoice.total)}</td>
                      <td className="px-6 py-4">{formatCurrency(invoice.balance)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${invoiceStatusColors[invoice.status] || 'bg-gray-100 text-gray-800'}`}>
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p>No invoices found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
