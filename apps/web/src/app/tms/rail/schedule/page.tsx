'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Train,
  Calendar,
  Clock,
  MapPin,
  Container,
  ArrowRight,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Filter
} from 'lucide-react'

interface RailSchedule {
  id: string
  manifestNo: string
  trainNo: string
  origin: string
  destination: string
  departureDate: string
  arrivalDate: string
  status: string
  containers: number
  totalWeight: number
}

export default function RailSchedulePage() {
  const [schedules, setSchedules] = useState<RailSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: '', search: '' })

  useEffect(() => {
    fetchSchedules()
  }, [filter])

  async function fetchSchedules() {
    try {
      const query = new URLSearchParams()
      if (filter.status) query.append('status', filter.status)
      
      const res = await fetch(`/api/rail-operations?${query}`)
      if (res.ok) {
        const data = await res.json()
        setSchedules(data)
      }
    } catch (error) {
      console.error('Error fetching rail schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    LOADING: 'bg-yellow-100 text-yellow-800',
    DEPARTED: 'bg-purple-100 text-purple-800',
    IN_TRANSIT: 'bg-orange-100 text-orange-800',
    ARRIVED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
  }

  return (
    <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/tms/rail" className="text-gray-600 hover:text-gray-900">
              <ArrowRight className="w-6 h-6 rotate-180" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rail Schedule</h1>
              <p className="text-gray-600">KTMB train schedules and manifests</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Upload className="w-4 h-4 mr-2" />
              Upload Manifest
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">
                  {schedules.filter(s => s.status === 'SCHEDULED').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">
                  {schedules.filter(s => s.status === 'IN_TRANSIT').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <Train className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Containers</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">
                  {schedules.reduce((sum, s) => sum + (s.containers || 0), 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Container className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {schedules.filter(s => s.status === 'COMPLETED').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Train No, Manifest..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
          </div>
          <select 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="LOADING">Loading</option>
            <option value="DEPARTED">Departed</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="ARRIVED">Arrived</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Manifest No</th>
                <th className="px-6 py-4">Train No</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Departure</th>
                <th className="px-6 py-4">Arrival</th>
                <th className="px-6 py-4">Containers</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && schedules.length > 0 ? (
                schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium">{schedule.manifestNo}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Train className="w-4 h-4 text-gray-400" />
                        <span>{schedule.trainNo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{schedule.origin}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <span className="text-sm">{schedule.destination}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p>{new Date(schedule.departureDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(schedule.departureDate).toLocaleTimeString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p>{new Date(schedule.arrivalDate).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{new Date(schedule.arrivalDate).toLocaleTimeString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Container className="w-4 h-4 text-gray-400" />
                        <span>{schedule.containers}</span>
                        <span className="text-xs text-gray-500">({(schedule.totalWeight / 1000).toFixed(1)}T)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[schedule.status]}`}>
                        {schedule.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link 
                          href={`/tms/rail/tracking?id=${schedule.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Track
                        </Link>
                        <button className="text-gray-600 hover:text-gray-800">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <Train className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No rail schedules found</p>
                    <p className="text-sm">Add a new schedule to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
