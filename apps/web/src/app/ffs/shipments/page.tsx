import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Plus, Search, Filter, Ship, Plane, Truck, Train } from 'lucide-react'

async function getShipments() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/shipments`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export default async function ShipmentsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const shipments = await getShipments()

  const statusColors: Record<string, string> = {
    BOOKED: 'bg-gray-100 text-gray-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
    ARRIVED: 'bg-purple-100 text-purple-800',
    CUSTOMS_HOLD: 'bg-red-100 text-red-800',
    CLEARED: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  const modeIcons: Record<string, React.ReactNode> = {
    SEA: <Ship className="w-4 h-4" />,
    AIR: <Plane className="w-4 h-4" />,
    LAND: <Truck className="w-4 h-4" />,
    RAIL: <Train className="w-4 h-4" />,
    MULTIMODAL: <Ship className="w-4 h-4" />,
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
            <p className="text-gray-600">Manage freight bookings and track shipments</p>
          </div>
          <Link
            href="/ffs/shipments/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Shipment
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search shipments..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="BOOKED">Booked</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="CLEARED">Cleared</option>
            <option value="DELIVERED">Delivered</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Modes</option>
            <option value="SEA">Sea</option>
            <option value="AIR">Air</option>
            <option value="LAND">Land</option>
            <option value="RAIL">Rail</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Shipment No</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Shipper / Consignee</th>
                <th className="px-6 py-4">BL/AWB</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">ETD/ETA</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shipments.length > 0 ? (
                shipments.map((shipment: any) => (
                  <tr key={shipment.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{shipment.shipmentNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        {modeIcons[shipment.mode]}
                        <span>{shipment.mode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div>{shipment.origin}</div>
                        <div className="text-gray-400">↓</div>
                        <div>{shipment.destination}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <div>{shipment.shipper?.name || '-'}</div>
                        <div className="text-gray-400">→</div>
                        <div>{shipment.consignee?.name || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {shipment.blNo || shipment.awbNo || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[shipment.status]}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="text-xs">
                        {shipment.etd && (
                          <div>ETD: {new Date(shipment.etd).toLocaleDateString()}</div>
                        )}
                        {shipment.eta && (
                          <div>ETA: {new Date(shipment.eta).toLocaleDateString()}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/ffs/shipments/${shipment.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No shipments found. Create your first shipment to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}