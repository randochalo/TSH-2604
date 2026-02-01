import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { prisma } from '@logisticspro/database'
import { Star, Phone, Mail } from 'lucide-react'

export default async function DriversPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const drivers = await prisma.driver.findMany({
    include: {
      user: true,
      jobs: {
        where: {
          status: {
            in: ['ASSIGNED', 'DISPATCHED', 'IN_TRANSIT'],
          },
        },
      },
      _count: {
        select: { jobs: true },
      },
    },
    orderBy: {
      user: {
        firstName: 'asc',
      },
    },
  })

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
          <p className="text-gray-600">Manage drivers and assignments</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Total Drivers</p>
            <p className="text-2xl font-bold">{drivers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">On Duty</p>
            <p className="text-2xl font-bold">
              {drivers.filter((d) => d.jobs.length > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Available</p>
            <p className="text-2xl font-bold">
              {drivers.filter((d) => d.jobs.length === 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Avg Rating</p>
            <p className="text-2xl font-bold">
              {(drivers.reduce((acc, d) => acc + d.rating, 0) / drivers.length || 0).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div key={driver.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {driver.user.firstName[0]}{driver.user.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {driver.user.firstName} {driver.user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{driver.employeeNo || 'No ID'}</p>
                  </div>
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm font-medium">{driver.rating}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {driver.user.email}
                </div>
                {driver.user.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {driver.user.phone}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">License</p>
                  <p className="font-medium">{driver.licenseNo}</p>
                  <p className="text-xs text-gray-500">
                    Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Current Status</p>
                  <p className={`font-medium ${driver.jobs.length > 0 ? 'text-blue-600' : 'text-green-600'}`}>
                    {driver.jobs.length > 0 ? 'On Job' : 'Available'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                <span className="text-gray-600">Total Jobs: <strong>{driver._count.jobs}</strong></span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
