import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ArrowLeft, Download, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

async function getAgeingReport(type: 'debtors' | 'creditors') {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/reports/financial/ageing?type=${type}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function DebtorsAgeingPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const report = await getAgeingReport('debtors')

  const ageingBuckets = [
    { label: 'Current', key: 'current', color: 'bg-green-500' },
    { label: '1-30 Days', key: 'days1to30', color: 'bg-blue-500' },
    { label: '31-60 Days', key: 'days31to60', color: 'bg-yellow-500' },
    { label: '61-90 Days', key: 'days61to90', color: 'bg-orange-500' },
    { label: 'Over 90 Days', key: 'over90', color: 'bg-red-500' },
  ]

  const total = report?.summary?.total || 1

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
              <h1 className="text-3xl font-bold text-gray-900">Debtors Ageing Report</h1>
              <p className="text-gray-600">As of {new Date(report?.generatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {ageingBuckets.map((bucket) => (
            <Card key={bucket.key}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${bucket.color}`} />
                  <span className="text-sm text-gray-600">{bucket.label}</span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  RM {report?.summary?.[bucket.key]?.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {((report?.summary?.[bucket.key] || 0) / total * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Total Outstanding */}
        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Outstanding</p>
                  <p className="text-3xl font-bold text-blue-900">RM {report?.summary?.total?.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Overdue Amount</p>
                <p className="text-xl font-bold text-red-600">
                  RM {((report?.summary?.days31to60 || 0) + (report?.summary?.days61to90 || 0) + (report?.summary?.over90 || 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Details Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ageing by Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium text-right text-green-700">Current</th>
                    <th className="px-4 py-3 font-medium text-right text-blue-700">1-30 Days</th>
                    <th className="px-4 py-3 font-medium text-right text-yellow-700">31-60 Days</th>
                    <th className="px-4 py-3 font-medium text-right text-orange-700">61-90 Days</th>
                    <th className="px-4 py-3 font-medium text-right text-red-700">Over 90</th>
                    <th className="px-4 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.details?.map((customer: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{customer.customer}</td>
                      <td className="px-4 py-3 text-right">{customer.current?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{customer.days1to30?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{customer.days31to60?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{customer.days61to90?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">{customer.over90?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold">{customer.total?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-4 py-3">TOTAL</td>
                    <td className="px-4 py-3 text-right">{report?.summary?.current?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{report?.summary?.days1to30?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{report?.summary?.days31to60?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{report?.summary?.days61to90?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{report?.summary?.over90?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{report?.summary?.total?.toLocaleString()}</td>
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
