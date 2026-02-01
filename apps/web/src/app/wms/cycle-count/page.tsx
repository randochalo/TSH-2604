'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { 
  ClipboardList, 
  Play, 
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Barcode
} from 'lucide-react'

export default function CycleCountPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('pending')

  if (status === 'loading') {
    return null
  }

  if (!session) {
    redirect('/')
  }

  // Mock cycle count data
  const cycleCounts = [
    { 
      id: 1, 
      countNo: 'CC-2026-001', 
      type: 'ABC',
      items: 50,
      completed: 35,
      status: 'IN_PROGRESS',
      scheduledDate: '2026-02-01',
      assignedTo: 'John Doe'
    },
    { 
      id: 2, 
      countNo: 'CC-2026-002', 
      type: 'RANDOM',
      items: 25,
      completed: 0,
      status: 'PENDING',
      scheduledDate: '2026-02-02',
      assignedTo: 'Jane Smith'
    },
    { 
      id: 3, 
      countNo: 'CC-2026-003', 
      type: 'ABC',
      items: 100,
      completed: 100,
      status: 'COMPLETED',
      scheduledDate: '2026-01-28',
      assignedTo: 'Bob Johnson'
    },
  ]

  const statusColors: Record<string, string> = {
    PENDING: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-green-100 text-green-800',
    RECOUNT: 'bg-red-100 text-red-800',
  }

  const filteredCounts = activeTab === 'all' 
    ? cycleCounts 
    : cycleCounts.filter(c => c.status.toLowerCase() === activeTab)

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cycle Count</h1>
            <p className="text-gray-600">Stock verification and reconciliation</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ClipboardList className="w-4 h-4 mr-2" />
            New Count
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <ClipboardList className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">1</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Play className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">8</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">99.2%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', name: 'All' },
              { id: 'pending', name: 'Pending' },
              { id: 'in_progress', name: 'In Progress' },
              { id: 'completed', name: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search count number..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value="ABC">ABC Analysis</option>
            <option value="RANDOM">Random</option>
            <option value="TRIGGERED">Triggered</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Barcode className="w-4 h-4 mr-2" />
            Scan
          </button>
        </div>

        {/* Cycle Counts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Count No</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Progress</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Scheduled</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCounts.map((count) => (
                <tr key={count.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{count.countNo}</td>
                  <td className="px-6 py-4">{count.type}</td>
                  <td className="px-6 py-4">{count.items}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count.completed / count.items) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600">
                        {count.completed}/{count.items}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[count.status]}`}>
                      {count.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{count.scheduledDate}</td>
                  <td className="px-6 py-4">{count.assignedTo}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      {count.status === 'PENDING' ? 'Start' : 'View'}
                    </button>
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