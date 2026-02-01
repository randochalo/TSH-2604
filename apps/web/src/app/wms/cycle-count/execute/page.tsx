'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { 
  ClipboardCheck, Search, Save, AlertTriangle, 
  CheckCircle, FileText, Barcode, ArrowRight
} from 'lucide-react'

interface CountItem {
  id: string
  sku: string
  description: string
  location: string
  expectedQty: number
  countedQty: number | null
  variance: number
  status: 'pending' | 'counted' | 'variance'
}

const mockCountItems: CountItem[] = [
  { id: '1', sku: 'SKU-ELE-00042', description: 'Electronic Component A', location: 'A-01-02-03', expectedQty: 150, countedQty: null, variance: 0, status: 'pending' },
  { id: '2', sku: 'SKU-ELE-00043', description: 'Electronic Component B', location: 'A-01-02-04', expectedQty: 200, countedQty: 200, variance: 0, status: 'counted' },
  { id: '3', sku: 'SKU-AUT-00123', description: 'Automotive Part X', location: 'B-03-01-02', expectedQty: 75, countedQty: 70, variance: -5, status: 'variance' },
  { id: '4', sku: 'SKU-TEX-00891', description: 'Textile Product Y', location: 'C-02-03-01', expectedQty: 500, countedQty: null, variance: 0, status: 'pending' },
  { id: '5', sku: 'SKU-ELE-00044', description: 'Electronic Component C', location: 'A-01-02-05', expectedQty: 100, countedQty: 100, variance: 0, status: 'counted' },
  { id: '6', sku: 'SKU-AUT-00124', description: 'Automotive Part Y', location: 'B-03-01-03', expectedQty: 50, countedQty: 55, variance: 5, status: 'variance' },
]

export default function CycleCountExecutePage() {
  const [items, setItems] = useState<CountItem[]>(mockCountItems)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const filteredItems = items.filter(item => 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const countedCount = items.filter(i => i.status === 'counted').length
  const varianceCount = items.filter(i => i.status === 'variance').length
  const pendingCount = items.filter(i => i.status === 'pending').length

  const updateCount = (itemId: string, qty: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const variance = qty - item.expectedQty
        return {
          ...item,
          countedQty: qty,
          variance,
          status: variance !== 0 ? 'variance' : 'counted'
        }
      }
      return item
    }))
    setActiveItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Execute Cycle Count</h1>
          <p className="text-gray-500">Count Sheet #CC-2024-001 - Zone A, B, C</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Save className="w-4 h-4" />
            Save Progress
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
            <CheckCircle className="w-4 h-4" />
            Complete Count
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Counted</div>
          <div className="text-2xl font-bold text-green-600">{countedCount}</div>
          <div className="text-xs text-gray-400">{Math.round((countedCount / items.length) * 100)}% complete</div>
        </Card>
        <Card className="p-4 border-l-4 border-yellow-500">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-xs text-gray-400">Awaiting count</div>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <div className="text-sm text-gray-500">Variances</div>
          <div className="text-2xl font-bold text-red-600">{varianceCount}</div>
          <div className="text-xs text-gray-400">Require review</div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by SKU, description, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Count Sheet */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">SKU</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Expected</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Counted</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">Variance</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{item.location}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Barcode className="w-4 h-4 text-gray-400" />
                      {item.sku}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{item.description}</td>
                  <td className="py-3 px-4 text-right font-medium">{item.expectedQty}</td>
                  <td className="py-3 px-4 text-right">
                    {activeItem === item.id ? (
                      <input
                        type="number"
                        autoFocus
                        defaultValue={item.countedQty || ''}
                        className="w-20 px-2 py-1 border border-blue-300 rounded text-right"
                        onBlur={(e) => updateCount(item.id, Number(e.target.value))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateCount(item.id, Number((e.target as HTMLInputElement).value))
                          }
                        }}
                      />
                    ) : (
                      <span className={item.countedQty !== null ? 'font-medium' : 'text-gray-400'}>
                        {item.countedQty !== null ? item.countedQty : '-'}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.variance !== 0 && (
                      <span className={item.variance > 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.variance > 0 ? '+' : ''}{item.variance}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'counted' ? 'bg-green-100 text-green-700' :
                      item.status === 'variance' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setActiveItem(item.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200"
                    >
                      {item.countedQty !== null ? 'Edit' : 'Count'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
