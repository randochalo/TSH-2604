import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ArrowLeft, 
  ShieldAlert, 
  ShieldCheck, 
  ShieldX,
  Bell,
  Settings,
  Users,
  AlertTriangle
} from 'lucide-react'
import Link from 'next/link'

async function getCreditControlData() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/credit-control/summary`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function CreditControlPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const data = await getCreditControlData()

  const creditStatuses = [
    { status: 'GOOD', label: 'Good Standing', count: 15, color: 'bg-green-100 text-green-800', icon: ShieldCheck },
    { status: 'HOLD', label: 'On Hold', count: 3, color: 'bg-yellow-100 text-yellow-800', icon: ShieldAlert },
    { status: 'BLOCKED', label: 'Blocked', count: 2, color: 'bg-red-100 text-red-800', icon: ShieldX },
  ]

  const alertRules = [
    { name: 'Credit Limit Exceeded', condition: 'Outstanding > Credit Limit', action: 'Block New Shipments', enabled: true },
    { name: 'Overdue 30 Days', condition: 'Invoice > 30 days overdue', action: 'Send Reminder', enabled: true },
    { name: 'Overdue 60 Days', condition: 'Invoice > 60 days overdue', action: 'Put on Hold', enabled: true },
    { name: 'Overdue 90 Days', condition: 'Invoice > 90 days overdue', action: 'Block & Escalate', enabled: true },
    { name: 'New Customer Limit', condition: 'First 3 months', action: '50% Credit Limit', enabled: true },
  ]

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/fms" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Credit Control</h1>
              <p className="text-gray-600">Manage customer credit limits and overdue enforcement</p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Settings className="w-4 h-4 mr-2" />
            Configure Rules
          </button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {creditStatuses.map((status) => (
            <Card key={status.status}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{status.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{status.count}</p>
                    <p className="text-xs text-gray-500 mt-1">customers</p>
                  </div>
                  <div className={`p-3 rounded-full ${status.color}`}>
                    <status.icon className="w-8 h-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credit Alert Rules */}
          <Card>
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-900 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Automated Alert Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {alertRules.map((rule, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{rule.name}</p>
                      <p className="text-sm text-gray-600">{rule.condition}</p>
                      <p className="text-xs text-blue-600 mt-1">Action: {rule.action}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Credit Block Status */}
          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-900 flex items-center gap-2">
                <ShieldX className="w-5 h-5" />
                Blocked Customers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-900">ABC Trading Sdn Bhd</p>
                    <p className="text-sm text-red-700">Outstanding: RM 485,000 | Limit: RM 400,000</p>
                    <p className="text-xs text-red-600 mt-1">Blocked: Credit limit exceeded</p>
                  </div>
                  <button className="px-3 py-1 text-sm text-red-700 border border-red-300 rounded hover:bg-red-100">
                    Review
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="font-medium text-red-900">Global Freight Ltd</p>
                    <p className="text-sm text-red-700">Overdue: RM 125,000 (95 days)</p>
                    <p className="text-xs text-red-600 mt-1">Blocked: 90+ days overdue</p>
                  </div>
                  <button className="px-3 py-1 text-sm text-red-700 border border-red-300 rounded hover:bg-red-100">
                    Review
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credit Summary by Customer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Credit Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium text-right">Credit Limit</th>
                    <th className="px-4 py-3 font-medium text-right">Outstanding</th>
                    <th className="px-4 py-3 font-medium text-right">Available</th>
                    <th className="px-4 py-3 font-medium text-right">Overdue</th>
                    <th className="px-4 py-3 font-medium text-center">Status</th>
                    <th className="px-4 py-3 font-medium text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">XYZ Logistics</td>
                    <td className="px-4 py-3 text-right">RM 500,000</td>
                    <td className="px-4 py-3 text-right">RM 125,000</td>
                    <td className="px-4 py-3 text-right text-green-600">RM 375,000</td>
                    <td className="px-4 py-3 text-right">RM 0</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Good</span>
                    </td>
                    <td className="px-4 py-3 text-center">-</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Asia Shipping Co</td>
                    <td className="px-4 py-3 text-right">RM 300,000</td>
                    <td className="px-4 py-3 text-right">RM 195,000</td>
                    <td className="px-4 py-3 text-right text-yellow-600">RM 105,000</td>
                    <td className="px-4 py-3 text-right">RM 45,000</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Hold</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Review</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">ABC Trading Sdn Bhd</td>
                    <td className="px-4 py-3 text-right">RM 400,000</td>
                    <td className="px-4 py-3 text-right">RM 485,000</td>
                    <td className="px-4 py-3 text-right text-red-600">-RM 85,000</td>
                    <td className="px-4 py-3 text-right">RM 125,000</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Blocked</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Review</button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">Port Logistics Inc</td>
                    <td className="px-4 py-3 text-right">RM 600,000</td>
                    <td className="px-4 py-3 text-right">RM 185,000</td>
                    <td className="px-4 py-3 text-right text-green-600">RM 415,000</td>
                    <td className="px-4 py-3 text-right">RM 0</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Good</span>
                    </td>
                    <td className="px-4 py-3 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Enforcement Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900">Credit Enforcement Active</h4>
                <p className="text-sm text-blue-700 mt-1">
                  The system automatically blocks new shipments for customers exceeding their credit limit 
                  or with invoices overdue by 90+ days. This enforcement applies to all modules: FFS, HMS, WMS, and TMS.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
