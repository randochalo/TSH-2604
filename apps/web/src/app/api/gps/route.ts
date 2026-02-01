import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock GPS data
const mockGpsData = [
  {
    vehicleId: 'v1',
    registrationNo: 'WX1234',
    driverName: 'Ahmad Bin Abdullah',
    currentLocation: { lat: 3.0448, lng: 101.4456 },
    status: 'moving',
    lastUpdated: new Date().toISOString(),
    speed: 55,
    heading: 45,
  },
  {
    vehicleId: 'v2',
    registrationNo: 'WY5678',
    driverName: 'John Smith',
    currentLocation: { lat: 3.1200, lng: 101.5200 },
    status: 'idle',
    lastUpdated: new Date(Date.now() - 15 * 60000).toISOString(),
    speed: 0,
    heading: 0,
  },
  {
    vehicleId: 'v3',
    registrationNo: 'WZ9012',
    driverName: 'Mohammad Hassan',
    currentLocation: { lat: 2.9800, lng: 101.3800 },
    status: 'moving',
    lastUpdated: new Date(Date.now() - 60000).toISOString(),
    speed: 70,
    heading: 90,
  },
  {
    vehicleId: 'v4',
    registrationNo: 'WA3456',
    driverName: 'David Lee',
    currentLocation: { lat: 3.0800, lng: 101.6000 },
    status: 'stopped',
    lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
    speed: 0,
    heading: 180,
  },
  {
    vehicleId: 'v5',
    registrationNo: 'WB7890',
    driverName: 'Kamaruddin Ibrahim',
    currentLocation: { lat: 3.1500, lng: 101.4800 },
    status: 'moving',
    lastUpdated: new Date(Date.now() - 3 * 60000).toISOString(),
    speed: 55,
    heading: 270,
  },
]

// Mock route history
const mockRouteHistory = [
  { timestamp: '2024-01-15T06:00:00Z', lat: 3.0448, lng: 101.4456, speed: 0 },
  { timestamp: '2024-01-15T06:15:00Z', lat: 3.0500, lng: 101.4500, speed: 40 },
  { timestamp: '2024-01-15T06:30:00Z', lat: 3.0550, lng: 101.4600, speed: 55 },
  { timestamp: '2024-01-15T06:45:00Z', lat: 3.0600, lng: 101.4700, speed: 60 },
  { timestamp: '2024-01-15T07:00:00Z', lat: 3.0650, lng: 101.4800, speed: 55 },
  { timestamp: '2024-01-15T07:15:00Z', lat: 3.0700, lng: 101.4900, speed: 50 },
  { timestamp: '2024-01-15T07:30:00Z', lat: 3.0750, lng: 101.5000, speed: 45 },
  { timestamp: '2024-01-15T07:45:00Z', lat: 3.0800, lng: 101.5100, speed: 35 },
  { timestamp: '2024-01-15T08:00:00Z', lat: 3.0850, lng: 101.5200, speed: 0 },
]

// GET /api/gps/vehicles - Get all vehicle GPS data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const history = searchParams.get('history')

    if (vehicleId && history === 'true') {
      // Return route history for a specific vehicle
      return NextResponse.json({
        vehicleId,
        route: mockRouteHistory,
        totalDistance: 28.5,
        duration: '2h 0m',
      })
    }

    if (vehicleId) {
      // Return specific vehicle
      const vehicle = mockGpsData.find(v => v.vehicleId === vehicleId)
      if (!vehicle) {
        return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
      }
      return NextResponse.json({ vehicle })
    }

    // Return all vehicles
    return NextResponse.json({ vehicles: mockGpsData })
  } catch (error) {
    console.error('GPS API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/gps/vehicles/:id/geofence - Create geofence
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vehicleId, geofence } = body

    // Mock geofence creation
    return NextResponse.json({
      success: true,
      geofenceId: `gf-${Date.now()}`,
      vehicleId,
      message: 'Geofence created successfully',
    })
  } catch (error) {
    console.error('GPS API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
