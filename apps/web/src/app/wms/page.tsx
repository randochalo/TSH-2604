import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  Warehouse, 
  Package, 
  MapPin, 
  ClipboardList,
  ArrowRightLeft,
  Barcode,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

export default async function WMSPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const stats = [
    { name: 'Total SKUs', value: '1,234', icon: Package },
    { name: 'Locations', value: '456', icon: MapPin },
    { name: 'Stock Value', value: 'RM 12.5M', icon: TrendingUp },
    { name: 'Alerts', value: '5', icon: AlertCircle, alert: true },
  ]

  const quickActions = [
    { name: 'Goods Receipt', href: '/wms/movements', icon: ArrowRightLeft, color: 'bg-green-500' },
    { name: 'Put Away', href: '/wms/locations', icon: MapPin, color: 'bg-blue-500' },
    { name: 'Picking', href: '/wms/movements', icon: Package, color: 'bg-purple-500' },
    { name: 'Scan Barcode', href: '#', icon: Barcode, color: 'bg-orange-500' },
  ]

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Warehouse Management</h1>
            <p className="text-gray-600">Inventory control and warehouse operations</p>
          </div>
          <Link
            href="/wms/inventory"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Package className="w-4 h-4 mr-2" />
            View Inventory
          </Link>
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
                    <p className={`text-2xl font-bold mt-1 ${stat.alert ? 'text-red-600' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.alert ? 'bg-red-50' : 'bg-blue-50'}`}>
                    <Icon className={`w-6 h-6 ${stat.alert ? 'text-red-600' : 'text-blue-600'}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Warehouse Operations</h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className={`p-3 rounded-lg ${action.color} mb-2`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{action.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { sku: 'SKU-001', name: 'Electronic Components', qty: 5, min: 20 },
                { sku: 'SKU-045', name: 'Packaging Materials', qty: 12, min: 50 },
                { sku: 'SKU-112', name: 'Safety Equipment', qty: 3, min: 15 },
              ].map((item) => (
                <div key={item.sku} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {item.qty} units left
                    </p>
                    <p className="text-xs text-gray-500">Min: {item.min}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/wms/inventory" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Inventory</h3>
                <p className="text-sm text-gray-500">Stock levels and items</p>
              </div>
            </div>
          </Link>

          <Link href="/wms/locations" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Locations</h3>
                <p className="text-sm text-gray-500">Warehouse zones and bins</p>
              </div>
            </div>
          </Link>

          <Link href="/wms/movements" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ArrowRightLeft className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Movements</h3>
                <p className="text-sm text-gray-500">Receipts and issues</p>
              </div>
            </div>
          </Link>

          <Link href="/wms/cycle-count" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ClipboardList className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cycle Count</h3>
                <p className="text-sm text-gray-500">Stock verification</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}