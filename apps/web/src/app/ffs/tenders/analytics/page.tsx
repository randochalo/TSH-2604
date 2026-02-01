'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { 
  Trophy, TrendingUp, TrendingDown, FileText, Target,
  PieChart, BarChart3, Calendar, Filter, Download
} from 'lucide-react'

interface TenderAnalytics {
  totalSubmitted: number
  totalWon: number
  totalLost: number
  winRate: number
  totalValueSubmitted: number
  totalValueWon: number
  totalValueLost: number
  averageDealSize: number
  byMonth: { month: string; submitted: number; won: number; lost: number }[]
  byCustomer: { customer: string; submitted: number; won: number; winRate: number }[]
  lossReasons: { reason: string; count: number; percentage: number }[]
}

const mockAnalytics: TenderAnalytics = {
  totalSubmitted: 45,
  totalWon: 18,
  totalLost: 27,
  winRate: 40,
  totalValueSubmitted: 8500000,
  totalValueWon: 3200000,
  totalValueLost: 5300000,
  averageDealSize: 188889,
  byMonth: [
    { month: 'Oct 2023', submitted: 8, won: 3, lost: 5 },
    { month: 'Nov 2023', submitted: 10, won: 4, lost: 6 },
    { month: 'Dec 2023', submitted: 12, won: 5, lost: 7 },
    { month: 'Jan 2024', submitted: 15, won: 6, lost: 9 },
  ],
  byCustomer: [
    { customer: 'ABC Logistics', submitted: 8, won: 4, winRate: 50 },
    { customer: 'Global Freight', submitted: 6, won: 3, winRate: 50 },
    { customer: 'Tech Solutions', submitted: 5, won: 1, winRate: 20 },
    { customer: 'Marina Bay', submitted: 4, won: 2, winRate: 50 },
    { customer: 'Sunrise Trading', submitted: 3, won: 0, winRate: 0 },
  ],
  lossReasons: [
    { reason: 'Price too high', count: 12, percentage: 44 },
    { reason: 'Competitor advantage', count: 8, percentage: 30 },
    { reason: 'Technical requirements', count: 4, percentage: 15 },
    { reason: 'Delivery timeline', count: 3, percentage: 11 },
  ],
}

export default function TenderAnalyticsPage() {
  const [period, setPeriod] = useState('last3months')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tender Analytics</h1>
          <p className="text-gray-500">Win/loss analysis and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="last3months">Last 3 Months</option>
            <option value="last6months">Last 6 Months</option>
            <option value="lastyear">Last Year</option>
            <option value="ytd">Year to Date</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Win Rate</div>
              <div className="text-2xl font-bold">{mockAnalytics.winRate}%</div>
            </div>
            <Trophy className="w-8 h-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +5% vs last period
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Won</div>
              <div className="text-2xl font-bold">{mockAnalytics.totalWon}</div>
            </div>
            <FileText className="w-8 h-8 text-green-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            RM {(mockAnalytics.totalValueWon / 1000000).toFixed(1)}M value
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Total Lost</div>
              <div className="text-2xl font-bold">{mockAnalytics.totalLost}</div>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            RM {(mockAnalytics.totalValueLost / 1000000).toFixed(1)}M value
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Avg Deal Size</div>
              <div className="text-2xl font-bold">RM {(mockAnalytics.averageDealSize / 1000).toFixed(0)}k</div>
            </div>
            <Target className="w-8 h-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Per tender
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Monthly Trends
            </h3>
          </div>
          <div className="h-64 flex items-end justify-around gap-4">
            {mockAnalytics.byMonth.map((month) => (
              <div key={month.month} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex gap-1 h-48">
                  <div 
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ height: `${(month.submitted / 15) * 100}%` }}
                    title={`Submitted: ${month.submitted}`}
                  />
                  <div 
                    className="flex-1 bg-green-500 rounded-t"
                    style={{ height: `${(month.won / 15) * 100}%` }}
                    title={`Won: ${month.won}`}
                  />
                  <div 
                    className="flex-1 bg-red-400 rounded-t"
                    style={{ height: `${(month.lost / 15) * 100}%` }}
                    title={`Lost: ${month.lost}`}
                  />
                </div>
                <span className="text-xs text-gray-600">{month.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">Submitted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">Won</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded" />
              <span className="text-sm text-gray-600">Lost</span>
            </div>
          </div>
        </Card>

        {/* Loss Reasons */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-red-600" />
              Loss Reasons
            </h3>
          </div>
          <div className="space-y-4">
            {mockAnalytics.lossReasons.map((reason) => (
              <div key={reason.reason}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{reason.reason}</span>
                  <span className="font-medium">{reason.count} ({reason.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${reason.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Customer Performance Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Performance by Customer</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Submitted</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Won</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Lost</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Win Rate</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Trend</th>
              </tr>
            </thead>
            <tbody>
              {mockAnalytics.byCustomer.map((customer) => (
                <tr key={customer.customer} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{customer.customer}</td>
                  <td className="text-center py-3 px-4">{customer.submitted}</td>
                  <td className="text-center py-3 px-4 text-green-600 font-medium">{customer.won}</td>
                  <td className="text-center py-3 px-4 text-red-600">{customer.submitted - customer.won}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.winRate >= 50 ? 'bg-green-100 text-green-700' :
                      customer.winRate >= 30 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {customer.winRate}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    {customer.winRate >= 50 ? (
                      <TrendingUp className="w-5 h-5 text-green-600 inline" />
                    ) : customer.winRate >= 30 ? (
                      <TrendingUp className="w-5 h-5 text-yellow-600 inline" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action Items */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="font-medium text-blue-900 mb-2">Price Review</div>
            <p className="text-sm text-blue-700">
              44% of losses are due to high pricing. Review pricing strategy for competitive segments.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="font-medium text-green-900 mb-2">Focus on ABC Logistics</div>
            <p className="text-sm text-green-700">
              50% win rate with this customer. Increase engagement to secure more contracts.
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="font-medium text-yellow-900 mb-2">Tech Solutions</div>
            <p className="text-sm text-yellow-700">
              Only 20% win rate. Schedule meeting to understand requirements better.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
