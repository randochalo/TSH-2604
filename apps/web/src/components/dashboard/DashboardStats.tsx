import { prisma } from '@logisticspro/database'
import { 
  Truck, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react'

async function getDashboardStats() {
  const [
    totalJobs,
    activeJobs,
    completedJobsToday,
    pendingJobs,
    totalVehicles,
    activeVehicles,
    totalDrivers,
  ] = await Promise.all([
    prisma.haulageJob.count(),
    prisma.haulageJob.count({
      where: {
        status: {
          in: ['ASSIGNED', 'DISPATCHED', 'AT_PICKUP', 'LOADED', 'IN_TRANSIT', 'AT_DELIVERY'],
        },
      },
    }),
    prisma.haulageJob.count({
      where: {
        status: 'COMPLETED',
        updatedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.haulageJob.count({ where: { status: 'PENDING' } }),
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: 'ACTIVE' } }),
    prisma.driver.count(),
  ])

  return {
    totalJobs,
    activeJobs,
    completedJobsToday,
    pendingJobs,
    totalVehicles,
    activeVehicles,
    totalDrivers,
  }
}

export async function DashboardStats() {
  const stats = await getDashboardStats()

  const cards = [
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: Truck,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Completed Today',
      value: stats.completedJobsToday,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Jobs',
      value: stats.pendingJobs,
      icon: AlertCircle,
      color: 'bg-red-500',
    },
    {
      title: 'Active Vehicles',
      value: `${stats.activeVehicles}/${stats.totalVehicles}`,
      icon: Truck,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Drivers',
      value: stats.totalDrivers,
      icon: Users,
      color: 'bg-indigo-500',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className="bg-white rounded-lg shadow p-4 flex items-center space-x-4"
          >
            <div className={`${card.color} p-3 rounded-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
