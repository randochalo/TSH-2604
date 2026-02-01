import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Download, History, User, Activity, Filter } from 'lucide-react'
import Link from 'next/link'

async function getAuditLog(limit?: number) {
  try {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/audit/log?${params}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

const actionColors: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  POST: 'bg-purple-100 text-purple-800',
  LOGIN: 'bg-gray-100 text-gray-800',
  APPROVE: 'bg-green-100 text-green-800',
  ASSIGN: 'bg-orange-100 text-orange-800',
}

export default async function AuditLogPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getAuditLog(100)

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/reports" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
              <p className="text-gray-600">System activity log and change history</p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              <select className="px-3 py-1.5 border rounded-lg text-sm">
                <option value="">All Actions</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
                <option value="POST">Post</option>
                <option value="LOGIN">Login</option>
              </select>
              <select className="px-3 py-1.5 border rounded-lg text-sm">
                <option value="">All Entities</option>
                <option value="Invoice">Invoice</option>
                <option value="Shipment">Shipment</option>
                <option value="Job">Job</option>
                <option value="Payment">Payment</option>
                <option value="JournalEntry">Journal Entry</option>
              </select>
              <input
                type="date"
                className="px-3 py-1.5 border rounded-lg text-sm"
                placeholder="From Date"
              />
              <input
                type="date"
                className="px-3 py-1.5 border rounded-lg text-sm"
                placeholder="To Date"
              />
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Activity Log ({report?.total || 0} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Entity</th>
                    <th className="px-4 py-3 font-medium">Details</th>
                    <th className="px-4 py-3 font-medium">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.entries?.map((entry: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{entry.user}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[entry.action] || 'bg-gray-100 text-gray-800'}`}>
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{entry.entity}</span>
                          <span className="text-xs text-gray-500">({entry.entityId})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-md truncate">
                        {entry.details}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {entry.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Action Types Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {Object.entries(actionColors).map(([action, colorClass]) => (
                <div key={action} className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                    {action}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
