'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Truck, Navigation, MapPin, Clock } from 'lucide-react'

// Mock GPS data for demo
interface GpsPoint {
  lat: number
  lng: number
  timestamp: string
  speed: number
}

interface VehicleGps {
  vehicleId: string
  registrationNo: string
  driverName: string
  currentLocation: {
    lat: number
    lng: number
  }
  status: 'moving' | 'idle' | 'stopped'
  lastUpdated: string
  route: GpsPoint[]
}

interface GpsMapProps {
  vehicles?: VehicleGps[]
  height?: string
  showRoute?: boolean
  selectedVehicleId?: string | null
  onVehicleSelect?: (vehicleId: string) => void
}

// Mock GPS data
const mockVehicles: VehicleGps[] = [
  {
    vehicleId: 'v1',
    registrationNo: 'WX1234',
    driverName: 'Ahmad Bin Abdullah',
    currentLocation: { lat: 3.0448, lng: 101.4456 },
    status: 'moving',
    lastUpdated: '2 mins ago',
    route: [
      { lat: 3.0448, lng: 101.4456, timestamp: '2024-01-15T08:00:00Z', speed: 60 },
      { lat: 3.0500, lng: 101.4500, timestamp: '2024-01-15T08:05:00Z', speed: 55 },
      { lat: 3.0550, lng: 101.4600, timestamp: '2024-01-15T08:10:00Z', speed: 65 },
    ]
  },
  {
    vehicleId: 'v2',
    registrationNo: 'WY5678',
    driverName: 'John Smith',
    currentLocation: { lat: 3.1200, lng: 101.5200 },
    status: 'idle',
    lastUpdated: '15 mins ago',
    route: [
      { lat: 3.1200, lng: 101.5200, timestamp: '2024-01-15T08:00:00Z', speed: 0 },
    ]
  },
  {
    vehicleId: 'v3',
    registrationNo: 'WZ9012',
    driverName: 'Mohammad Hassan',
    currentLocation: { lat: 2.9800, lng: 101.3800 },
    status: 'moving',
    lastUpdated: '1 min ago',
    route: [
      { lat: 2.9800, lng: 101.3800, timestamp: '2024-01-15T08:00:00Z', speed: 70 },
    ]
  },
  {
    vehicleId: 'v4',
    registrationNo: 'WA3456',
    driverName: 'David Lee',
    currentLocation: { lat: 3.0800, lng: 101.6000 },
    status: 'stopped',
    lastUpdated: '5 mins ago',
    route: [
      { lat: 3.0800, lng: 101.6000, timestamp: '2024-01-15T08:00:00Z', speed: 0 },
    ]
  },
  {
    vehicleId: 'v5',
    registrationNo: 'WB7890',
    driverName: 'Kamaruddin Ibrahim',
    currentLocation: { lat: 3.1500, lng: 101.4800 },
    status: 'moving',
    lastUpdated: '3 mins ago',
    route: [
      { lat: 3.1500, lng: 101.4800, timestamp: '2024-01-15T08:00:00Z', speed: 55 },
    ]
  },
]

// Port Klang area coordinates for demo
const PORT_KLANG_BOUNDS = {
  north: 3.15,
  south: 2.95,
  east: 101.65,
  west: 101.35
}

