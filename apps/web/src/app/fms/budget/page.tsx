'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Download
} from 'lucide-react'

interface BudgetItem {
  id: string
  accountCode: string
  accountName: string
  accountType: string
  category: string
  budgetAmount: number
  actualAmount: number
  variance: number
  variancePercent: number
}

interface BudgetSummary {
  year: number
  totals: {
    budget: number
    actual: number
    variance: number
    variancePercent: number
  }
  summary: BudgetItem[]
}

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<BudgetSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [filter, setFilter] = useState({ category: '', search: '' })

  useEffect(() => {
    fetchBudgetData()
  }, [selectedYear, filter])

  async function fetchBudgetData() {
    try {
      const query = new URLSearchParams()
      query.append('year', selectedYear.toString())
      
      const res = await fetch(`/api/budget/summary?${query}`)
      if (res.ok) {
        const data = await res.json()
        setBudgetData(data)
      }
    } catch (error) {
      console.error('Error fetching budget data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(amount || 0)
  }

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600'
    if (variance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (variance < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <CheckCircle className="w-4 h-4 text-gray-600" />
  }

  const filteredItems = budgetData?.summary.filter(item => {
    if (filter.category && item.category !== filter.category) return false
    if (filter.search && !item.accountName.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  }) || []

  return (
    <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget vs Actual</h1>
            <p className="text-gray-600">Financial budget tracking and variance analysis</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/reports/financial/budget-vs-actual"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Link>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Set Budget
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget ({selectedYear})</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(budgetData?.totals.budget || 0)}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actual Spend</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{formatCurrency(budgetData?.totals.actual || 0)}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Variance</p>
                <p className={`text-2xl font-bold mt-1 ${getVarianceColor(budgetData?.totals.variance || 0)}`}>
                  {formatCurrency(budgetData?.totals.variance || 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                {getVarianceIcon(budgetData?.totals.variance || 0)}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Variance %</p>
                <p className={`text-2xl font-bold mt-1 ${getVarianceColor(budgetData?.totals.variance || 0)}`}>
                  {budgetData?.totals.variancePercent?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select 
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
              <option value={2024}>2024</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search account..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
          </div>
          <select 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">All Categories</option>
            <option value="REVENUE">Revenue</option>
            <option value="EXPENSE">Expense</option>
            <option value="ASSET">Asset</option>
            <option value="LIABILITY">Liability</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Budget Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Account Code</th>
                <th className="px-6 py-4">Account Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Budget</th>
                <th className="px-6 py-4 text-right">Actual</th>
                <th className="px-6 py-4 text-right">Variance</th>
                <th className="px-6 py-4 text-right">%</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {!loading && filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium">{item.accountCode}</td>
                    <td className="px-6 py-4">{item.accountName}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(item.budgetAmount)}</td>
                    <td className="px-6 py-4 text-right">{formatCurrency(item.actualAmount)}</td>
                    <td className={`px-6 py-4 text-right font-medium ${getVarianceColor(item.variance)}`}>
                      {formatCurrency(item.variance)}
                    </td>
                    <td className={`px-6 py-4 text-right ${getVarianceColor(item.variance)}`}>
                      {item.variancePercent.toFixed(1)}%
                    </td>
                    <td className="px-6 py-4">
                      {item.variancePercent > 10 ? (
                        <span className="flex items-center text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Over Budget
                        </span>
                      ) : item.variancePercent < -10 ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Under Budget
                        </span>
                      ) : (
                        <span className="flex items-center text-blue-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          On Track
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No budget data found</p>
                    <p className="text-sm">Set up your budget to start tracking</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Visual Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization by Category</h3>
            <div className="space-y-4">
              {['Revenue', 'Expense', 'Asset', 'Liability'].map((cat) => {
                const items = budgetData?.summary.filter(i => i.category === cat.toUpperCase()) || []
                const budget = items.reduce((sum, i) => sum + i.budgetAmount, 0)
                const actual = items.reduce((sum, i) => sum + i.actualAmount, 0)
                const percent = budget > 0 ? (actual / budget) * 100 : 0
                
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{cat}</span>
                      <span className="text-sm text-gray-500">{percent.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${percent > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>{formatCurrency(actual)}</span>
                      <span>{formatCurrency(budget)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Variances</h3>
            <div className="space-y-3">
              {budgetData?.summary
                .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
                .slice(0, 5)
                .map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.accountName}</p>
                      <p className="text-xs text-gray-500">{item.accountCode}</p>
                    </div>
                    <div className={`text-right ${getVarianceColor(item.variance)}`}>
                      <p className="font-medium">{formatCurrency(item.variance)}</p>
                      <p className="text-xs">{item.variancePercent.toFixed(1)}%</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
