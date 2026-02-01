import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Plus, Search, BarChart3, Filter, ChevronRight } from 'lucide-react'

async function getAccounts() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/accounts`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export default async function ChartOfAccountsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const accounts = await getAccounts()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount || 0)
  }

  const typeColors: Record<string, string> = {
    ASSET: 'bg-blue-100 text-blue-800',
    LIABILITY: 'bg-red-100 text-red-800',
    EQUITY: 'bg-purple-100 text-purple-800',
    REVENUE: 'bg-green-100 text-green-800',
    EXPENSE: 'bg-orange-100 text-orange-800',
  }

  const typeOrder = ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE']
  
  // Group accounts by type
  const groupedAccounts = accounts.reduce((acc: any, account: any) => {
    if (!acc[account.type]) acc[account.type] = []
    acc[account.type].push(account)
    return acc
  }, {})

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
            <p className="text-gray-600">General ledger account management</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </button>
        </div>

        {/* Account Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {typeOrder.map((type) => {
            const typeAccounts = groupedAccounts[type] || []
            const totalBalance = typeAccounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0)
            
            return (
              <div key={type} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type]}`}>
                    {type}
                  </span>
                  <span className="text-lg font-bold">{typeAccounts.length}</span>
                </div>
                <p className="text-xs text-gray-500">accounts</p>
                <p className="text-sm font-medium mt-1">{formatCurrency(totalBalance)}</p>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search account code or name..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value="ASSET">Asset</option>
            <option value="LIABILITY">Liability</option>
            <option value="EQUITY">Equity</option>
            <option value="REVENUE">Revenue</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Levels</option>
            <option value="1">Level 1 - Header</option>
            <option value="2">Level 2 - Group</option>
            <option value="3">Level 3 - Detail</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Accounts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Account Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Parent</th>
                <th className="px-6 py-4 text-right">Balance</th>
                <th className="px-6 py-4">Active</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length > 0 ? (
                accounts.map((account: any) => (
                  <tr key={account.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium">{account.code}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {account.level > 1 && (
                          <span className="inline-block w-4 mr-1">
                            {Array(account.level - 1).fill('  ').join('')}
                          </span>
                        )}
                        <span className={account.level === 1 ? 'font-semibold' : ''}>
                          {account.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[account.type] || 'bg-gray-100 text-gray-800'}`}>
                        {account.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Level {account.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {account.parent?.code || '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {formatCurrency(account.balance)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center w-2 h-2 rounded-full ${account.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className="sr-only">{account.isActive ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/fms/chart-of-accounts/${account.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                      >
                        View
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No accounts found</p>
                    <p className="text-sm">Add accounts to build your chart of accounts</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
