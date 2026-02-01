import { prisma } from '@logisticspro/database'
import { formatDistanceToNow } from 'date-fns'
import { Activity, FileText, Truck, CheckCircle } from 'lucide-react'

async function getRecentActivity() {
  const [jobs, audits] = await Promise.all([
    prisma.haulageJob.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { customer: true },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }),
  ])

  const activities = [
    ...jobs.map((job) => ({
      id: job.id,
      type: 'job',
      description: `Job ${job.jobNo} updated to ${job.status}`,
      user: job.customer?.name || 'System',
      timestamp: job.updatedAt,
    })),
    ...audits.map((audit) => ({
      id: audit.id,
      type: 'audit',
      description: `${audit.action} on ${audit.entityType}`,
      user: audit.user ? `${audit.user.firstName} ${audit.user.lastName}` : 'System',
      timestamp: audit.createdAt,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5)

  return activities
}

export async function RecentActivity() {
  const activities = await getRecentActivity()

  const getIcon = (type: string) => {
    switch (type) {
      case 'job':
        return <Truck className="w-5 h-5" />
      case 'audit':
        return <Activity className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      </div>
      <div className="divide-y">
        {activities.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">No recent activity</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-4 flex items-start space-x-3">
              <div className="mt-0.5 text-gray-400">{getIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">
                  by {activity.user} • {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
