import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { prisma } from '@logisticspro/database'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'

export default async function JobsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const jobs = await prisma.haulageJob.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      customer: true,
      vehicle: true,
      driver: {
        include: { user: true },
      },
    },
  })

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

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Haulage Jobs</h1>
            <p className="text-gray-600">Manage container haulage operations</p>
          </div>
          <Link
            href="/hms/jobs/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Job
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Customers</option>
          </select>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Job No</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Container</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{job.jobNo}</td>
                  <td className="px-6 py-4">{job.customer?.name}</td>
                  <td className="px-6 py-4">
                    {job.containerNo ? (
                      <div>
                        <div className="font-medium">{job.containerNo}</div>
                        <div className="text-xs text-gray-500">{job.containerSize}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <div>{job.pickupLocation}</div>
                      <div className="text-gray-400">↓</div>
                      <div>{job.deliveryLocation}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {job.driver ? (
                      `${job.driver.user.firstName} ${job.driver.user.lastName}`
                    ) : (
                      <span className="text-gray-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[job.status]
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/hms/jobs/${job.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </Link>
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
