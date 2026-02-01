import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Download, FileText, Calculator } from 'lucide-react'
import Link from 'next/link'

async function getGSTReport(period?: string) {
  try {
    const params = new URLSearchParams()
    if (period) params.append('period', period)
    
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/financial/gst?${params}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function GSTReportPage({
  searchParams,
}: {
  searchParams: { period?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getGSTReport(searchParams.period)

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
              <h1 className="text-3xl font-bold text-gray-900">GST Report (GST-03)</h1>
              <p className="text-gray-600">Tax Period: {report?.period}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FileText className="w-4 h-4 mr-2" />
              GST-03 Format
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* GST Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-blue-50">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Output Tax</div>
              <div className="text-2xl font-bold text-blue-900">RM {report?.outputTax?.totalOutput?.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Input Tax</div>
              <div className="text-2xl font-bold text-green-900">RM {report?.inputTax?.totalInput?.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Net GST Payable</div>
              <div className="text-2xl font-bold text-orange-900">RM {report?.gstPayable?.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Output Tax (Sales) */}
          <Card>
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-900">Output Tax (Sales)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2">Category</th>
                    <th className="py-2 text-right">Amount (RM)</th>
                    <th className="py-2 text-right">GST (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Standard Rated (6%)</td>
                    <td className="py-2 text-right">{report?.outputTax?.standardRated?.amount?.toLocaleString()}</td>
                    <td className="py-2 text-right font-medium">{report?.outputTax?.standardRated?.gst?.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Zero Rated (0%)</td>
                    <td className="py-2 text-right">{report?.outputTax?.zeroRated?.amount?.toLocaleString()}</td>
                    <td className="py-2 text-right">{report?.outputTax?.zeroRated?.gst?.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Exempt</td>
                    <td className="py-2 text-right">{report?.outputTax?.exempt?.amount?.toLocaleString()}</td>
                    <td className="py-2 text-right">{report?.outputTax?.exempt?.gst?.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-bold text-blue-900">
                    <td className="py-3">Total Output Tax</td>
                    <td className="py-3 text-right"></td>
                    <td className="py-3 text-right">RM {report?.outputTax?.totalOutput?.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>

          {/* Input Tax (Purchases) */}
          <Card>
            <CardHeader className="bg-green-50">
              <CardTitle className="text-green-900">Input Tax (Purchases)</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600 border-b">
                    <th className="py-2">Category</th>
                    <th className="py-2 text-right">Amount (RM)</th>
                    <th className="py-2 text-right">GST (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Taxable Purchases</td>
                    <td className="py-2 text-right">{report?.inputTax?.taxablePurchases?.amount?.toLocaleString()}</td>
                    <td className="py-2 text-right font-medium">{report?.inputTax?.taxablePurchases?.gst?.toLocaleString()}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Capital Goods</td>
                    <td className="py-2 text-right">{report?.inputTax?.capitalGoods?.amount?.toLocaleString()}</td>
                    <td className="py-2 text-right">{report?.inputTax?.capitalGoods?.gst?.toLocaleString()}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="font-bold text-green-900">
                    <td className="py-3">Total Input Tax</td>
                    <td className="py-3 text-right"></td>
                    <td className="py-3 text-right">RM {report?.inputTax?.totalInput?.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* GST Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              GST Calculation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">Total Output Tax</span>
                <span className="font-medium">RM {report?.outputTax?.totalOutput?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">Less: Total Input Tax</span>
                <span className="font-medium">- RM {report?.inputTax?.totalInput?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">Add: Adjustments</span>
                <span className="font-medium">RM {report?.adjustments?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-gray-200 text-lg font-bold">
                <span>Net GST Payable/(Claimable)</span>
                <span className={report?.gstPayable >= 0 ? 'text-orange-600' : 'text-green-600'}>
                  RM {report?.gstPayable?.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filing Info */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-yellow-900 mb-2">GST Filing Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-yellow-700">Filing Deadline:</span>
                <p className="font-medium text-yellow-900">Last day of the following month</p>
              </div>
              <div>
                <span className="text-yellow-700">Submission Method:</span>
                <p className="font-medium text-yellow-900">Online via MyGST Portal</p>
              </div>
              <div>
                <span className="text-yellow-700">Late Payment Penalty:</span>
                <p className="font-medium text-yellow-900">5% penalty on unpaid tax</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