export function GpsMap({ 
  vehicles = mockVehicles, 
  height = '400px',
  showRoute = false,
  selectedVehicleId,
  onVehicleSelect
}: GpsMapProps) {
  const [isClient, setIsClient] = useState(false)
  const [playbackIndex, setPlaybackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setPlaybackIndex(prev => (prev + 1) % 20)
    }, 500)
    return () => clearInterval(interval)
  }, [isPlaying])

  if (!isClient) {
    return (
      <Card className="p-4" style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    )
  }

  // Simple SVG map representation
  const mapWidth = 800
  const mapHeight = 500

  const latToY = (lat: number) => {
    const ratio = (lat - PORT_KLANG_BOUNDS.south) / (PORT_KLANG_BOUNDS.north - PORT_KLANG_BOUNDS.south)
    return mapHeight - (ratio * mapHeight)
  }

  const lngToX = (lng: number) => {
    const ratio = (lng - PORT_KLANG_BOUNDS.west) / (PORT_KLANG_BOUNDS.east - PORT_KLANG_BOUNDS.west)
    return ratio * mapWidth
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return '#10B981'
      case 'idle': return '#F59E0B'
      case 'stopped': return '#EF4444'
      default: return '#6B7280'
    }
  }

  return (
    <div className="relative">
      <Card className="overflow-hidden" style={{ height }}>
        <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50">
          {/* Map Background */}
          <svg 
            viewBox={`0 0 ${mapWidth} ${mapHeight}`} 
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Grid lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <g key={i}>
                <line 
                  x1={0} 
                  y1={i * (mapHeight / 10)} 
                  x2={mapWidth} 
                  y2={i * (mapHeight / 10)} 
                  stroke="#E5E7EB" 
                  strokeWidth="1"
                />
                <line 
                  x1={i * (mapWidth / 10)} 
                  y1={0} 
                  x2={i * (mapWidth / 10)} 
                  y2={mapHeight} 
                  stroke="#E5E7EB" 
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Roads */}
            <path 
              d={`M ${lngToX(101.35)} ${latToY(3.05)} Q ${lngToX(101.45)} ${latToY(3.08)} ${lngToX(101.55)} ${latToY(3.12)}`}
              stroke="#9CA3AF"
              strokeWidth="8"
              fill="none"
            />
            <path 
              d={`M ${lngToX(101.40)} ${latToY(2.98)} L ${lngToX(101.50)} ${latToY(3.05)} L ${lngToX(101.60)} ${latToY(3.10)}`}
              stroke="#9CA3AF"
              strokeWidth="6"
              fill="none"
            />
            <path 
              d={`M ${lngToX(101.45)} ${latToY(2.95)} L ${lngToX(101.45)} ${latToY(3.15)}`}
              stroke="#9CA3AF"
              strokeWidth="6"
              fill="none"
            />

            {/* Port area */}
            <rect 
              x={lngToX(101.32)} 
              y={latToY(3.12)} 
              width={lngToX(101.42) - lngToX(101.32)} 
              height={latToY(3.00) - latToY(3.12)}
              fill="#DBEAFE"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x={lngToX(101.37)} y={latToY(3.08)} textAnchor="middle" className="text-sm fill-blue-600 font-medium">
              Port Klang
            </text>

            {/* Free Trade Zone */}
            <rect 
              x={lngToX(101.50)} 
              y={latToY(3.08)} 
              width={lngToX(101.60) - lngToX(101.50)} 
              height={latToY(2.98) - latToY(3.08)}
              fill="#DCFCE7"
              stroke="#10B981"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x={lngToX(101.55)} y={latToY(3.03)} textAnchor="middle" className="text-xs fill-green-600">
              FTZ Area
            </text>

            {/* Route playback */}
            {showRoute && selectedVehicleId && (
              <>
                {(() => {
                  const vehicle = vehicles.find(v => v.vehicleId === selectedVehicleId)
                  if (!vehicle || !vehicle.route || vehicle.route.length < 2) return null
                  
                  const pathD = vehicle.route.map((point, i) => 
                    `${i === 0 ? 'M' : 'L'} ${lngToX(point.lng)} ${latToY(point.lat)}`
                  ).join(' ')
                  
                  return (
                    <path 
                      d={pathD}
                      stroke="#3B82F6"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="8,4"
                      opacity="0.7"
                    />
                  )
                })()}
              </>
            )}

            {/* Vehicle markers */}
            {vehicles.map((vehicle) => {
              const x = lngToX(vehicle.currentLocation.lng)
              const y = latToY(vehicle.currentLocation.lat)
              const isSelected = selectedVehicleId === vehicle.vehicleId
              
              return (
                <g 
                  key={vehicle.vehicleId}
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => onVehicleSelect?.(vehicle.vehicleId)}
                  style={{ transform: isSelected ? 'scale(1.2)' : 'scale(1)' }}
                >
                  {/* Pulse animation for moving vehicles */}
                  {vehicle.status === 'moving' && (
                    <circle
                      cx={x}
                      cy={y}
                      r="20"
                      fill={getStatusColor(vehicle.status)}
                      opacity="0.2"
                    >
                      <animate
                        attributeName="r"
                        values="15;25;15"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.3;0;0.3"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                  
                  {/* Vehicle marker */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 12 : 8}
                    fill={getStatusColor(vehicle.status)}
                    stroke="white"
                    strokeWidth="2"
                  />
                  
                  {/* Vehicle icon */}
                  <text 
                    x={x} 
                    y={y + 4} 
                    textAnchor="middle" 
                    className="text-xs fill-white font-bold"
                  >
                    🚛
                  </text>
                  
                  {/* Label */}
                  <text 
                    x={x} 
                    y={y - 15} 
                    textAnchor="middle" 
                    className="text-xs fill-gray-700 font-medium bg-white"
                  >
                    {vehicle.registrationNo}
                  </text>
                </g>
              )
            })}

            {/* Playback marker */}
            {isPlaying && selectedVehicleId && (
              <circle
                cx={lngToX(101.45 + (playbackIndex * 0.01))}
                cy={latToY(3.05 + (playbackIndex * 0.005))}
                r="8"
                fill="#8B5CF6"
                stroke="white"
                strokeWidth="2"
              />
            )}
          </svg>

          {/* Map overlay controls */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Legend</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>Moving</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>Idle</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>Stopped</span>
            </div>
          </div>

          {showRoute && (
            <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  isPlaying 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {isPlaying ? '⏸ Pause Route' : '▶ Play Route'}
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Vehicle List */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {vehicles.map((vehicle) => (
          <Card 
            key={vehicle.vehicleId}
            className={`p-3 cursor-pointer transition-all ${
              selectedVehicleId === vehicle.vehicleId 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onVehicleSelect?.(vehicle.vehicleId)}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: getStatusColor(vehicle.status) + '20' }}
              >
                <Truck className="w-5 h-5" style={{ color: getStatusColor(vehicle.status) }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{vehicle.registrationNo}</div>
                <div className="text-xs text-gray-500 truncate">{vehicle.driverName}</div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={`px-2 py-0.5 rounded-full ${
                vehicle.status === 'moving' ? 'bg-green-100 text-green-700' :
                vehicle.status === 'idle' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </span>
              <span className="text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {vehicle.lastUpdated}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Vehicle detail panel component
export function VehicleDetailPanel({ vehicleId }: { vehicleId: string | null }) {
  if (!vehicleId) {
    return (
      <Card className="p-6 h-full">
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <MapPin className="w-12 h-12 mb-3 opacity-50" />
          <p>Select a vehicle to view details</p>
        </div>
      </Card>
    )
  }

  const vehicle = mockVehicles.find(v => v.vehicleId === vehicleId)
  if (!vehicle) return null

  return (
    <Card className="p-6 h-full">
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ 
            backgroundColor: vehicle.status === 'moving' ? '#10B98120' :
                            vehicle.status === 'idle' ? '#F59E0B20' : '#EF444420'
          }}
        >
          <Truck className="w-8 h-8" style={{ 
            color: vehicle.status === 'moving' ? '#10B981' :
                   vehicle.status === 'idle' ? '#F59E0B' : '#EF4444'
          }} />
        </div>
        <div>
          <h3 className="text-xl font-bold">{vehicle.registrationNo}</h3>
          <p className="text-gray-500">{vehicle.driverName}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b">
          <span className="text-gray-500">Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            vehicle.status === 'moving' ? 'bg-green-100 text-green-700' :
            vehicle.status === 'idle' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b">
          <span className="text-gray-500">Current Speed</span>
          <span className="font-medium">
            {vehicle.status === 'moving' ? '55 km/h' : '0 km/h'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3 border-b">
          <span className="text-gray-500">Last Updated</span>
          <span className="font-medium">{vehicle.lastUpdated}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b">
          <span className="text-gray-500">Location</span>
          <span className="font-medium text-sm">
            {vehicle.currentLocation.lat.toFixed(4)}, {vehicle.currentLocation.lng.toFixed(4)}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-gray-500">GPS Signal</span>
          <span className="flex items-center gap-1 text-green-600">
            <Navigation className="w-4 h-4" />
            <span className="font-medium">Strong</span>
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <h4 className="font-medium mb-3">Today's Statistics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <div className="text-xs text-gray-500">Jobs Completed</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-600">142</div>
            <div className="text-xs text-gray-500">KM Driven</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default GpsMap
