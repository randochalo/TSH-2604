'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { 
  Search, Filter, RotateCcw, CheckCircle, XCircle, Clock, 
  Package, ArrowRight, Plus, FileText, TrendingDown, 
  AlertTriangle, Calendar, User, Truck
} from 'lucide-react'

interface RMA {
  id: string
  rmaNo: string
  customer: string
  originalOrder: string
  type: 'RETURN' | 'EXCHANGE' | 'REPAIR' | 'CREDIT'
  reason: string
  status: 'PENDING' | 'APPROVED' | 'RECEIVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
  items: number
  value: number
  createdAt: string
  requestedBy: string
}

interface ReturnStats {
  pendingApproval: number
  approvedWaiting: number
  itemsReceived: number
  processing: number
  completedToday: number
  totalValue: number
  returnRate: string
  averageProcessTime: string
}

export default function ReturnsPage() {
  const [rmas, setRmas] = useState<RMA[]>([])
  const [stats, setStats] = useState<ReturnStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: 'ALL', type: 'ALL', search: '' })
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchRMAs()
    fetchStats()
  }, [filter])

  const fetchRMAs = async () => {
    try {
      const params = new URLSearchParams()
      if (filter.status !== 'ALL') params.append('status', filter.status)
      if (filter.type !== 'ALL') params.append('type', filter.type)
      if (filter.search) params.append('search', filter.search)
      
      const res = await fetch(`/api/returns/rmas?${params}`)
      const data = await res.json()
      setRmas(data)
    } catch (error) {
      console.error('Error fetching RMAs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/returns/stats')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleApprove = async (rmaId: string) => {
    try {
      const res = await fetch(`/api/returns/rmas/${rmaId}/approve`, { method: 'POST' })
      if (res.ok) {
        fetchRMAs()
        fetchStats()
      }
    } catch (error) {
      console.error('Error approving RMA:', error)
    }
  }

  const handleReject = async (rmaId: string) => {
    try {
      const res = await fetch(`/api/returns/rmas/${rmaId}/reject`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Not eligible for return' })
      })
      if (res.ok) {
        fetchRMAs()
        fetchStats()
      }
    } catch (error) {
      console.error('Error rejecting RMA:', error)
    }
  }

  const handleComplete = async (rmaId: string) => {
    try {
      const res = await fetch(`/api/returns/rmas/${rmaId}/complete`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution: 'Refund processed' })
      })
      if (res.ok) {
        fetchRMAs()
        fetchStats()
      }
    } catch (error) {
      console.error('Error completing RMA:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-blue-100 text-blue-800'
      case 'RECEIVED': return 'bg-purple-100 text-purple-800'
      case 'PROCESSING': return 'bg-orange-100 text-orange-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'RETURN': return 'bg-gray-100 text-gray-800'
      case 'EXCHANGE': return 'bg-blue-50 text-blue-700'
      case 'REPAIR': return 'bg-orange-50 text-orange-700'
      case 'CREDIT': return 'bg-green-50 text-green-700'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount)
  }

  return (
    <DashboardLayout user={{ name: 'User', role: 'OPERATOR' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Returns Management</h1>
            <p className="text-gray-600">Process RMAs and handle product returns</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create RMA
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Awaiting Receipt</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.approvedWaiting}</p>
                </div>
                <Truck className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Processing</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.processing}</p>
                </div>
                <RotateCcw className="w-8 h-8 text-orange-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Return Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.returnRate}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-purple-500 opacity-50" />
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
                placeholder="Search RMA, customer, or order..."
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
            <option value="APPROVED">Approved</option>
            <option value="RECEIVED">Received</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <select 
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value="RETURN">Return</option>
            <option value="EXCHANGE">Exchange</option>
            <option value="REPAIR">Repair</option>
            <option value="CREDIT">Credit</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </button>
        </div>

        {/* RMAs Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">RMA No</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rmas.length > 0 ? (
                rmas.map((rma) => (
                  <tr key={rma.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{rma.rmaNo}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{rma.customer}</p>
                        <p className="text-xs text-gray-500">Order: {rma.originalOrder}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getTypeColor(rma.type)}`}>
                        {rma.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{rma.items} items</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(rma.value)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rma.status)}`}>
                        {rma.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(rma.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {rma.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(rma.id)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              <CheckCircle className="w-4 h-4 inline mr-1" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(rma.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              <XCircle className="w-4 h-4 inline mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        {rma.status === 'RECEIVED' && (
                          <button
                            onClick={() => handleComplete(rma.id)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Process
                          </button>
                        )}
                        {rma.status === 'PROCESSING' && (
                          <button
                            onClick={() => handleComplete(rma.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Complete
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-800">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <RotateCcw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No RMAs found</p>
                    <p className="text-sm">Create an RMA to get started</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Return Reasons Legend */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-semibold mb-3">Return Reasons</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Defective Product</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
              <span>Damaged in Transit</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Wrong Item Shipped</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              <span>Customer Changed Mind</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Quality Issues</h3>
            </div>
            <p className="text-red-100 mb-4">View and manage quality-related returns</p>
            <button className="w-full py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50">
              View Issues
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4">
              <FileText className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">RMA Reports</h3>
            </div>
            <p className="text-blue-100 mb-4">Generate returns analysis reports</p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50">
              Generate Report
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4">
              <Package className="w-8 h-8 mr-3" />
              <h3 className="text-lg font-semibold">Restock Items</h3>
            </div>
            <p className="text-green-100 mb-4">Process items back to inventory</p>
            <button className="w-full py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50">
              Start Restocking
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
