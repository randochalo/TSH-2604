import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  FileText, 
  Truck, 
  Ship, 
  Warehouse,
  Activity,
  CreditCard,
  Users,
  AlertCircle,
  History
} from 'lucide-react'

const reportCategories = [
  {
    title: 'Financial Reports',
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    reports: [
      { name: 'Profit & Loss', path: '/reports/financial/profit-loss', icon: <TrendingUp className="w-4 h-4" /> },
      { name: 'Balance Sheet', path: '/reports/financial/balance-sheet', icon: <PieChart className="w-4 h-4" /> },
      { name: 'Cash Flow', path: '/reports/financial/cash-flow', icon: <Activity className="w-4 h-4" /> },
      { name: 'GST Report', path: '/reports/financial/gst-report', icon: <FileText className="w-4 h-4" /> },
      { name: 'Debtors Ageing', path: '/reports/financial/debtors-ageing', icon: <CreditCard className="w-4 h-4" /> },
      { name: 'Creditors Ageing', path: '/reports/financial/creditors-ageing', icon: <CreditCard className="w-4 h-4" /> },
      { name: 'Budget vs Actual', path: '/reports/financial/budget', icon: <BarChart3 className="w-4 h-4" /> },
    ]
  },
  {
    title: 'Freight Reports',
    icon: <Ship className="w-6 h-6 text-green-600" />,
    reports: [
      { name: 'Shipments by Trade Lane', path: '/reports/freight/shipments-by-lane', icon: <TrendingUp className="w-4 h-4" /> },
      { name: 'Carrier Performance', path: '/reports/freight/carrier-performance', icon: <Activity className="w-4 h-4" /> },
      { name: 'Revenue by Customer', path: '/reports/freight/revenue-by-customer', icon: <Users className="w-4 h-4" /> },
    ]
  },
  {
    title: 'Fleet Reports',
    icon: <Truck className="w-6 h-6 text-orange-600" />,
    reports: [
      { name: 'Vehicle Utilization', path: '/reports/fleet/vehicle-utilization', icon: <Truck className="w-4 h-4" /> },
      { name: 'Driver Performance', path: '/reports/fleet/driver-performance', icon: <Users className="w-4 h-4" /> },
      { name: 'Trip Analysis', path: '/reports/fleet/trip-analysis', icon: <Activity className="w-4 h-4" /> },
    ]
  },
  {
    title: 'Audit & Compliance',
    icon: <AlertCircle className="w-6 h-6 text-purple-600" />,
    reports: [
      { name: 'Audit Trail', path: '/reports/audit/audit-log', icon: <History className="w-4 h-4" /> },
    ]
  },
]

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive reporting across all modules</p>
          </div>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b flex items-center gap-3">
                {category.icon}
                <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {category.reports.map((report) => (
                    <Link
                      key={report.path}
                      href={report.path}
                      className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-gray-400 group-hover:text-blue-600 transition-colors">
                        {report.icon}
                      </span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                        {report.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">7</p>
              <p className="text-sm text-gray-600">Financial Reports</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-sm text-gray-600">Freight Reports</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">3</p>
              <p className="text-sm text-gray-600">Fleet Reports</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">1</p>
              <p className="text-sm text-gray-600">Audit Reports</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
