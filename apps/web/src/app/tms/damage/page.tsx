'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Container,
  ArrowLeft,
  FileImage,
  MapPin,
  Wrench,
  Upload
} from 'lucide-react'

interface DamageInspection {
  id: string
  inspectionNo: string
  containerNo: string
  inspectionDate: string
  damageType: string
  severity: string
  location: string
  description: string
  estimatedRepairCost: number
  photos: string[]
  status: string
  inspectedBy: { name: string }
  maintenanceRepair: { mrNo: string } | null
}

export default function DamageInspectionPage() {
  const [inspections, setInspections] = useState<DamageInspection[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ status: '', severity: '', search: '' })
  const [showNewModal, setShowNewModal] = useState(false)

  useEffect(() => {
    fetchInspections()
  }, [filter])

  async function fetchInspections() {
    try {
      const query = new URLSearchParams()
      if (filter.status) query.append('status', filter.status)
      if (filter.search) query.append('containerNo', filter.search)
      
      const res = await fetch(`/api/maintenance/damage/inspections?${query}`)
      if (res.ok) {
        const data = await res.json()
        setInspections(data)
      }
    } catch (error) {
      console.error('Error fetching damage inspections:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount || 0)
  }

  const severityColors: Record<string, string> = {
    MINOR: 'bg-yellow-100 text-yellow-800',
    MODERATE: 'bg-orange-100 text-orange-800',
    SEVERE: 'bg-red-100 text-red-800',
    CRITICAL: 'bg-red-200 text-red-900 border border-red-300',
  }

  const statusColors: Record<string, string> = {
    PENDING_ASSESSMENT: 'bg-yellow-100 text-yellow-800',
    ASSESSED: 'bg-blue-100 text-blue-800',
    M_R_CREATED: 'bg-purple-100 text-purple-800',
    REPAIR_COMPLETED: 'bg-green-100 text-green-800',
  }

  const damageTypes = [
    'DENT',
    'HOLE',
    'RUST',
    'DOOR_DAMAGE',
    'FLOOR_DAMAGE',
    'ROOF_DAMAGE',
    'CORNER_CASTING',
    'SEAL_DAMAGE',
    'PAINT_DAMAGE',
    'OTHER',
  ]

  return (
    <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/tms/maintenance" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Damage Inspection</h1>
              <p className="text-gray-600">Container damage assessment and M&R workflow</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Camera className="w-4 h-4 mr-2" />
            New Inspection
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Assessment</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  {inspections.filter(i => i.status === 'PENDING_ASSESSMENT').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Damage</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {inspections.filter(i => i.severity === 'CRITICAL').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Awaiting Repair</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">
                  {inspections.filter(i => i.status === 'ASSESSED').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <Wrench className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {inspections.filter(i => i.status === 'REPAIR_COMPLETED').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Container No..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={filter.search}
                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              />
            </div>
          </div>
          <select 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="PENDING_ASSESSMENT">Pending Assessment</option>
            <option value="ASSESSED">Assessed</option>
            <option value="M_R_CREATED">M&R Created</option>
            <option value="REPAIR_COMPLETED">Repair Completed</option>
          </select>
          <select 
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filter.severity}
            onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
          >
            <option value="">All Severities</option>
            <option value="MINOR">Minor</option>
            <option value="MODERATE">Moderate</option>
            <option value="SEVERE">Severe</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Inspections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!loading && inspections.length > 0 ? (
            inspections.map((inspection) => (
              <div key={inspection.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-medium text-gray-900">{inspection.inspectionNo}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[inspection.severity]}`}>
                        {inspection.severity}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1 text-gray-500">
                      <Container className="w-4 h-4" />
                      <span className="font-medium">{inspection.containerNo}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inspection.status]}`}>
                    {inspection.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Damage:</span>
                    <span className="font-medium">{inspection.damageType.replace(/_/g, ' ')}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{inspection.location}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Inspected:</span>
                    <span className="font-medium">{new Date(inspection.inspectionDate).toLocaleDateString()}</span>
                    <span className="text-gray-400">by {inspection.inspectedBy?.name || 'Unknown'}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-600">Est. Repair Cost:</span>
                    <span className="font-medium text-blue-600">{formatCurrency(inspection.estimatedRepairCost)}</span>
                  </div>

                  {inspection.maintenanceRepair && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Wrench className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Linked M&R:</span>
                      <Link href={`/tms/maintenance`} className="font-medium text-blue-600 hover:underline">
                        {inspection.maintenanceRepair.mrNo}
                      </Link>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileImage className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{inspection.photos?.length || 0} photos</span>
                  </div>
                  <div className="flex space-x-2">
                    {inspection.status === 'PENDING_ASSESSMENT' && (
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Assess
                      </button>
                    )}
                    {inspection.status === 'ASSESSED' && !inspection.maintenanceRepair && (
                      <button className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700">
                        Create M&R
                      </button>
                    )}
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50">
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 bg-white rounded-lg shadow p-12 text-center">
              <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No damage inspections found</p>
              <p className="text-sm text-gray-400 mt-1">Create a new inspection to get started</p>
            </div>
          )}
        </div>

        {/* New Inspection Modal */}
        {showNewModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">New Damage Inspection</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Container Number</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., MSCU1234567" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Damage Type</label>
                    <select className="w-full px-4 py-2 border rounded-lg">
                      {damageTypes.map(type => (
                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select className="w-full px-4 py-2 border rounded-lg">
                      <option value="MINOR">Minor</option>
                      <option value="MODERATE">Moderate</option>
                      <option value="SEVERE">Severe</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location on Container</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="e.g., Rear Door, Left Side Panel" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full px-4 py-2 border rounded-lg" rows={3} placeholder="Describe the damage..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Drop photos here or click to upload</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end space-x-3">
                <button 
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Save Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
