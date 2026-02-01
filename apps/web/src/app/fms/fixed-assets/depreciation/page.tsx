'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  Calculator,
  Calendar,
  DollarSign,
  TrendingDown,
  ArrowLeft,
  Download,
  FileText,
  Building2,
  Search,
  Filter,
  Plus
} from 'lucide-react'

interface DepreciationEntry {
  id: string
  period: string
  year: number
  month: number
  amount: number
  accumulatedDepreciation: number
  netBookValue: number
}

interface Asset {
  id: string
  assetNo: string
  name: string
  category: string
  purchaseDate: string
  purchaseCost: number
  salvageValue: number
  usefulLife: number
  depreciationMethod: string
  accumulatedDepreciation: number
  netBookValue: number
  depreciationEntries: DepreciationEntry[]
}

export default function DepreciationPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filter, setFilter] = useState({ category: '', search: '' })

  useEffect(() => {
    fetchAssets()
  }, [filter])

  async function fetchAssets() {
    try {
      const res = await fetch('/api/fixed-assets')
      if (res.ok) {
        const data = await res.json()
        setAssets(data)
        if (data.length > 0 && !selectedAsset) {
          setSelectedAsset(data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount || 0)
  }

  const filteredAssets = assets.filter(asset => {
    if (filter.category && asset.category !== filter.category) return false
    if (filter.search && !asset.name.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })

  const totalCost = assets.reduce((sum, a) => sum + a.purchaseCost, 0)
  const totalAccumulated = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0)
  const totalNetBookValue = assets.reduce((sum, a) => sum + a.netBookValue, 0)
  const totalMonthlyDepreciation = assets.reduce((sum, a) => {
    const monthly = (a.purchaseCost - a.salvageValue) / (a.usefulLife * 12)
    return sum + monthly
  }, 0)

  return (
    <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/fms/fixed-assets" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Depreciation Schedule</h1>
              <p className="text-gray-600">Asset depreciation calculation and schedule</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export Schedule
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Calculator className="w-4 h-4 mr-2" />
              Run Depreciation
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{assets.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(totalCost)}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accumulated Depreciation</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">{formatCurrency(totalAccumulated)}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Depreciation</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{formatCurrency(totalMonthlyDepreciation)}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Assets</h2>
                <span className="text-sm text-gray-500">{filteredAssets.length} items</span>
              </div>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  />
                </div>
                <select 
                  className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  value={filter.category}
                  onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  <option value="BUILDING">Building</option>
                  <option value="MACHINERY">Machinery</option>
                  <option value="VEHICLE">Vehicle</option>
                  <option value="EQUIPMENT">Equipment</option>
                  <option value="FURNITURE">Furniture</option>
                  <option value="COMPUTER">Computer</option>
                </select>
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                    selectedAsset?.id === asset.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{asset.name}</p>
                      <p className="text-xs text-gray-500">{asset.assetNo}</p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{asset.category}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500">NBV: {formatCurrency(asset.netBookValue)}</span>
                    <span className="text-orange-600">{formatCurrency(asset.accumulatedDepreciation)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Depreciation Schedule */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            {selectedAsset ? (
              <>
                <div className="p-6 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedAsset.name}</h2>
                      <p className="text-sm text-gray-500">{selectedAsset.assetNo} • {selectedAsset.category}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {selectedAsset.depreciationMethod}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500">Purchase Cost</p>
                      <p className="font-semibold">{formatCurrency(selectedAsset.purchaseCost)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Salvage Value</p>
                      <p className="font-semibold">{formatCurrency(selectedAsset.salvageValue)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Useful Life</p>
                      <p className="font-semibold">{selectedAsset.usefulLife} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Purchase Date</p>
                      <p className="font-semibold">{new Date(selectedAsset.purchaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Depreciation Schedule ({selectedYear})</h3>
                  
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Period</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Depreciation</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Accumulated</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-700">Net Book Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(() => {
                        // Generate schedule for selected year
                        const schedule = []
                        const startDate = new Date(selectedAsset.purchaseDate)
                        const monthlyDepreciation = (selectedAsset.purchaseCost - selectedAsset.salvageValue) / (selectedAsset.usefulLife * 12)
                        let accumulated = selectedAsset.accumulatedDepreciation
                        let nbv = selectedAsset.netBookValue
                        
                        // Calculate depreciation up to start of selected year
                        const monthsSincePurchase = (selectedYear - startDate.getFullYear()) * 12 + (0 - startDate.getMonth())
                        const yearStartAccumulated = Math.max(0, monthlyDepreciation * Math.max(0, monthsSincePurchase))
                        
                        for (let month = 0; month < 12; month++) {
                          const periodAccumulated = yearStartAccumulated + (monthlyDepreciation * (month + 1))
                          const periodNbv = selectedAsset.purchaseCost - periodAccumulated
                          
                          schedule.push({
                            month,
                            monthName: new Date(selectedYear, month, 1).toLocaleString('default', { month: 'long' }),
                            depreciation: monthlyDepreciation,
                            accumulated: periodAccumulated,
                            netBookValue: Math.max(selectedAsset.salvageValue, periodNbv)
                          })
                        }
                        
                        return schedule.map((row) => (
                          <tr key={row.month} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{row.monthName} {selectedYear}</td>
                            <td className="px-4 py-3 text-right">{formatCurrency(row.depreciation)}</td>
                            <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(row.accumulated)}</td>
                            <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.netBookValue)}</td>
                          </tr>
                        ))
                      })()}
                    </tbody>
                    <tfoot className="bg-gray-50 font-semibold">
                      <tr>
                        <td className="px-4 py-3">Total for {selectedYear}</td>
                        <td className="px-4 py-3 text-right">
                          {formatCurrency((selectedAsset.purchaseCost - selectedAsset.salvageValue) / selectedAsset.usefulLife)}
                        </td>
                        <td className="px-4 py-3 text-right">-</td>
                        <td className="px-4 py-3 text-right">-</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500">
                <div className="text-center">
                  <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p>Select an asset to view depreciation schedule</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Year Selector */}
        <div className="flex justify-center space-x-2">
          {[2024, 2025, 2026, 2027].map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedYear === year 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
