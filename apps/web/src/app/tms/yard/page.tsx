'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  MapPin, 
  Container,
  Search,
  Filter,
  Plus,
  ArrowRightLeft,
  Grid3X3,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface YardBlock {
  id: string
  code: string
  name: string
  rows: number
  tiers: number
  _count: { slots: number }
  slots: YardSlot[]
}

interface YardSlot {
  id: string
  row: string
  slot: string
  tier: number
  containerNo: string | null
  occupiedAt: string | null
}

export default function YardPage() {
  const [blocks, setBlocks] = useState<YardBlock[]>([])
  const [selectedBlock, setSelectedBlock] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchYardBlocks()
  }, [])

  async function fetchYardBlocks() {
    try {
      const res = await fetch('/api/yard-blocks')
      if (res.ok) {
        const data = await res.json()
        setBlocks(data)
        if (data.length > 0 && !selectedBlock) {
          setSelectedBlock(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching yard blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentBlock = blocks.find(b => b.id === selectedBlock)
  
  const filteredSlots = currentBlock?.slots.filter(slot => 
    !searchTerm || 
    slot.containerNo?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const occupiedSlots = currentBlock?.slots.filter(s => s.containerNo).length || 0
  const totalSlots = currentBlock?._count.slots || 0
  const utilization = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0

  const getSlotColor = (slot: YardSlot) => {
    if (slot.containerNo) {
      // Check if container has been there too long (> 14 days)
      if (slot.occupiedAt) {
        const days = Math.floor((Date.now() - new Date(slot.occupiedAt).getTime()) / (1000 * 60 * 60 * 24))
        if (days > 14) return 'bg-red-100 border-red-300 text-red-700'
        if (days > 7) return 'bg-yellow-100 border-yellow-300 text-yellow-700'
      }
      return 'bg-blue-100 border-blue-300 text-blue-700'
    }
    return 'bg-gray-50 border-gray-200 text-gray-400'
  }

  return (
    <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Yard View</h1>
            <p className="text-gray-600">Container yard visualization and management</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/tms/gate"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Gate Operations
            </Link>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Block
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Blocks</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{blocks.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Grid3X3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Slots</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{totalSlots}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">{occupiedSlots}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <Container className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilization</p>
                <p className={`text-2xl font-bold mt-1 ${
                  utilization > 85 ? 'text-red-600' : utilization > 70 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {utilization}%
                </p>
              </div>
              <div className={`p-3 rounded-lg ${
                utilization > 85 ? 'bg-red-50' : utilization > 70 ? 'bg-yellow-50' : 'bg-green-50'
              }`}>
                {utilization > 85 ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Block Selection & Search */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Select Block:</span>
            <select 
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
            >
              {blocks.map(block => (
                <option key={block.id} value={block.id}>
                  {block.code} - {block.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search container number..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Yard Visualization */}
        {currentBlock && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{currentBlock.name} ({currentBlock.code})</h2>
                <p className="text-sm text-gray-500">
                  {currentBlock.rows} Rows × 10 Slots × {currentBlock.tiers + 1} Tiers
                </p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded" />
                  <span className="text-gray-600">Occupied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded" />
                  <span className="text-gray-600">&gt; 7 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
                  <span className="text-gray-600">&gt; 14 days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded" />
                  <span className="text-gray-600">Empty</span>
                </div>
              </div>
            </div>

            {/* Yard Grid */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Header - Tier labels */}
                <div className="flex">
                  <div className="w-12" /> {/* Row label spacer */}
                  {Array.from({ length: currentBlock.tiers + 1 }, (_, t) => (
                    <div key={t} className="flex-1 text-center text-xs text-gray-500 py-2">
                      Tier {t}
                    </div>
                  ))}
                </div>
                
                {/* Rows */}
                {Array.from({ length: currentBlock.rows }, (_, r) => {
                  const rowLabel = String.fromCharCode(65 + r)
                  return (
                    <div key={r} className="flex items-center mb-2">
                      <div className="w-12 text-center font-medium text-gray-700">{rowLabel}</div>
                      <div className="flex-1 grid grid-cols-10 gap-1">
                        {filteredSlots
                          .filter(s => s.row === rowLabel)
                          .sort((a, b) => parseInt(a.slot) - parseInt(b.slot))
                          .map(slot => (
                            <div
                              key={slot.id}
                              className={`aspect-square border rounded flex items-center justify-center text-xs cursor-pointer hover:opacity-80 transition-opacity ${getSlotColor(slot)}`}
                              title={slot.containerNo || `Empty: ${slot.row}-${slot.slot}-${slot.tier}`}
                            >
                              {slot.containerNo ? (
                                <span className="truncate px-1">{slot.containerNo.slice(-4)}</span>
                              ) : (
                                <span className="text-gray-300">{slot.tier}</span>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Container List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Container List - {currentBlock?.name}</h2>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Container No</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Days in Yard</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentBlock?.slots.filter(s => s.containerNo).length ? (
                currentBlock.slots
                  .filter(s => s.containerNo)
                  .sort((a, b) => new Date(b.occupiedAt || 0).getTime() - new Date(a.occupiedAt || 0).getTime())
                  .map((slot) => {
                    const days = slot.occupiedAt 
                      ? Math.floor((Date.now() - new Date(slot.occupiedAt).getTime()) / (1000 * 60 * 60 * 24))
                      : 0
                    return (
                      <tr key={slot.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{slot.containerNo}</td>
                        <td className="px-6 py-4">{currentBlock.code}-{slot.row}-{slot.slot}</td>
                        <td className="px-6 py-4">{slot.tier}</td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${
                            days > 14 ? 'text-red-600' : days > 7 ? 'text-yellow-600' : 'text-gray-900'
                          }`}>
                            {days} days
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {days > 14 ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Overdue
                            </span>
                          ) : days > 7 ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Warning
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <Container className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No containers in this block</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
