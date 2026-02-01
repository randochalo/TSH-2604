'use client'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Ship,
  Plane,
  Truck,
  Search,
  Filter,
  Download
} from 'lucide-react'

export default function RatesPage() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('ocean')

  if (status === 'loading') {
    return null
  }

  if (!session) {
    redirect('/')
  }

  const rateCategories = [
    { id: 'ocean', name: 'Ocean Freight', icon: Ship },
    { id: 'air', name: 'Air Freight', icon: Plane },
    { id: 'land', name: 'Land Freight', icon: Truck },
  ]

  // Mock rates data
  const rates = {
    ocean: [
      { id: 1, route: 'Port Klang → Singapore', carrier: 'Maersk', rate: 150, validFrom: '2026-02-01', validTo: '2026-03-31' },
      { id: 2, route: 'Port Klang → Hong Kong', carrier: 'MSC', rate: 280, validFrom: '2026-02-01', validTo: '2026-03-31' },
      { id: 3, route: 'Port Klang → Shanghai', carrier: 'CMA CGM', rate: 320, validFrom: '2026-02-01', validTo: '2026-03-31' },
    ],
    air: [
      { id: 4, route: 'KLIA → Singapore', carrier: 'MAS Kargo', rate: 2.50, validFrom: '2026-02-01', validTo: '2026-03-31' },
      { id: 5, route: 'KLIA → Hong Kong', carrier: 'Cathay Cargo', rate: 4.20, validFrom: '2026-02-01', validTo: '2026-03-31' },
      { id: 6, route: 'KLIA → Tokyo', carrier: 'JAL Cargo', rate: 5.80, validFrom: '2026-02-01', validTo: '2026-03-31' },
    ],
    land: [
      { id: 7, route: 'Port Klang → Bangkok', carrier: 'MMF Transport', rate: 850, validFrom: '2026-02-01', validTo: '2026-03-31' },
      { id: 8, route: 'Butterworth → Singapore', carrier: 'MMF Transport', rate: 650, validFrom: '2026-02-01', validTo: '2026-03-31' },
    ],
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Freight Rates</h1>
            <p className="text-gray-600">Manage freight rates and tariffs</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <DollarSign className="w-4 h-4 mr-2" />
              Add Rate
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {rateCategories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === category.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search routes..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Carriers</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Rates Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Carrier</th>
                <th className="px-6 py-4">Rate</th>
                <th className="px-6 py-4">Valid From</th>
                <th className="px-6 py-4">Valid To</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rates[activeTab as keyof typeof rates].map((rate) => (
                <tr key={rate.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{rate.route}</td>
                  <td className="px-6 py-4">{rate.carrier}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold">
                      {activeTab === 'air' ? `$${rate.rate.toFixed(2)}/kg` : `$${rate.rate}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">{rate.validFrom}</td>
                  <td className="px-6 py-4">{rate.validTo}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rate Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rates</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <TrendingDown className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">8</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}