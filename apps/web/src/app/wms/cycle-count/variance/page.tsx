'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { 
  AlertTriangle, CheckCircle, FileText, TrendingUp,
  ArrowRight, Filter, Download, ThumbsUp, ThumbsDown
} from 'lucide-react'

interface VarianceItem {
  id: string
  sku: string
  description: string
  location: string
  expectedQty: number
  countedQty: number
  variance: number
  varianceValue: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
}

const mockVariances: VarianceItem[] = [
  {
    id: '1',
    sku: 'SKU-AUT-00123',
    description: 'Automotive Part X',
    location: 'B-03-01-02',
    expectedQty: 75,
    countedQty: 70,
    variance: -5,
    varianceValue: -1250,
    reason: 'Damage during handling',
    status: 'pending',
  },
  {
    id: '2',
    sku: 'SKU-AUT-00124',
    description: 'Automotive Part Y',
    location: 'B-03-01-03',
    expectedQty: 50,
    countedQty: 55,
    variance: 5,
    varianceValue: 875,
    reason: 'Previous count error',
    status: 'pending',
  },
  {
    id: '3',
    sku: 'SKU-ELE-00567',
    description: 'Electronic Component D',
    location: 'A-02-01-04',
    expectedQty: 300,
    countedQty: 295,
    variance: -5,
    varianceValue: -450,
    reason: 'System error - double entry',
    status: 'approved',
  },
]

export default function CycleCountVariancePage() {
  const [variances, setVariances] = useState<VarianceItem[]>(mockVariances)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filteredVariances = variances.filter(v => filter === 'all' || v.status === filter)

  const totalVarianceValue = variances.reduce((sum, v) => sum + v.varianceValue, 0)
  const pendingCount = variances.filter(v => v.status === 'pending').length
  const approvedCount = variances.filter(v => v.status === 'approved').length

  const updateStatus = (id: string, status: 'approved' | 'rejected') => {
    setVariances(prev => prev.map(v => v.id === id ? { ...v, status } : v))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Variance Report</h1>
          <p className="text-gray-500">Review and approve inventory adjustments</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-red-500">
          <div className="text-sm text-gray-500">Total Variance Value</div>
          <div className={`text-2xl font-bold ${totalVarianceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            RM {Math.abs(totalVarianceValue).toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">
            {totalVarianceValue >= 0 ? 'Net gain' : 'Net loss'}
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500">Pending Approval</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-xs text-gray-400">Require review</div>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Approved</div>
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          <div className="text-xs text-gray-400">Adjustments processed</div>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Accuracy Rate</div>
          <div className="text-2xl font-bold text-blue-600">94.2%</div>
          <div className="text-xs text-gray-400">Cycle count accuracy</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === f.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Variance List */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Variance Items ({filteredVariances.length})</h3>
        <div className="space-y-4">
          {filteredVariances.map((item) => (
            <div 
              key={item.id} 
              className={`border rounded-lg p-4 ${
                item.variance < 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{item.sku}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'approved' ? 'bg-green-100 text-green-700' :
                      item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                  <p className="text-gray-500 text-sm">Location: {item.location}</p>
                  
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Expected:</span>
                      <span className="ml-2 font-medium">{item.expectedQty}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Counted:</span>
                      <span className="ml-2 font-medium">{item.countedQty}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Variance:</span>
                      <span className={`ml-2 font-bold ${item.variance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.variance > 0 ? '+' : ''}{item.variance}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-white rounded border">
                    <div className="text-sm">
                      <span className="text-gray-500">Reason:</span>
                      <span className="ml-2">{item.reason}</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="text-gray-500">Financial Impact:</span>
                      <span className={`ml-2 font-medium ${item.varianceValue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        RM {item.varianceValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {item.status === 'pending' && (
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => updateStatus(item.id, 'approved')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(item.id, 'rejected')}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Adjustment Summary */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Adjustment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">By Reason</h4>
            <div className="space-y-2">
              {[
                { reason: 'Damage/Loss', count: 8, value: -5200 },
                { reason: 'System Error', count: 5, value: 3200 },
                { reason: 'Count Error', count: 3, value: 1500 },
                { reason: 'Theft', count: 1, value: -800 },
              ].map((item) => (
                <div key={item.reason} className="flex justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">{item.reason}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{item.count} items</span>
                    <span className={`text-sm ml-3 ${item.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      RM {Math.abs(item.value).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">By Zone</h4>
            <div className="space-y-2">
              {[
                { zone: 'Zone A - Electronics', count: 5, value: -1200 },
                { zone: 'Zone B - Automotive', count: 8, value: -2800 },
                { zone: 'Zone C - Textiles', count: 3, value: 800 },
                { zone: 'Zone D - General', count: 2, value: 300 },
              ].map((item) => (
                <div key={item.zone} className="flex justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">{item.zone}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{item.count} items</span>
                    <span className={`text-sm ml-3 ${item.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      RM {Math.abs(item.value).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
