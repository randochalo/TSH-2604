import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Plus, Search, Package, ArrowRight } from 'lucide-react'

async function getContainers() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/containers`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export default async function ContainersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const containers = await getContainers()

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Containers</h1>
            <p className="text-gray-600">Manage container inventory and assignments</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Container
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search container number..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Sizes</option>
            <option value="20">20ft</option>
            <option value="40">40ft</option>
            <option value="45">45ft</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value="GP">General Purpose</option>
            <option value="HC">High Cube</option>
            <option value="RF">Reefer</option>
            <option value="OT">Open Top</option>
          </select>
        </div>

        {/* Containers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {containers.length > 0 ? (
            containers.map((container: any) => (
              <div key={container.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{container.containerNo}</h3>
                      <p className="text-sm text-gray-500">{container.size} {container.type}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipment:</span>
                    <span className="font-medium">{container.shipment?.shipmentNo || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Gross Weight:</span>
                    <span className="font-medium">{container.grossWeight || 0} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Volume:</span>
                    <span className="font-medium">{container.volume || 0} CBM</span>
                  </div>
                  {container.sealNo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Seal No:</span>
                      <span className="font-medium">{container.sealNo}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/ffs/shipments/${container.shipmentId}`}
                    className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Shipment
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-lg shadow">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No containers found</h3>
              <p className="text-gray-500 mt-1">Containers will appear here when added to shipments</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}