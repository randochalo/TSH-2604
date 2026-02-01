'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { GpsMap, VehicleDetailPanel } from '@/components/GpsMap'
import { MapPin, Navigation, History, Layers } from 'lucide-react'

export default function GpsTrackingPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)
  const [showRoutePlayback, setShowRoutePlayback] = useState(false)
  const [mapView, setMapView] = useState<'satellite' | 'roadmap' | 'terrain'>('roadmap')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GPS Tracking</h1>
          <p className="text-gray-500">Real-time vehicle location monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRoutePlayback(!showRoutePlayback)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              showRoutePlayback 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <History className="w-4 h-4" />
            {showRoutePlayback ? 'Hide Route' : 'Route Playback'}
          </button>
          <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setMapView('roadmap')}
              className={`px-3 py-2 text-sm ${mapView === 'roadmap' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMapView('satellite')}
              className={`px-3 py-2 text-sm ${mapView === 'satellite' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <MapPin className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-gray-500">Moving</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">1</div>
              <div className="text-xs text-gray-500">Idle</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">1</div>
              <div className="text-xs text-gray-500">Stopped</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">5</div>
              <div className="text-xs text-gray-500">Total Vehicles</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Map and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GpsMap 
            height="500px"
            showRoute={showRoutePlayback}
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={setSelectedVehicleId}
          />
        </div>
        <div className="lg:col-span-1">
          <VehicleDetailPanel vehicleId={selectedVehicleId} />
        </div>
      </div>
    </div>
  )
}
