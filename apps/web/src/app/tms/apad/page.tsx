'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Train,
  ArrowRightLeft,
  Container,
  TrendingUp,
  Activity,
  Clock,
  RefreshCw,
  Shield,
  BarChart3
} from 'lucide-react'

interface ComplianceData {
  overallCompliance: number
  metrics: {
    gatePassCompliance: number
    railManifestCompliance: number
    yardInventoryAccuracy: number
    containerTracking: number
  }
  alerts: {
    pendingRailDocs: number
    expiredGatePasses: number
    unmatchedContainers: number
  }
  lastUpdated: string
}

interface KTMBIntegration {
  connected: boolean
  lastSync: string
  syncStatus: string
  apis: {
    manifest: { status: string; lastCall: string }
    tracking: { status: string; lastCall: string }
    schedule: { status: string; lastCall: string }
  }
}

export default function APADPage() {
  const [compliance, setCompliance] = useState<ComplianceData | null>(null)
  const [ktmb, setKtmb] = useState<KTMBIntegration | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompliance()
    fetchKTMBStatus()
  }, [])

  async function fetchCompliance() {
    try {
      const res = await fetch('/api/apad/compliance')
      if (res.ok) {
        const data = await res.json()
        setCompliance(data)
      }
    } catch (error) {
      console.error('Error fetching compliance:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchKTMBStatus() {
    try {
      const res = await fetch('/api/apad/ktmb-integration')
      if (res.ok) {
        const data = await res.json()
        setKtmb(data)
      }
    } catch (error) {
      console.error('Error fetching KTMB status:', error)
    }
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 95) return 'text-green-600'
    if (percentage >= 90) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 95) return 'bg-green-500'
    if (percentage >= 90) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">APAD Compliance</h1>
            <p className="text-gray-600">Terminal operations compliance dashboard - Port Klang Free Zone</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">
              Last updated: {compliance?.lastUpdated ? new Date(compliance.lastUpdated).toLocaleString() : '-'}
            </span>
            <button 
              onClick={() => { fetchCompliance(); fetchKTMBStatus(); }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Overall Compliance Score */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-blue-100">Overall Compliance Score</h2>
              <div className="flex items-baseline mt-2">
                <span className="text-5xl font-bold">{compliance?.overallCompliance || 0}%</span>
                <span className="ml-3 text-blue-200">Tender Requirement: 97%</span>
              </div>
              <p className="mt-2 text-blue-100">
                {compliance && compliance.overallCompliance >= 97 
                  ? '✓ Exceeds APAD tender compliance requirements' 
                  : '⚠ Below target - review flagged areas'}
              </p>
            </div>
            <div className="p-4 bg-white/10 rounded-lg">
              <Shield className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-100">
                <ArrowRightLeft className="w-6 h-6 text-green-600" />
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(compliance?.metrics.gatePassCompliance || 0)}`}>
                {compliance?.metrics.gatePassCompliance || 0}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Gate Pass Compliance</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${getProgressColor(compliance?.metrics.gatePassCompliance || 0)}`}
                style={{ width: `${compliance?.metrics.gatePassCompliance || 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Train className="w-6 h-6 text-blue-600" />
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(compliance?.metrics.railManifestCompliance || 0)}`}>
                {compliance?.metrics.railManifestCompliance || 0}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Rail Manifest Compliance</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${getProgressColor(compliance?.metrics.railManifestCompliance || 0)}`}
                style={{ width: `${compliance?.metrics.railManifestCompliance || 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Container className="w-6 h-6 text-purple-600" />
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(compliance?.metrics.yardInventoryAccuracy || 0)}`}>
                {compliance?.metrics.yardInventoryAccuracy || 0}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Yard Inventory Accuracy</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${getProgressColor(compliance?.metrics.yardInventoryAccuracy || 0)}`}
                style={{ width: `${compliance?.metrics.yardInventoryAccuracy || 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <span className={`text-2xl font-bold ${getStatusColor(compliance?.metrics.containerTracking || 0)}`}>
                {compliance?.metrics.containerTracking || 0}%
              </span>
            </div>
            <p className="text-sm text-gray-600">Container Tracking</p>
            <div className="mt-2 h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${getProgressColor(compliance?.metrics.containerTracking || 0)}`}
                style={{ width: `${compliance?.metrics.containerTracking || 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts Panel */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">Action Required</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {compliance?.alerts.pendingRailDocs > 0 && (
                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FileText className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pending Rail Manifests</p>
                      <p className="text-sm text-gray-500">{compliance.alerts.pendingRailDocs} trains awaiting manifest upload</p>
                    </div>
                  </div>
                  <Link href="/tms/rail" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View
                  </Link>
                </div>
              )}
              
              {compliance?.alerts.expiredGatePasses > 0 && (
                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Clock className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Expired Gate Passes</p>
                      <p className="text-sm text-gray-500">{compliance.alerts.expiredGatePasses} passes need renewal</p>
                    </div>
                  </div>
                  <Link href="/tms/gate" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View
                  </Link>
                </div>
              )}

              {compliance?.alerts.unmatchedContainers > 0 && (
                <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Container className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Unmatched Containers</p>
                      <p className="text-sm text-gray-500">{compliance.alerts.unmatchedContainers} containers without yard location</p>
                    </div>
                  </div>
                  <Link href="/tms/yard" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View
                  </Link>
                </div>
              )}

              {compliance?.alerts.pendingRailDocs === 0 && 
               compliance?.alerts.expiredGatePasses === 0 && 
               compliance?.alerts.unmatchedContainers === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p>All compliance items up to date</p>
                </div>
              )}
            </div>
          </div>

          {/* KTMB Integration Status */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Train className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">KTMB Integration</h2>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  ktmb?.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {ktmb?.syncStatus || 'DISCONNECTED'}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Manifest API</span>
                </div>
                <span className={`text-xs font-medium ${
                  ktmb?.apis.manifest.status === 'OPERATIONAL' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {ktmb?.apis.manifest.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Tracking API</span>
                </div>
                <span className={`text-xs font-medium ${
                  ktmb?.apis.tracking.status === 'OPERATIONAL' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {ktmb?.apis.tracking.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium">Schedule API</span>
                </div>
                <span className={`text-xs font-medium ${
                  ktmb?.apis.schedule.status === 'OPERATIONAL' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {ktmb?.apis.schedule.status}
                </span>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Last Sync: {ktmb?.lastSync ? new Date(ktmb.lastSync).toLocaleString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link href="/tms/gate" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowRightLeft className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Gate Operations</p>
                <p className="text-xs text-gray-500">Manage gate passes</p>
              </div>
            </div>
          </Link>

          <Link href="/tms/rail" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Train className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Rail Operations</p>
                <p className="text-xs text-gray-500">KTMB schedules</p>
              </div>
            </div>
          </Link>

          <Link href="/tms/yard" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Container className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Yard View</p>
                <p className="text-xs text-gray-500">Container locations</p>
              </div>
            </div>
          </Link>

          <Link href="/reports/audit/audit-log" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Audit Reports</p>
                <p className="text-xs text-gray-500">Compliance logs</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
