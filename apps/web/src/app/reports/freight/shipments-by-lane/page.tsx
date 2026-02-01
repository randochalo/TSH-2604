import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ComparisonBarChart, KPICard } from '@/components/charts/ReportCharts'
import { ArrowLeft, Download, Ship, TrendingUp, DollarSign, Package } from 'lucide-react'
import Link from 'next/link'

async function getShipmentsByLaneReport(from?: string, to?: string) {
  try {
    const params = new URLSearchParams()
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/freight/shipments-by-lane?${params}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function ShipmentsByLanePage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getShipmentsByLaneReport(searchParams.from, searchParams.to)

  const chartData = report?.lanes?.map((lane: any) => ({
    name: lane.lane,
    actual: lane.revenue,
    budget: lane.cost * 1.25,
    variance: lane.profit,
  })) || []

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
              <h1 className="text-3xl font-bold text-gray-900">Shipments by Trade Lane</h1>
              <p className="text-gray-600">Period: {report?.period?.from} to {report?.period?.to}</p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard
            title="Total Shipments"
            value={(report?.totals?.shipments || 0).toString()}
            change="+15% vs last period"
            changeType="positive"
            icon={<Ship className="w-8 h-8" />}
          />
          <KPICard
            title="Total TEU"
            value={(report?.totals?.teu || 0).toString()}
            change="Volume metric"
            changeType="neutral"
            icon={<Package className="w-8 h-8" />}
          />
          <KPICard
            title="Total Revenue"
            value={`RM ${(report?.totals?.revenue || 0).toLocaleString()}`}
            change="Revenue by lane"
            changeType="positive"
            icon={<DollarSign className="w-8 h-8" />}
          />
          <KPICard
            title="Total Profit"
            value={`RM ${(report?.totals?.profit || 0).toLocaleString()}`}
            change={`${report?.totals?.margin || 0}% avg margin`}
            changeType="positive"
            icon={<TrendingUp className="w-8 h-8" />}
          />
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Cost by Trade Lane</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparisonBarChart data={chartData} height={300} />
          </CardContent>
        </Card>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Trade Lane Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-medium">Trade Lane</th>
                    <th className="px-4 py-3 font-medium text-right">Shipments</th>
                    <th className="px-4 py-3 font-medium text-right">TEU</th>
                    <th className="px-4 py-3 font-medium text-right">Revenue (RM)</th>
                    <th className="px-4 py-3 font-medium text-right">Cost (RM)</th>
                    <th className="px-4 py-3 font-medium text-right">Profit (RM)</th>
                    <th className="px-4 py-3 font-medium text-right">Margin %</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.lanes?.map((lane: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{lane.lane}</td>
                      <td className="px-4 py-3 text-right">{lane.shipments}</td>
                      <td className="px-4 py-3 text-right">{lane.teu}</td>
                      <td className="px-4 py-3 text-right">{lane.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{lane.cost.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">{lane.profit.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lane.margin >= 20 ? 'bg-green-100 text-green-800' : 
                          lane.margin >= 15 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {lane.margin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-4 py-3">TOTAL</td>
                    <td className="px-4 py-3 text-right">{report?.totals?.shipments}</td>
                    <td className="px-4 py-3 text-right">{report?.totals?.teu}</td>
                    <td className="px-4 py-3 text-right">{report?.totals?.revenue?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{report?.totals?.cost?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-green-700">{report?.totals?.profit?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{report?.totals?.margin}%</td>
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
