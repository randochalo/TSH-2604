import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Download, Truck, TrendingUp, DollarSign, Gauge } from 'lucide-react'
import Link from 'next/link'

async function getVehicleUtilizationReport() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/fleet/vehicle-utilization`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function VehicleUtilizationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getVehicleUtilizationReport()

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 85) return 'bg-green-500'
    if (utilization >= 70) return 'bg-blue-500'
    if (utilization >= 55) return 'bg-yellow-500'
    return 'bg-red-500'
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
              <h1 className="text-3xl font-bold text-gray-900">Vehicle Utilization</h1>
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
          <KPICard
            title="Total Vehicles"
            value={(report?.summary?.totalVehicles || 0).toString()}
            change="Fleet size"
            changeType="neutral"
            icon={<Truck className="w-8 h-8" />}
          />
          <KPICard
            title="Avg Utilization"
            value={`${report?.summary?.avgUtilization || 0}%`}
            change={report?.summary?.avgUtilization >= 80 ? 'Good' : 'Improve'}
            changeType={report?.summary?.avgUtilization >= 80 ? 'positive' : 'negative'}
            icon={<Gauge className="w-8 h-8" />}
          />
          <KPICard
            title="Total Revenue"
            value={`RM ${(report?.summary?.totalRevenue || 0).toLocaleString()}`}
            change="Fleet earnings"
            changeType="positive"
            icon={<DollarSign className="w-8 h-8" />}
          />
          <KPICard
            title="Total Profit"
            value={`RM ${(report?.summary?.totalProfit || 0).toLocaleString()}`}
            change={`${((report?.summary?.totalProfit || 0) / (report?.summary?.totalRevenue || 1) * 100).toFixed(1)}% margin`}
            changeType="positive"
            icon={<TrendingUp className="w-8 h-8" />}
          />
        </div>

        {/* Vehicle Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-medium">Registration</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium text-center">Utilization</th>
                    <th className="px-4 py-3 font-medium text-right">KM This Month</th>
                    <th className="px-4 py-3 font-medium text-right">Revenue (RM)</th>
                    <th className="px-4 py-3 font-medium text-right">Cost (RM)</th>
                    <th className="px-4 py-3 font-medium text-right">Profit (RM)</th>
                    <th className="px-4 py-3 font-medium text-right">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.vehicles?.map((vehicle: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        {vehicle.regNo}
                      </td>
                      <td className="px-4 py-3">{vehicle.type}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getUtilizationColor(vehicle.utilization)}`}
                              style={{ width: `${vehicle.utilization}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-10">{vehicle.utilization}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">{vehicle.kmThisMonth.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{vehicle.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{vehicle.cost.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">{vehicle.profit.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (vehicle.profit / vehicle.revenue * 100) >= 30 ? 'bg-green-100 text-green-800' : 
                          (vehicle.profit / vehicle.revenue * 100) >= 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {(vehicle.profit / vehicle.revenue * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-4 py-3" colSpan={4}>TOTAL</td>
                    <td className="px-4 py-3 text-right">{report?.summary?.totalRevenue?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{report?.summary?.totalCost?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-green-700">{report?.summary?.totalProfit?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      {((report?.summary?.totalProfit || 0) / (report?.summary?.totalRevenue || 1) * 100).toFixed(1)}%
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

import { KPICard } from '@/components/charts/ReportCharts'
