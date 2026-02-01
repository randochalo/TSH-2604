import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { DistributionPieChart, KPICard } from '@/components/charts/ReportCharts'
import { ArrowLeft, Download, Scale, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

async function getBalanceSheet() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/financial/balance-sheet`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function BalanceSheetPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getBalanceSheet()

  const assetDistribution = [
    { name: 'Current Assets', value: report?.assets?.current?.total || 0 },
    { name: 'Fixed Assets', value: report?.assets?.nonCurrent?.fixedAssets || 0 },
    { name: 'Investments', value: report?.assets?.nonCurrent?.investments || 0 },
  ]

  const liabilityDistribution = [
    { name: 'Current Liabilities', value: report?.liabilities?.current?.total || 0 },
    { name: 'Long-term Loans', value: report?.liabilities?.nonCurrent?.longTermLoans || 0 },
    { name: 'Deferred Tax', value: report?.liabilities?.nonCurrent?.deferredTax || 0 },
    { name: 'Equity', value: report?.equity?.total || 0 },
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
              <h1 className="text-3xl font-bold text-gray-900">Balance Sheet</h1>
              <p className="text-gray-600">As of {report?.asOf}</p>
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
            title="Total Assets"
            value={`RM ${(report?.assets?.total || 0).toLocaleString()}`}
            change="+5.2% vs last month"
            changeType="positive"
            icon={<Scale className="w-8 h-8" />}
          />
          <KPICard
            title="Total Liabilities"
            value={`RM ${(report?.liabilities?.total || 0).toLocaleString()}`}
            change="-2.1% vs last month"
            changeType="positive"
            icon={<TrendingDown className="w-8 h-8" />}
          />
          <KPICard
            title="Total Equity"
            value={`RM ${(report?.equity?.total || 0).toLocaleString()}`}
            change="+8.5% vs last month"
            changeType="positive"
            icon={<TrendingUp className="w-8 h-8" />}
          />
          <KPICard
            title="Current Ratio"
            value="2.34"
            change="Healthy"
            changeType="positive"
            icon={<Scale className="w-8 h-8" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <DistributionPieChart data={assetDistribution} height={250} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Liabilities & Equity Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <DistributionPieChart data={liabilityDistribution} height={250} />
            </CardContent>
          </Card>
        </div>

        {/* Balance Sheet Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assets */}
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-900">ASSETS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Current Assets */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Current Assets</h4>
                <div className="space-y-1 pl-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cash & Bank</span>
                    <span className="font-medium">RM {report?.assets?.current?.cash?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Accounts Receivable</span>
                    <span className="font-medium">RM {report?.assets?.current?.accountsReceivable?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Inventory</span>
                    <span className="font-medium">RM {report?.assets?.current?.inventory?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Prepayments</span>
                    <span className="font-medium">RM {report?.assets?.current?.prepayments?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold text-blue-900 mt-2 pt-2 border-t">
                  <span>Total Current Assets</span>
                  <span>RM {report?.assets?.current?.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Non-Current Assets */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Non-Current Assets</h4>
                <div className="space-y-1 pl-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fixed Assets (Net)</span>
                    <span className="font-medium">RM {report?.assets?.nonCurrent?.fixedAssets?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Investments</span>
                    <span className="font-medium">RM {report?.assets?.nonCurrent?.investments?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold text-blue-900 mt-2 pt-2 border-t">
                  <span>Total Non-Current Assets</span>
                  <span>RM {report?.assets?.nonCurrent?.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg text-blue-900 pt-2 border-t-2">
                <span>TOTAL ASSETS</span>
                <span>RM {report?.assets?.total?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Liabilities & Equity */}
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-900">LIABILITIES & EQUITY</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* Current Liabilities */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Current Liabilities</h4>
                <div className="space-y-1 pl-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Accounts Payable</span>
                    <span className="font-medium">RM {report?.liabilities?.current?.accountsPayable?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Accruals</span>
                    <span className="font-medium">RM {report?.liabilities?.current?.accruals?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Short-term Loans</span>
                    <span className="font-medium">RM {report?.liabilities?.current?.shortTermLoans?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold text-red-700 mt-2 pt-2 border-t">
                  <span>Total Current Liabilities</span>
                  <span>RM {report?.liabilities?.current?.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Non-Current Liabilities */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Non-Current Liabilities</h4>
                <div className="space-y-1 pl-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Long-term Loans</span>
                    <span className="font-medium">RM {report?.liabilities?.nonCurrent?.longTermLoans?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Deferred Tax</span>
                    <span className="font-medium">RM {report?.liabilities?.nonCurrent?.deferredTax?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between font-semibold text-red-700 mt-2 pt-2 border-t">
                  <span>Total Non-Current Liabilities</span>
                  <span>RM {report?.liabilities?.nonCurrent?.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-red-700 pt-2 border-t-2">
                <span>TOTAL LIABILITIES</span>
                <span>RM {report?.liabilities?.total?.toLocaleString()}</span>
              </div>

              {/* Equity */}
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-gray-900 mb-2">Shareholders' Equity</h4>
                <div className="space-y-1 pl-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Share Capital</span>
                    <span className="font-medium">RM {report?.equity?.shareCapital?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Retained Earnings</span>
                    <span className="font-medium">RM {report?.equity?.retainedEarnings?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-lg text-green-900 pt-2 border-t-2 mt-2">
                  <span>TOTAL EQUITY</span>
                  <span>RM {report?.equity?.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg bg-green-100 p-3 rounded-lg">
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span>RM {report?.totalLiabilitiesAndEquity?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
