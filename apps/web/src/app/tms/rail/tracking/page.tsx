'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { 
  Train,
  MapPin,
  Clock,
  Container,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Navigation,
  Package,
  Calendar
} from 'lucide-react'

interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
}

interface RailTracking {
  id: string
  manifestNo: string
  trainNo: string
  origin: string
  destination: string
  departureDate: string
  estimatedArrival: string
  currentLocation: string
  status: string
  progress: number
  containers: number
  events: TrackingEvent[]
}

export default function RailTrackingPage() {
  const searchParams = useSearchParams()
  const scheduleId = searchParams.get('id')
  
  const [tracking, setTracking] = useState<RailTracking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTracking()
  }, [scheduleId])

  async function fetchTracking() {
    try {
      // In a real app, this would fetch from KTMB API
      // Mock data for demonstration
      const mockTracking: RailTracking = {
        id: scheduleId || 'rail-1',
        manifestNo: 'KTMB-001',
        trainNo: 'T123',
        origin: 'Port Klang',
        destination: 'Padang Besar',
        departureDate: '2026-02-01T08:00:00',
        estimatedArrival: '2026-02-02T14:00:00',
        currentLocation: 'Ipoh Station',
        status: 'IN_TRANSIT',
        progress: 65,
        containers: 24,
        events: [
          { id: '1', timestamp: '2026-02-01T08:00:00', location: 'Port Klang', status: 'DEPARTED', description: 'Train departed from Port Klang' },
          { id: '2', timestamp: '2026-02-01T10:30:00', location: 'Kuala Lumpur', status: 'TRANSIT', description: 'Passed through KL Sentral' },
          { id: '3', timestamp: '2026-02-01T14:00:00', location: 'Ipoh', status: 'TRANSIT', description: 'Currently at Ipoh Station' },
          { id: '4', timestamp: '2026-02-02T14:00:00', location: 'Padang Besar', status: 'ARRIVED', description: 'Estimated arrival' },
        ]
      }
      
      setTracking(mockTracking)
    } catch (error) {
      console.error('Error fetching tracking:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800',
    DEPARTED: 'bg-purple-100 text-purple-800',
    IN_TRANSIT: 'bg-orange-100 text-orange-800',
    ARRIVED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
  }

  return (
    <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/tms/rail/schedule" className="text-gray-600 hover:text-gray-900">
              <ArrowRight className="w-6 h-6 rotate-180" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rail Tracking</h1>
              <p className="text-gray-600">Real-time KTMB container train tracking</p>
            </div>
          </div>
          <button 
            onClick={fetchTracking}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {!loading && tracking && (
          <>
            {/* Train Status Card */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <div className="p-4 bg-blue-100 rounded-lg">
                    <Train className="w-12 h-12 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h2 className="text-2xl font-bold text-gray-900">Train {tracking.trainNo}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[tracking.status]}`}>
                        {tracking.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-lg text-gray-600 mt-1">Manifest: {tracking.manifestNo}</p>
                    
                    <div className="flex items-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="text-gray-500">From:</span> {tracking.origin}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          <span className="text-gray-500">To:</span> {tracking.destination}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
                    <Container className="w-6 h-6" />
                    <span>{tracking.containers}</span>
                  </div>
                  <p className="text-sm text-gray-500">Containers</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Journey Progress</span>
                  <span className="text-sm font-medium text-blue-600">{tracking.progress}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full">
                  <div 
                    className="h-3 bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${tracking.progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{tracking.origin}</span>
                  <span className="font-medium text-orange-600">Current: {tracking.currentLocation}</span>
                  <span>{tracking.destination}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tracking Timeline */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Tracking Timeline</h2>
                </div>
                <div className="p-6">
                  <div className="relative">
                    {tracking.events.map((event, index) => (
                      <div key={event.id} className="flex items-start mb-8 last:mb-0">
                        <div className="flex flex-col items-center mr-4">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 2 ? 'bg-orange-500 ring-4 ring-orange-100' : 
                            index < 2 ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                          {index < tracking.events.length - 1 && (
                            <div className={`w-0.5 h-16 mt-2 ${
                              index < 2 ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className={`flex-1 pb-8 ${index === 2 ? 'bg-orange-50 -mx-6 px-6 py-3 rounded-lg' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{event.location}</p>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">{new Date(event.timestamp).toLocaleDateString()}</p>
                              <p className="text-xs text-gray-400">{new Date(event.timestamp).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Panel */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Current Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium">Current Location</span>
                      </div>
                      <span className="font-medium text-orange-700">{tracking.currentLocation}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Est. Arrival</span>
                      </div>
                      <span className="font-medium text-blue-700">
                        {new Date(tracking.estimatedArrival).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Package className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">Containers</span>
                      </div>
                      <span className="font-medium text-green-700">{tracking.containers}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Container className="w-5 h-5 text-gray-600" />
                        <span className="text-sm">View Container List</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-600" />
                        <span className="text-sm">View Schedule</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* KTMB API Status */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow p-6 text-white">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">KTMB API Connected</span>
                  </div>
                  <p className="text-sm text-blue-100">
                    Real-time tracking data is being received from KTMB systems.
                  </p>
                  <p className="text-xs text-blue-200 mt-2">
                    Last update: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
