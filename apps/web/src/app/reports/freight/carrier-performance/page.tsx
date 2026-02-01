import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Download, Ship, Star, Clock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

async function getCarrierPerformanceReport() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/freight/carrier-performance`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function CarrierPerformancePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getCarrierPerformanceReport()

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 92) return 'bg-green-500'
    if (reliability >= 88) return 'bg-blue-500'
    if (reliability >= 85) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
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
              <h1 className="text-3xl font-bold text-gray-900">Carrier Performance</h1>
              <p className="text-gray-600">Generated: {new Date(report?.generatedAt).toLocaleString()}</p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Carriers</div>
              <div className="text-3xl font-bold text-gray-900">{report?.carriers?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Avg Reliability</div>
              <div className="text-3xl font-bold text-blue-600">
                {report?.carriers?.length 
                  ? (report.carriers.reduce((sum: number, c: any) => sum + c.reliability, 0) / report.carriers.length).toFixed(1)
                  : 0}%
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Avg Transit Time</div>
              <div className="text-3xl font-bold text-orange-600">
                {report?.carriers?.length
                  ? Math.round(report.carriers.reduce((sum: number, c: any) => sum + c.avgTransit, 0) / report.carriers.length)
                  : 0} days
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Damage Claims</div>
              <div className="text-3xl font-bold text-red-600">
                {report?.carriers?.reduce((sum: number, c: any) => sum + c.damageClaims, 0) || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carrier Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Carrier Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-medium">Carrier</th>
                    <th className="px-4 py-3 font-medium text-right">Shipments</th>
                    <th className="px-4 py-3 font-medium text-right">On-Time</th>
                    <th className="px-4 py-3 font-medium text-center">Reliability</th>
                    <th className="px-4 py-3 font-medium text-right">Avg Transit</th>
                    <th className="px-4 py-3 font-medium text-center">Claims</th>
                    <th className="px-4 py-3 font-medium text-center">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.carriers?.map((carrier: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        <Ship className="w-4 h-4 text-blue-600" />
                        {carrier.carrier}
                      </td>
                      <td className="px-4 py-3 text-right">{carrier.shipments}</td>
                      <td className="px-4 py-3 text-right">{carrier.onTime}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getReliabilityColor(carrier.reliability)}`}
                              style={{ width: `${carrier.reliability}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{carrier.reliability}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          {carrier.avgTransit} days
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {carrier.damageClaims > 0 ? (
                          <span className="flex items-center justify-center gap-1 text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                            {carrier.damageClaims}
                          </span>
                        ) : (
                          <span className="text-green-600">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{carrier.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report?.carriers
                  ?.filter((c: any) => c.reliability >= 90 && c.damageClaims <= 1)
                  .map((carrier: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="font-medium">{carrier.carrier}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-green-600">{carrier.reliability}% reliability</span>
                        <span className="text-yellow-500">{'★'.repeat(Math.floor(carrier.rating))}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-900">Needs Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report?.carriers
                  ?.filter((c: any) => c.reliability < 88 || c.damageClaims > 2)
                  .map((carrier: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="font-medium">{carrier.carrier}</span>
                      <div className="flex items-center gap-3">
                        {c.reliability < 88 && (
                          <span className="text-sm text-red-600">{carrier.reliability}% reliability</span>
                        )}
                        {c.damageClaims > 2 && (
                          <span className="text-sm text-red-600">{carrier.damageClaims} claims</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
