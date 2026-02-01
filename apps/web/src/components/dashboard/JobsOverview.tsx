import { prisma } from '@logisticspro/database'
import { format } from 'date-fns'

async function getJobsOverview() {
  const jobs = await prisma.haulageJob.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      vehicle: true,
      driver: {
        include: {
          user: true,
        },
      },
    },
  })

  return jobs
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  DISPATCHED: 'bg-yellow-100 text-yellow-800',
  AT_PICKUP: 'bg-purple-100 text-purple-800',
  LOADED: 'bg-indigo-100 text-indigo-800',
  IN_TRANSIT: 'bg-cyan-100 text-cyan-800',
  AT_DELIVERY: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export async function JobsOverview() {
  const jobs = await getJobsOverview()

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
        <a
          href="/hms/jobs"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View All
        </a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Job No</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Pickup → Delivery</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No jobs found
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{job.jobNo}</td>
                  <td className="px-4 py-3">{job.customer?.name}</td>
                  <td className="px-4 py-3 text-xs">
                    {job.pickupLocation} → {job.deliveryLocation}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[job.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
