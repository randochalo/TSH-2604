import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { prisma } from '@logisticspro/database'
import { Truck, Wrench, AlertTriangle } from 'lucide-react'

export default async function FleetPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const vehicles = await prisma.vehicle.findMany({
    include: {
      currentBranch: true,
      jobs: {
        where: {
          status: {
            in: ['ASSIGNED', 'DISPATCHED', 'IN_TRANSIT'],
          },
        },
      },
    },
    orderBy: { registrationNo: 'asc' },
  })

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    MAINTENANCE: 'bg-yellow-100 text-yellow-800',
    RETIRED: 'bg-gray-100 text-gray-800',
    SOLD: 'bg-red-100 text-red-800',
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600">Manage vehicles and trailers</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-2xl font-bold">{vehicles.length}</p>
              </div>
              <Truck className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {vehicles.filter((v) => v.status === 'ACTIVE').length}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-lg">●</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Maintenance</p>
                <p className="text-2xl font-bold">
                  {vehicles.filter((v) => v.status === 'MAINTENANCE').length}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Registration</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Make/Model</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Current Job</th>
                <th className="px-6 py-4">Expiring Docs</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{vehicle.registrationNo}</td>
                  <td className="px-6 py-4">{vehicle.type}</td>
                  <td className="px-6 py-4">
                    {vehicle.make} {vehicle.model}
                  </td>
                  <td className="px-6 py-4">{vehicle.capacity}T</td>
                  <td className="px-6 py-4">{vehicle.currentBranch.name}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[vehicle.status]
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {vehicle.jobs.length > 0 ? (
                      <span className="text-blue-600 font-medium">
                        {vehicle.jobs.length} active
                      </span>
                    ) : (
                      <span className="text-gray-400">Available</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {vehicle.roadTaxExpiry &&
                    new Date(vehicle.roadTaxExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? (
                      <span className="text-yellow-600 text-xs">Road Tax Soon</span>
                    ) : (
                      <span className="text-green-600 text-xs">OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
