import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  Container, 
  MapPin, 
  ArrowRightLeft,
  Train,
  Package,
  TrendingUp,
  AlertCircle,
  Clock
} from 'lucide-react'

export default async function TMSPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const stats = [
    { name: 'Yard Occupancy', value: '78%', icon: Container },
    { name: 'Gate Queue', value: '12', icon: ArrowRightLeft },
    { name: 'Rail Ops', value: '3', icon: Train },
    { name: 'Alerts', value: '2', icon: AlertCircle, alert: true },
  ]

  const quickActions = [
    { name: 'Gate In', href: '/tms/gate', icon: ArrowRightLeft, color: 'bg-green-500' },
    { name: 'Gate Out', href: '/tms/gate', icon: ArrowRightLeft, color: 'bg-red-500' },
    { name: 'Yard View', href: '/tms/yard', icon: MapPin, color: 'bg-blue-500' },
    { name: 'Rail Manifest', href: '/tms/rail', icon: Train, color: 'bg-purple-500' },
  ]

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Terminal Management</h1>
            <p className="text-gray-600">Container yard operations and gate management</p>
          </div>
          <Link
            href="/tms/gate"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Gate Operations
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

          {/* Recent Gate Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Gate Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {[
                { container: 'MSCU1234567', type: 'GATE_IN', time: '10:30 AM', truck: 'WB1234A' },
                { container: 'APLU7654321', type: 'GATE_OUT', time: '10:15 AM', truck: 'WB5678B' },
                { container: 'COSU9876543', type: 'GATE_IN', time: '09:45 AM', truck: 'WB9012C' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${activity.type === 'GATE_IN' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <ArrowRightLeft className={`w-4 h-4 ${activity.type === 'GATE_IN' ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.container}</p>
                      <p className="text-sm text-gray-500">Truck: {activity.truck}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.type === 'GATE_IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {activity.type === 'GATE_IN' ? 'Gate In' : 'Gate Out'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link href="/tms/yard" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Yard View</h3>
                <p className="text-sm text-gray-500">Container placement</p>
              </div>
            </div>
          </Link>

          <Link href="/tms/gate" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowRightLeft className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Gate Pass</h3>
                <p className="text-sm text-gray-500">Gate operations</p>
              </div>
            </div>
          </Link>

          <Link href="/tms/containers" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Container className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Containers</h3>
                <p className="text-sm text-gray-500">Container tracking</p>
              </div>
            </div>
          </Link>

          <Link href="/tms/rail" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Train className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Rail Ops</h3>
                <p className="text-sm text-gray-500">KTMB operations</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}