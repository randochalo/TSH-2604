import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Download, Users, Star, Fuel, AlertCircle, Award } from 'lucide-react'
import Link from 'next/link'

async function getDriverPerformanceReport() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/fleet/driver-performance`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function DriverPerformancePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getDriverPerformanceReport()

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600'
    if (rating >= 4.0) return 'text-blue-600'
    if (rating >= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/reports" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Driver Performance</h1>
              <p className="text-gray-600">Period: {report?.period}</p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Drivers</div>
              <div className="text-3xl font-bold text-gray-900">{report?.summary?.totalDrivers || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Avg Trips/Driver</div>
              <div className="text-3xl font-bold text-blue-600">{report?.summary?.avgTrips || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Avg Fuel Efficiency</div>
              <div className="text-3xl font-bold text-green-600">{report?.summary?.avgFuelEfficiency} km/L</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Incentives</div>
              <div className="text-3xl font-bold text-orange-600">RM {report?.summary?.totalIncentives?.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Driver Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Driver Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-medium">Driver</th>
                    <th className="px-4 py-3 font-medium">License</th>
                    <th className="px-4 py-3 font-medium text-right">Trips</th>
                    <th className="px-4 py-3 font-medium text-right">KM Driven</th>
                    <th className="px-4 py-3 font-medium text-right">Fuel (km/L)</th>
                    <th className="px-4 py-3 font-medium text-center">On-Time %</th>
                    <th className="px-4 py-3 font-medium text-center">Incidents</th>
                    <th className="px-4 py-3 font-medium text-center">Rating</th>
                    <th className="px-4 py-3 font-medium text-right">Incentive (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.drivers?.map((driver: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        {driver.name}
                      </td>
                      <td className="px-4 py-3 text-xs">{driver.license}</td>
                      <td className="px-4 py-3 text-right">{driver.trips}</td>
                      <td className="px-4 py-3 text-right">{driver.kmDriven.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={driver.fuelEfficiency <= 3.3 ? 'text-green-600' : 'text-orange-600'}>
                          {driver.fuelEfficiency}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (driver.onTime / driver.trips * 100) >= 95 ? 'bg-green-100 text-green-800' : 
                          (driver.onTime / driver.trips * 100) >= 90 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {((driver.onTime / driver.trips) * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {driver.incidents > 0 ? (
                          <span className="flex items-center justify-center gap-1 text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            {driver.incidents}
                          </span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className={`w-4 h-4 fill-yellow-500 text-yellow-500`} />
                          <span className={`font-medium ${getRatingColor(driver.rating)}`}>{driver.rating}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">{driver.incentive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-900 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Top Performers - Incentive Earners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report?.drivers
                ?.sort((a: any, b: any) => b.incentive - a.incentive)
                .slice(0, 3)
                .map((driver: any, idx: number) => (
                  <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{driver.name}</p>
                        <p className="text-sm text-gray-600">{driver.trips} trips • {driver.rating} ★</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Incentive Earned</span>
                        <span className="font-bold text-green-600">RM {driver.incentive}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
