import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { RevenueTrendChart, KPICard } from '@/components/charts/ReportCharts'
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import Link from 'next/link'

async function getProfitLossReport(from?: string, to?: string) {
  try {
    const params = new URLSearchParams()
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/financial/profit-loss?${params}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function ProfitLossPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getProfitLossReport(searchParams.from, searchParams.to)

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
              <h1 className="text-3xl font-bold text-gray-900">Profit & Loss Statement</h1>
              <p className="text-gray-600">Period: {report?.period?.from} to {report?.period?.to}</p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KPICard
            title="Total Revenue"
            value={`RM ${(report?.revenue?.total || 0).toLocaleString()}`}
            change="+12.5% vs last year"
            changeType="positive"
            icon={<DollarSign className="w-8 h-8" />}
          />
          <KPICard
            title="Gross Profit"
            value={`RM ${(report?.grossProfit || 0).toLocaleString()}`}
            change={`${report?.margins?.gross || 0}% margin`}
            changeType="positive"
            icon={<TrendingUp className="w-8 h-8" />}
          />
          <KPICard
            title="Operating Profit"
            value={`RM ${(report?.operatingProfit || 0).toLocaleString()}`}
            change={`${report?.margins?.operating || 0}% margin`}
            changeType="neutral"
            icon={<TrendingUp className="w-8 h-8" />}
          />
          <KPICard
            title="Net Profit"
            value={`RM ${(report?.netProfit || 0).toLocaleString()}`}
            change={`${report?.margins?.net || 0}% margin`}
            changeType="positive"
            icon={<DollarSign className="w-8 h-8" />}
          />
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report?.revenue && Object.entries(report.revenue)
                  .filter(([key]) => key !== 'total')
                  .map(([service, amount]: [string, any]) => (
                    <div key={service} className="flex items-center justify-between">
                      <span className="capitalize text-gray-700">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(amount / report.revenue.total) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium w-24 text-right">RM {amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between font-bold">
                    <span>Total Revenue</span>
                    <span>RM {report?.revenue?.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Operating Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report?.operatingExpenses && Object.entries(report.operatingExpenses)
                  .filter(([key]) => key !== 'total')
                  .map(([expense, amount]: [string, any]) => (
                    <div key={expense} className="flex items-center justify-between">
                      <span className="capitalize text-gray-700">{expense.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(amount / report.operatingExpenses.total) * 100}%` }}
                          />
                        </div>
                        <span className="font-medium w-24 text-right">RM {amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between font-bold">
                    <span>Total Operating Expenses</span>
                    <span>RM {report?.operatingExpenses?.total?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full P&L Statement */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Profit & Loss Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Revenue Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">REVENUE</h3>
                {report?.revenue && Object.entries(report.revenue)
                  .filter(([key]) => key !== 'total')
                  .map(([service, amount]: [string, any]) => (
                    <div key={service} className="flex justify-between py-1 text-sm">
                      <span className="capitalize text-gray-600 pl-4">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-gray-900">RM {amount.toLocaleString()}</span>
                    </div>
                  ))}
                <div className="flex justify-between py-2 mt-2 border-t border-gray-200 font-semibold">
                  <span>Total Revenue</span>
                  <span>RM {report?.revenue?.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Cost of Sales */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">COST OF SALES</h3>
                {report?.costOfSales && Object.entries(report.costOfSales)
                  .filter(([key]) => key !== 'total')
                  .map(([service, amount]: [string, any]) => (
                    <div key={service} className="flex justify-between py-1 text-sm">
                      <span className="capitalize text-gray-600 pl-4">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-red-600">- RM {amount.toLocaleString()}</span>
                    </div>
                  ))}
                <div className="flex justify-between py-2 mt-2 border-t border-gray-200 font-semibold">
                  <span>Total Cost of Sales</span>
                  <span className="text-red-600">- RM {report?.costOfSales?.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Gross Profit */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between font-bold text-blue-900">
                  <span>GROSS PROFIT</span>
                  <span>RM {report?.grossProfit?.toLocaleString()}</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">Gross Margin: {report?.margins?.gross}%</p>
              </div>

              {/* Operating Expenses */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">OPERATING EXPENSES</h3>
                {report?.operatingExpenses && Object.entries(report.operatingExpenses)
                  .filter(([key]) => key !== 'total')
                  .map(([expense, amount]: [string, any]) => (
                    <div key={expense} className="flex justify-between py-1 text-sm">
                      <span className="capitalize text-gray-600 pl-4">{expense.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-red-600">- RM {amount.toLocaleString()}</span>
                    </div>
                  ))}
                <div className="flex justify-between py-2 mt-2 border-t border-gray-200 font-semibold">
                  <span>Total Operating Expenses</span>
                  <span className="text-red-600">- RM {report?.operatingExpenses?.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Operating Profit */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between font-bold text-green-900">
                  <span>OPERATING PROFIT</span>
                  <span>RM {report?.operatingProfit?.toLocaleString()}</span>
                </div>
                <p className="text-sm text-green-600 mt-1">Operating Margin: {report?.margins?.operating}%</p>
              </div>

              {/* Other Income/Expenses */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Other Income</span>
                  <span className="text-green-600">+ RM {report?.otherIncome?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Other Expenses</span>
                  <span className="text-red-600">- RM {report?.otherExpenses?.toLocaleString()}</span>
                </div>
              </div>

              {/* Net Profit */}
              <div className="bg-green-100 p-4 rounded-lg border-2 border-green-300">
                <div className="flex justify-between font-bold text-green-900 text-lg">
                  <span>NET PROFIT</span>
                  <span>RM {report?.netProfit?.toLocaleString()}</span>
                </div>
                <p className="text-sm text-green-700 mt-1">Net Margin: {report?.margins?.net}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
