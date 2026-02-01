import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { prisma } from '@logisticspro/database'
import { MapPin, Truck, Navigation } from 'lucide-react'

export default async function TrackingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const activeJobs = await prisma.haulageJob.findMany({
    where: {
      status: {
        in: ['DISPATCHED', 'AT_PICKUP', 'LOADED', 'IN_TRANSIT', 'AT_DELIVERY'],
      },
    },
    include: {
      customer: true,
      vehicle: true,
      driver: {
        include: { user: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GPS Tracking</h1>
          <p className="text-gray-600">Real-time fleet tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Jobs List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Active Jobs ({activeJobs.length})</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {activeJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{job.jobNo}</p>
                      <p className="text-xs text-gray-500">{job.customer?.name}</p>
                    </div>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {job.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {job.pickupLocation}
                    </div>
                    <div className="flex items-center mt-1">
                      <Navigation className="w-3 h-3 mr-1" />
                      {job.deliveryLocation}
                    </div>
                  </div>
                  {job.vehicle && (
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Truck className="w-3 h-3 mr-1" />
                      {job.vehicle.registrationNo}
                      {job.driver && (
                        <span className="ml-2">
                          • {job.driver.user.firstName} {job.driver.user.lastName}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {activeJobs.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No active jobs
                </div>
              )}
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow min-h-[600px]">
            <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Map Integration</p>
                <p className="text-sm text-gray-400 mt-1">
                  Google Maps / Mapbox integration would be here
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  GPS tracking from Geotab/Wialon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
