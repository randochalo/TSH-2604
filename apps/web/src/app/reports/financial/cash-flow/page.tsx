import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StackedBarChart, KPICard } from '@/components/charts/ReportCharts'
import { ArrowLeft, Download, ArrowUpCircle, ArrowDownCircle, Wallet } from 'lucide-react'
import Link from 'next/link'

async function getCashFlowReport(from?: string, to?: string) {
  try {
    const params = new URLSearchParams()
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/financial/cash-flow?${params}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function CashFlowPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getCashFlowReport(searchParams.from, searchParams.to)

  const monthlyData = [
    { month: 'Jan', operating: 32000, investing: -18000, financing: -8000 },
    { month: 'Feb', operating: 35000, investing: -22000, financing: -5000 },
    { month: 'Mar', operating: 28000, investing: -15000, financing: -10000 },
    { month: 'Apr', operating: 42000, investing: -30000, financing: 15000 },
    { month: 'May', operating: 38000, investing: -20000, financing: -12000 },
    { month: 'Jun', operating: 45000, investing: -25000, financing: -8000 },
  ]

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
              <h1 className="text-3xl font-bold text-gray-900">Cash Flow Statement</h1>
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
            title="Operating Cash Flow"
            value={`RM ${(report?.operating?.total || 0).toLocaleString()}`}
            change="Primary source"
            changeType="positive"
            icon={<ArrowUpCircle className="w-8 h-8 text-green-600" />}
          />
          <KPICard
            title="Investing Cash Flow"
            value={`RM ${(report?.investing?.total || 0).toLocaleString()}`}
            change="Asset purchases"
            changeType="negative"
            icon={<ArrowDownCircle className="w-8 h-8 text-red-600" />}
          />
          <KPICard
            title="Financing Cash Flow"
            value={`RM ${(report?.financing?.total || 0).toLocaleString()}`}
            change="Loan activities"
            changeType="neutral"
            icon={<Wallet className="w-8 h-8" />}
          />
          <KPICard
            title="Closing Balance"
            value={`RM ${(report?.closingBalance || 0).toLocaleString()}`}
            change={`+RM ${(report?.netChange || 0).toLocaleString()}`}
            changeType="positive"
            icon={<Wallet className="w-8 h-8 text-blue-600" />}
          />
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Cash Flow Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <StackedBarChart data={monthlyData} height={300} />
          </CardContent>
        </Card>

        {/* Cash Flow Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Operating Activities */}
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-900 flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5" />
                Operating Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Net Profit</span>
                <span className="font-medium text-green-600">+ RM {report?.operating?.netProfit?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Add: Depreciation</span>
                <span className="font-medium text-green-600">+ RM {report?.operating?.depreciation?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Working Capital Changes</span>
                <span className="font-medium text-red-600">- RM {Math.abs(report?.operating?.changesInWorkingCapital || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-green-900 pt-3 border-t">
                <span>Net Cash from Operations</span>
                <span>RM {report?.operating?.total?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Investing Activities */}
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <ArrowDownCircle className="w-5 h-5" />
                Investing Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fixed Asset Purchases</span>
                <span className="font-medium text-red-600">- RM {Math.abs(report?.investing?.fixedAssetPurchase || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Asset Disposals</span>
                <span className="font-medium text-green-600">+ RM {report?.investing?.assetDisposal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-blue-900 pt-3 border-t">
                <span>Net Cash from Investing</span>
                <span>RM {report?.investing?.total?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Financing Activities */}
          <Card>
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-purple-900 flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Financing Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Loan Proceeds</span>
                <span className="font-medium text-green-600">+ RM {report?.financing?.loanProceeds?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Loan Repayments</span>
                <span className="font-medium text-red-600">- RM {Math.abs(report?.financing?.loanRepayment || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dividends Paid</span>
                <span className="font-medium text-red-600">- RM {Math.abs(report?.financing?.dividends || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-purple-900 pt-3 border-t">
                <span>Net Cash from Financing</span>
                <span>RM {report?.financing?.total?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 text-lg">
                <span className="font-medium">Net Increase/(Decrease) in Cash</span>
                <span className={`font-bold ${(report?.netChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  RM {report?.netChange?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Cash at Beginning of Period</span>
                <span className="font-medium">RM {report?.openingBalance?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-200 text-xl font-bold">
                <span>Cash at End of Period</span>
                <span className="text-blue-600">RM {report?.closingBalance?.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
