'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { 
  ArrowRightLeft, 
  Plus, 
  Search, 
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  RotateCcw
} from 'lucide-react'

export default function MovementsPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('all')

  if (status === 'loading') {
    return null
  }

  if (!session) {
    redirect('/')
  }

  const movementTypes = [
    { id: 'all', name: 'All Movements' },
    { id: 'RECEIPT', name: 'Receipts', icon: ArrowDownLeft, color: 'text-green-600' },
    { id: 'ISSUE', name: 'Issues', icon: ArrowUpRight, color: 'text-red-600' },
    { id: 'TRANSFER', name: 'Transfers', icon: RotateCcw, color: 'text-blue-600' },
  ]

  // Mock movements data
  const movements = [
    { id: 1, type: 'RECEIPT', sku: 'SKU-001', qty: 100, reference: 'PO-12345', date: '2026-02-01', user: 'John Doe' },
    { id: 2, type: 'ISSUE', sku: 'SKU-002', qty: 50, reference: 'SO-67890', date: '2026-02-01', user: 'Jane Smith' },
    { id: 3, type: 'TRANSFER', sku: 'SKU-003', qty: 25, reference: 'TF-001', date: '2026-01-31', user: 'Bob Johnson' },
    { id: 4, type: 'RECEIPT', sku: 'SKU-004', qty: 200, reference: 'PO-12346', date: '2026-01-31', user: 'John Doe' },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'RECEIPT':
        return <ArrowDownLeft className="w-4 h-4 text-green-600" />
      case 'ISSUE':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />
      case 'TRANSFER':
        return <RotateCcw className="w-4 h-4 text-blue-600" />
      default:
        return <ArrowRightLeft className="w-4 h-4" />
    }
  }

  const filteredMovements = activeTab === 'all' 
    ? movements 
    : movements.filter(m => m.type === activeTab || (activeTab === 'TRANSFER' && (m.type === 'TRANSFER_IN' || m.type === 'TRANSFER_OUT')))

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Movements</h1>
            <p className="text-gray-600">Track goods receipt, issues, and transfers</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Movement
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-green-500">
            <ArrowDownLeft className="w-8 h-8 text-green-600 mr-4" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Goods Receipt</h3>
              <p className="text-sm text-gray-500">Record incoming inventory</p>
            </div>
          </button>
          <button className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-red-500">
            <ArrowUpRight className="w-8 h-8 text-red-600 mr-4" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Goods Issue</h3>
              <p className="text-sm text-gray-500">Record outgoing inventory</p>
            </div>
          </button>
          <button className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-blue-500">
            <RotateCcw className="w-8 h-8 text-blue-600 mr-4" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Transfer</h3>
              <p className="text-sm text-gray-500">Move between locations</p>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {movementTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveTab(type.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === type.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {type.name}
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
                placeholder="Search SKU or reference..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <input
            type="date"
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Movements Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((movement) => (
                <tr key={movement.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(movement.type)}
                      <span className="font-medium">{movement.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">{movement.sku}</td>
                  <td className="px-6 py-4">{movement.qty}</td>
                  <td className="px-6 py-4">{movement.reference}</td>
                  <td className="px-6 py-4">{movement.date}</td>
                  <td className="px-6 py-4">{movement.user}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View
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