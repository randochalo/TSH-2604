'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Search, Filter, Package, Play, CheckCircle, Box, 
  Calculator, ArrowRight, ClipboardList, Printer, Weight,
  TrendingUp, Layers, Truck
} from 'lucide-react'

interface PackOrder {
  id: string
  orderNo: string
  customer: string
  status: 'READY' | 'PACKING' | 'COMPLETED'
  items: number
  pickedBy: string
  pickedAt: string
}

interface PackStats {
  readyToPack: number
  currentlyPacking: number
  packedToday: number
  averagePackTime: string
  cartonUtilization: string
  packingAccuracy: string
}

interface CartonType {
  code: string
  name: string
  dimensions: string
  maxWeight: number
  capacity: string
}

export default function PackingPage() {
  const [orders, setOrders] = useState<PackOrder[]>([])
  const [stats, setStats] = useState<PackStats | null>(null)
  const [cartonTypes, setCartonTypes] = useState<CartonType[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: 'ALL', search: '' })
  const [selectedOrder, setSelectedOrder] = useState<PackOrder | null>(null)
  const [showCartonizeModal, setShowCartonizeModal] = useState(false)

  useEffect(() => {
    fetchOrders()
    fetchStats()
    fetchCartonTypes()
  }, [filter])

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.status !== 'ALL') params.append('status', filter.status)
      if (filter.search) params.append('search', filter.search)
      
      const res = await fetch(`/api/packing/orders?${params}`)
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
      const res = await fetch('/api/packing/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchCartonTypes = async () => {
    try {
      const res = await fetch('/api/packing/carton-types')
      const data = await res.json()
      setCartonTypes(data)
    } catch (error) {
      console.error('Error fetching carton types:', error)
    }
  }

  const handleStartPacking = async (orderId: string) => {
    try {
      const res = await fetch(`/api/packing/orders/${orderId}/start`, { method: 'POST' })
      if (res.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error starting packing:', error)
    }
  }

  const handleCartonize = async (orderId: string) => {
    try {
      const res = await fetch(`/api/packing/orders/${orderId}/cartonize`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithm: 'volume' })
      })
      if (res.ok) {
        const data = await res.json()
        setShowCartonizeModal(true)
      }
    } catch (error) {
      console.error('Error cartonizing:', error)
    }
  }

  const handleCompletePacking = async (orderId: string) => {
    try {
      const res = await fetch(`/api/packing/orders/${orderId}/complete`, { method: 'POST' })
      if (res.ok) {
        fetchOrders()
        fetchStats()
      }
    } catch (error) {
      console.error('Error completing packing:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'READY': return 'bg-yellow-100 text-yellow-800'
      case 'PACKING': return 'bg-blue-100 text-blue-800'
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
            <h1 className="text-3xl font-bold text-gray-900">Packing Station</h1>
            <p className="text-gray-600">Cartonization and packing operations</p>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-2" />
              Print Packing Lists
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Box className="w-4 h-4 mr-2" />
              Configure Cartons
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ready to Pack</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.readyToPack}</p>
                </div>
                <Package className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Currently Packing</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.currentlyPacking}</p>
                </div>
                <Play className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Packed Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.packedToday}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Pack Time</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.averagePackTime}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Carton Utilization</p>
                  <p className="text-2xl font-bold text-indigo-600">{stats.cartonUtilization}</p>
                </div>
                <Layers className="w-8 h-8 text-indigo-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="text-2xl font-bold text-teal-600">{stats.packingAccuracy}</p>
                </div>
                <Weight className="w-8 h-8 text-teal-500 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Carton Types */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4">Available Carton Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cartonTypes.map((carton) => (
              <div key={carton.code} className="border rounded-lg p-4 hover:border-blue-500 transition-colors">
                <div className="flex items-center mb-2">
                  <Box className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium">{carton.name}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{carton.dimensions}</p>
                <p className="text-xs text-gray-500">Max: {carton.maxWeight}kg</p>
              </div>
            ))}
          </div>
        </div>

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
            <option value="READY">Ready</option>
            <option value="PACKING">Packing</option>
            <option value="COMPLETED">Completed</option>
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
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Picked By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{order.orderNo}</td>
                    <td className="px-6 py-4">{order.customer}</td>
                    <td className="px-6 py-4">{order.items} items</td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{order.pickedBy}</span>
                      <p className="text-xs text-gray-500">
                        {new Date(order.pickedAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {order.status === 'READY' && (
                          <>
                            <button
                              onClick={() => handleStartPacking(order.id)}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Start Packing
                            </button>
                            <button
                              onClick={() => handleCartonize(order.id)}
                              className="text-purple-600 hover:text-purple-800 font-medium"
                            >
                              <Calculator className="w-4 h-4 inline mr-1" />
                              Auto-Cartonize
                            </button>
                          </>
                        )}
                        {order.status === 'PACKING' && (
                          <button
                            onClick={() => handleCompletePacking(order.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <Box className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No orders ready for packing</p>
                    <p className="text-sm">Orders will appear here after picking is complete</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4">
              <Calculator className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Carton Calculator</h3>
            </div>
            <p className="text-purple-100 mb-4">Calculate optimal carton sizes</p>
            <button className="w-full py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50">
              Open Calculator
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4">
              <Weight className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Weight Check</h3>
            </div>
            <p className="text-orange-100 mb-4">Verify carton weights</p>
            <button className="w-full py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50">
              Start Weight Check
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4">
              <Truck className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Shipping Labels</h3>
            </div>
            <p className="text-teal-100 mb-4">Generate and print shipping labels</p>
            <button className="w-full py-2 bg-white text-teal-600 rounded-lg font-medium hover:bg-teal-50">
              Print Labels
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
