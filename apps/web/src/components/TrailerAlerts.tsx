'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { AlertTriangle, Calendar, Clock, FileText, AlertCircle, CheckCircle, Truck } from 'lucide-react'

interface ExpiryAlert {
  id: string
  type: 'roadTax' | 'insurance' | 'puspakom' | 'permit'
  entityType: 'vehicle' | 'trailer'
  entityId: string
  entityNo: string
  expiryDate: Date
  daysUntilExpiry: number
  status: 'critical' | 'warning' | 'normal'
}

// Mock expiry data
const generateMockAlerts = (): ExpiryAlert[] => {
  const today = new Date()
  
  return [
    {
      id: '1',
      type: 'roadTax',
      entityType: 'vehicle',
      entityId: 'v1',
      entityNo: 'WX1234',
      expiryDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      daysUntilExpiry: 5,
      status: 'critical',
    },
    {
      id: '2',
      type: 'puspakom',
      entityType: 'vehicle',
      entityId: 'v2',
      entityNo: 'WY5678',
      expiryDate: new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000),
      daysUntilExpiry: 12,
      status: 'warning',
    },
    {
      id: '3',
      type: 'insurance',
      entityType: 'vehicle',
      entityId: 'v3',
      entityNo: 'WZ9012',
      expiryDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      daysUntilExpiry: 3,
      status: 'critical',
    },
    {
      id: '4',
      type: 'puspakom',
      entityType: 'trailer',
      entityId: 't1',
      entityNo: 'T12345',
      expiryDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000),
      daysUntilExpiry: 45,
      status: 'normal',
    },
    {
      id: '5',
      type: 'permit',
      entityType: 'vehicle',
      entityId: 'v4',
      entityNo: 'WA3456',
      expiryDate: new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000),
      daysUntilExpiry: 8,
      status: 'warning',
    },
    {
      id: '6',
      type: 'roadTax',
      entityType: 'trailer',
      entityId: 't2',
      entityNo: 'T67890',
      expiryDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
      daysUntilExpiry: 2,
      status: 'critical',
    },
    {
      id: '7',
      type: 'insurance',
      entityType: 'trailer',
      entityId: 't3',
      entityNo: 'T11111',
      expiryDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000),
      daysUntilExpiry: 25,
      status: 'normal',
    },
    {
      id: '8',
      type: 'puspakom',
      entityType: 'vehicle',
      entityId: 'v5',
      entityNo: 'WB7890',
      expiryDate: new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000),
      daysUntilExpiry: 1,
      status: 'critical',
    },
  ]
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'roadTax': return <FileText className="w-5 h-5" />
    case 'insurance': return <CheckCircle className="w-5 h-5" />
    case 'puspakom': return <Truck className="w-5 h-5" />
    case 'permit': return <Calendar className="w-5 h-5" />
    default: return <AlertCircle className="w-5 h-5" />
  }
}

const getAlertColor = (status: string) => {
  switch (status) {
    case 'critical': return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' }
    case 'warning': return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'text-yellow-500' }
    default: return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' }
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'roadTax': return 'Road Tax'
    case 'insurance': return 'Insurance'
    case 'puspakom': return 'PUSPAKOM'
    case 'permit': return 'Permit'
    default: return type
  }
}

interface TrailerAlertsProps {
  showHeader?: boolean
  maxAlerts?: number
}

export function TrailerAlerts({ showHeader = true, maxAlerts = 5 }: TrailerAlertsProps) {
  const [alerts, setAlerts] = useState<ExpiryAlert[]>([])

  useEffect(() => {
    setAlerts(generateMockAlerts())
  }, [])

  const criticalCount = alerts.filter(a => a.status === 'critical').length
  const warningCount = alerts.filter(a => a.status === 'warning').length

  const displayedAlerts = alerts.slice(0, maxAlerts)

  return (
    <Card className="p-4">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold">Expiry Alerts</h3>
          </div>
          <div className="flex items-center gap-2">
            {criticalCount > 0 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                {criticalCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                {warningCount} Warning
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {displayedAlerts.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <CheckCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>No upcoming expiries</p>
          </div>
        ) : (
          displayedAlerts.map((alert) => {
            const colors = getAlertColor(alert.status)
            return (
              <div 
                key={alert.id} 
                className={`flex items-center gap-3 p-3 rounded-lg border ${colors.bg} ${colors.border}`}
              >
                <div className={`${colors.icon}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${colors.text}`}>
                      {alert.entityNo}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({alert.entityType})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getTypeLabel(alert.type)} expires in {alert.daysUntilExpiry} days
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-medium ${colors.text}`}>
                    {alert.expiryDate.toLocaleDateString('en-MY', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="text-xs text-gray-400">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {alert.daysUntilExpiry}d left
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {alerts.length > maxAlerts && (
        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all {alerts.length} alerts
          </button>
        </div>
      )}
    </Card>
  )
}

// Full alerts page component
export default function TrailerAlertsPage() {
  const [alerts, setAlerts] = useState<ExpiryAlert[]>([])
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'normal'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'vehicle' | 'trailer'>('all')

  useEffect(() => {
    setAlerts(generateMockAlerts())
  }, [])

  const filteredAlerts = alerts.filter(alert => {
    if (filter !== 'all' && alert.status !== filter) return false
    if (typeFilter !== 'all' && alert.entityType !== typeFilter) return false
    return true
  })

  const criticalCount = alerts.filter(a => a.status === 'critical').length
  const warningCount = alerts.filter(a => a.status === 'warning').length
  const normalCount = alerts.filter(a => a.status === 'normal').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expiry Alerts</h1>
          <p className="text-gray-500">Monitor vehicle and trailer permit expirations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Calendar className="w-4 h-4" />
          Renewal Calendar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
              <div className="text-xs text-gray-500">Critical (&lt;7 days)</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
              <div className="text-xs text-gray-500">Warning (7-14 days)</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{normalCount}</div>
              <div className="text-xs text-gray-500">Normal (&gt;14 days)</div>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-gray-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{alerts.length}</div>
              <div className="text-xs text-gray-500">Total Alerts</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="normal">Normal</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              <option value="vehicle">Vehicles</option>
              <option value="trailer">Trailers</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Alerts List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          All Alerts ({filteredAlerts.length})
        </h2>
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No alerts match your filters</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const colors = getAlertColor(alert.status)
              return (
                <div 
                  key={alert.id} 
                  className={`flex items-center gap-4 p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                >
                  <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center ${colors.icon}`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{alert.entityNo}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        alert.status === 'critical' ? 'bg-red-200 text-red-800' :
                        alert.status === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {alert.entityType === 'vehicle' ? 'Vehicle' : 'Trailer'} • {getTypeLabel(alert.type)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {alert.expiryDate.toLocaleDateString('en-MY', { 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <div className={`text-sm font-medium ${colors.text}`}>
                      {alert.daysUntilExpiry === 0 ? 'Expires today!' :
                       alert.daysUntilExpiry === 1 ? '1 day remaining' :
                       `${alert.daysUntilExpiry} days remaining`}
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
                    Renew
                  </button>
                </div>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
}

export default TrailerAlerts
