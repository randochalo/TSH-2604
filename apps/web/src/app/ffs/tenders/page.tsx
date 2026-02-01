import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Target,
  Award,
  Calendar,
  DollarSign,
  Search
} from 'lucide-react'
import Link from 'next/link'

async function getTenderData() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/tenders`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function TenderManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const data = await getTenderData()

  const stats = {
    totalSubmitted: 24,
    totalWon: 8,
    totalLost: 12,
    pending: 4,
    winRate: 33.3,
    totalValue: 12500000,
  }

  const tenders = [
    { id: 'T-2026-001', title: 'Port Klang Container Haulage', client: 'Westport Malaysia', value: 2500000, submitted: '2026-01-15', status: 'WON', closing: '2026-02-28' },
    { id: 'T-2026-002', title: 'Warehouse Management Services', client: 'TechGear Sdn Bhd', value: 1200000, submitted: '2026-01-20', status: 'PENDING', closing: '2026-03-15' },
    { id: 'T-2026-003', title: 'Freight Forwarding - APAC', client: 'Global Trade Inc', value: 3500000, submitted: '2026-01-25', status: 'PENDING', closing: '2026-03-30' },
    { id: 'T-2026-004', title: 'Terminal Operations', client: 'Northport', value: 1800000, submitted: '2025-12-10', status: 'LOST', closing: '2026-01-31' },
    { id: 'T-2026-005', title: 'Customs Clearance Services', client: 'ImportEx Ltd', value: 800000, submitted: '2026-02-01', status: 'WON', closing: '2026-02-28' },
  ]

  const statusColors: Record<string, string> = {
    WON: 'bg-green-100 text-green-800',
    LOST: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ffs" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tender Management</h1>
              <p className="text-gray-600">Track tender submissions and analyze win/loss rates</p>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Tender
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Submitted</div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalSubmitted}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Win Rate</div>
              <div className="text-3xl font-bold text-green-600">{stats.winRate}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Won</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalWon}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm text-gray-600">Total Value</div>
              <div className="text-3xl font-bold text-orange-600">RM {(stats.totalValue / 1000000).toFixed(1)}M</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tender List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Tenders
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tenders..."
                    className="pl-10 pr-4 py-2 border rounded-lg text-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tenders.map((tender) => (
                    <div key={tender.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{tender.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[tender.status]}`}>
                              {tender.status}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mt-1">{tender.title}</h4>
                          <p className="text-sm text-gray-600">{tender.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">RM {(tender.value / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-gray-500">Submitted: {tender.submitted}</p>
                          <p className="text-xs text-gray-500">Closing: {tender.closing}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Win/Loss Analysis */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Win/Loss Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Won</span>
                    </div>
                    <span className="font-bold">{stats.totalWon} ({((stats.totalWon / stats.totalSubmitted) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(stats.totalWon / stats.totalSubmitted) * 100}%` }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span>Lost</span>
                    </div>
                    <span className="font-bold">{stats.totalLost} ({((stats.totalLost / stats.totalSubmitted) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.totalLost / stats.totalSubmitted) * 100}%` }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>Pending</span>
                    </div>
                    <span className="font-bold">{stats.pending} ({((stats.pending / stats.totalSubmitted) * 100).toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(stats.pending / stats.totalSubmitted) * 100}%` }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Performance by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Haulage</span>
                    <span className="text-sm font-medium text-green-700">60% Win Rate</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="text-sm">Forwarding</span>
                    <span className="text-sm font-medium text-yellow-700">25% Win Rate</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm">Warehouse</span>
                    <span className="text-sm font-medium text-blue-700">40% Win Rate</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                    <span className="text-sm">Terminal</span>
                    <span className="text-sm font-medium text-purple-700">20% Win Rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Historical Rates Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Historical Freight Rate Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-gray-50 text-gray-700">
                    <th className="px-4 py-3 font-medium">Route</th>
                    <th className="px-4 py-3 font-medium">Container Type</th>
                    <th className="px-4 py-3 font-medium text-right">Our Rate</th>
                    <th className="px-4 py-3 font-medium text-right">Market Avg</th>
                    <th className="px-4 py-3 font-medium text-right">Lowest Bid</th>
                    <th className="px-4 py-3 font-medium text-center">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Port Klang → Singapore</td>
                    <td className="px-4 py-3">20' GP</td>
                    <td className="px-4 py-3 text-right">RM 850</td>
                    <td className="px-4 py-3 text-right">RM 900</td>
                    <td className="px-4 py-3 text-right text-red-600">RM 820</td>
                    <td className="px-4 py-3 text-center">2026-02-01</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Port Klang → Singapore</td>
                    <td className="px-4 py-3">40' GP</td>
                    <td className="px-4 py-3 text-right">RM 1,200</td>
                    <td className="px-4 py-3 text-right">RM 1,250</td>
                    <td className="px-4 py-3 text-right text-red-600">RM 1,150</td>
                    <td className="px-4 py-3 text-center">2026-02-01</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Port Klang → Penang</td>
                    <td className="px-4 py-3">20' GP</td>
                    <td className="px-4 py-3 text-right">RM 650</td>
                    <td className="px-4 py-3 text-right">RM 700</td>
                    <td className="px-4 py-3 text-right text-red-600">RM 620</td>
                    <td className="px-4 py-3 text-center">2026-01-28</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">Johor → Port Klang</td>
                    <td className="px-4 py-3">40' HQ</td>
                    <td className="px-4 py-3 text-right">RM 1,450</td>
                    <td className="px-4 py-3 text-right">RM 1,500</td>
                    <td className="px-4 py-3 text-right text-red-600">RM 1,380</td>
                    <td className="px-4 py-3 text-center">2026-01-25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
