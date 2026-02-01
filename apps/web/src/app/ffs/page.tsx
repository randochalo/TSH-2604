import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  Ship, 
  Package, 
  FileText, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Globe
} from 'lucide-react'

export default async function FFSPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  // Mock stats - would be fetched from API in production
  const stats = [
    { name: 'Active Shipments', value: '156', change: '+12%', icon: Ship },
    { name: 'Containers', value: '423', change: '+8%', icon: Package },
    { name: 'Pending Customs', value: '28', change: '-5%', icon: FileText },
    { name: 'Revenue MTD', value: 'RM 2.4M', change: '+18%', icon: TrendingUp },
  ]

  const quickActions = [
    { name: 'New Shipment', href: '/ffs/shipments/new', icon: Ship, color: 'bg-blue-500' },
    { name: 'Track Shipment', href: '/ffs/shipments', icon: Globe, color: 'bg-green-500' },
    { name: 'Customs Entry', href: '/ffs/customs', icon: FileText, color: 'bg-purple-500' },
    { name: 'Rate Inquiry', href: '/ffs/rates', icon: TrendingUp, color: 'bg-orange-500' },
  ]

  const recentShipments = [
    { id: '1', no: 'SHP-ABC123', route: 'Port Klang → Singapore', status: 'IN_TRANSIT', mode: 'SEA' },
    { id: '2', no: 'SHP-DEF456', route: 'KLIA → Tokyo', status: 'BOOKED', mode: 'AIR' },
    { id: '3', no: 'SHP-GHI789', route: 'Butterworth → Bangkok', status: 'CLEARED', mode: 'LAND' },
  ]

  const statusColors: Record<string, string> = {
    BOOKED: 'bg-gray-100 text-gray-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
    ARRIVED: 'bg-purple-100 text-purple-800',
    CUSTOMS_HOLD: 'bg-red-100 text-red-800',
    CLEARED: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
  }

  const modeIcons: Record<string, string> = {
    SEA: '🚢',
    AIR: '✈️',
    LAND: '🚛',
    RAIL: '🚂',
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forwarding Management</h1>
            <p className="text-gray-600">Freight forwarding operations and shipment tracking</p>
          </div>
          <Link
            href="/ffs/shipments/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Ship className="w-4 h-4 mr-2" />
            New Shipment
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
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Icon className="w-6 h-6 text-blue-600" />
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
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
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

          {/* Recent Shipments */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Shipments</h2>
              <Link href="/ffs/shipments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentShipments.map((shipment) => (
                <Link
                  key={shipment.id}
                  href={`/ffs/shipments/${shipment.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{modeIcons[shipment.mode]}</span>
                    <div>
                      <p className="font-medium text-gray-900">{shipment.no}</p>
                      <p className="text-sm text-gray-500">{shipment.route}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[shipment.status]}`}>
                      {shipment.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/ffs/shipments" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Ship className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Shipments</h3>
                <p className="text-sm text-gray-500">Manage bookings and tracking</p>
              </div>
            </div>
          </Link>

          <Link href="/ffs/containers" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Containers</h3>
                <p className="text-sm text-gray-500">Container inventory and tracking</p>
              </div>
            </div>
          </Link>

          <Link href="/ffs/rates" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Freight Rates</h3>
                <p className="text-sm text-gray-500">Rate management and quotes</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}