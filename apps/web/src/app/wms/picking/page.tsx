'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Search, Filter, Package, Play, CheckCircle, Clock, 
  AlertCircle, ArrowRight, ClipboardList, Barcode, User,
  TrendingUp, Calendar, MapPin
} from 'lucide-react'

interface PickOrder {
  id: string
  orderNo: string
  customer: string
  priority: 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  items: number
  createdAt: string
}

interface PickStats {
  pendingOrders: number
  inProgress: number
  completedToday: number
  itemsPickedToday: number
  averagePickTime: string
  accuracy: string
}

export default function PickingPage() {
  const [orders, setOrders] = useState<PickOrder[]>([])
  const [stats, setStats] = useState<PickStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: 'ALL', priority: 'ALL', search: '' })
  const [selectedOrder, setSelectedOrder] = useState<PickOrder | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [filter])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.status !== 'ALL') params.append('status', filter.status)
      if (filter.priority !== 'ALL') params.append('priority', filter.priority)
      if (filter.search) params.append('search', filter.search)
      
      const res = await fetch(`/api/picking/orders?${params}`)
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/picking/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleGeneratePickList = async (orderId: string) => {
    try {
      const res = await fetch(`/api/picking/orders/${orderId}/generate`, { method: 'POST' })
      if (res.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error generating pick list:', error)
    }
  }

  const handleCompletePicking = async (orderId: string) => {
    try {
      const res = await fetch(`/api/picking/orders/${orderId}/complete`, { method: 'POST' })
      if (res.ok) {
        fetchOrders()
        fetchStats()
      }
    } catch (error) {
      console.error('Error completing picking:', error)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'NORMAL': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'LOW': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <DashboardLayout user={{ name: 'User', role: 'OPERATOR' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Picking</h1>
            <p className="text-gray-600">Manage pick lists and warehouse picking operations</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <ClipboardList className="w-4 h-4 mr-2" />
            Create Pick Wave
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Play className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Items Picked</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.itemsPickedToday}</p>
                </div>
                <Package className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Pick Time</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.averagePickTime}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="text-2xl font-bold text-teal-600">{stats.accuracy}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-teal-500 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search order or customer..."
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select 
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select 
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Order No</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{order.orderNo}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.items} items</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleGeneratePickList(order.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Generate Pick List
                          </button>
                        )}
                        {order.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleCompletePicking(order.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => { setSelectedOrder(order); setShowDetailModal(true) }}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No pick orders found</p>
                    <p className="text-sm">Create a pick wave to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4">
              <Barcode className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Scan Pick</h3>
            </div>
            <p className="text-blue-100 mb-4">Scan items directly to pick</p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50">
              Start Scan Picking
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4">
              <User className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Picker Performance</h3>
            </div>
            <p className="text-green-100 mb-4">View picker productivity metrics</p>
            <button className="w-full py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50">
              View Reports
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4">
              <MapPin className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Zone Picking</h3>
            </div>
            <p className="text-purple-100 mb-4">Optimize routes by warehouse zone</p>
            <button className="w-full py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50">
              Configure Zones
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
