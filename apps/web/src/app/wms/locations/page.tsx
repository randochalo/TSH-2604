import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Plus, Search, MapPin, Warehouse, Filter } from 'lucide-react'

async function getLocations() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/locations`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export default async function LocationsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const locations = await getLocations()

  const typeColors: Record<string, string> = {
    STANDARD: 'bg-gray-100 text-gray-800',
    BULK: 'bg-blue-100 text-blue-800',
    REFRIGERATED: 'bg-cyan-100 text-cyan-800',
    HAZARDOUS: 'bg-red-100 text-red-800',
    OVERSIZE: 'bg-yellow-100 text-yellow-800',
    PICKING: 'bg-purple-100 text-purple-800',
    RECEIVING: 'bg-green-100 text-green-800',
    SHIPPING: 'bg-orange-100 text-orange-800',
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Warehouse Locations</h1>
            <p className="text-gray-600">Manage storage locations and zones</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search location code..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Warehouses</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value="STANDARD">Standard</option>
            <option value="BULK">Bulk</option>
            <option value="REFRIGERATED">Refrigerated</option>
            <option value="HAZARDOUS">Hazardous</option>
          </select>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {locations.length > 0 ? (
            locations.map((location: any) => (
              <div key={location.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{location.code}</h3>
                      <p className="text-sm text-gray-500">{location.warehouse?.name}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[location.type]}`}>
                    {location.type}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Zone:</span>
                    <span className="font-medium">{location.zone}</span>
                  </div>
                  {location.aisle && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Aisle:</span>
                      <span className="font-medium">{location.aisle}</span>
                    </div>
                  )}
                  {location.rack && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Rack:</span>
                      <span className="font-medium">{location.rack}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Items:</span>
                    <span className="font-medium">{location._count?.inventory || 0}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/wms/locations/${location.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-12 bg-white rounded-lg shadow">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No locations found</h3>
              <p className="text-gray-500 mt-1">Add warehouse locations to get started</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}