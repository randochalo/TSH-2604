import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Plus, Search, DollarSign, Filter, Calculator, Wrench, CheckCircle } from 'lucide-react'

async function getFixedAssets() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/fixed-assets`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export default async function FixedAssetsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const assets = await getFixedAssets()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format(amount || 0)
  }

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    UNDER_MAINTENANCE: 'bg-yellow-100 text-yellow-800',
    DISPOSED: 'bg-gray-100 text-gray-800',
    SOLD: 'bg-blue-100 text-blue-800',
    DEPRECIATED: 'bg-red-100 text-red-800',
  }

  const totalCost = assets.reduce((sum: number, a: any) => sum + (a.purchaseCost || 0), 0)
  const totalDepreciation = assets.reduce((sum: number, a: any) => sum + (a.accumulatedDepreciation || 0), 0)
  const totalNetBookValue = assets.reduce((sum: number, a: any) => sum + (a.netBookValue || 0), 0)

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fixed Assets</h1>
            <p className="text-gray-600">Asset register and depreciation management</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </button>
        </div>

        {/* Asset Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{assets.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(totalCost)}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accumulated Depreciation</p>
                <p className="text-2xl font-bold mt-1 text-orange-600">{formatCurrency(totalDepreciation)}</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-50">
                <Calculator className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Book Value</p>
                <p className="text-2xl font-bold mt-1 text-purple-600">{formatCurrency(totalNetBookValue)}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search asset name or number..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            <option value="DISPOSED">Disposed</option>
            <option value="SOLD">Sold</option>
            <option value="DEPRECIATED">Depreciated</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Categories</option>
            <option value="BUILDING">Building</option>
            <option value="MACHINERY">Machinery</option>
            <option value="VEHICLE">Vehicle</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="FURNITURE">Furniture</option>
            <option value="COMPUTER">Computer</option>
            <option value="OTHER">Other</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Assets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Asset No</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Purchase Date</th>
                <th className="px-6 py-4 text-right">Cost</th>
                <th className="px-6 py-4 text-right">Depreciation</th>
                <th className="px-6 py-4 text-right">Net Book Value</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.length > 0 ? (
                assets.map((asset: any) => (
                  <tr key={asset.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium">{asset.assetNo}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{asset.name}</p>
                        {asset.serialNumber && (
                          <p className="text-xs text-gray-500">S/N: {asset.serialNumber}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {asset.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(asset.purchaseDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(asset.purchaseCost)}</td>
                    <td className="px-6 py-4 text-right">
                      <div>
                        <p className="font-medium text-orange-600">{formatCurrency(asset.accumulatedDepreciation)}</p>
                        <p className="text-xs text-gray-500">{asset.depreciationMethod}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">{formatCurrency(asset.netBookValue)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[asset.status] || 'bg-gray-100 text-gray-800'}`}>
                        {asset.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          View
                        </button>
                        {asset.status === 'ACTIVE' && (
                          <button 
                            className="text-orange-600 hover:text-orange-800"
                            title="Run Depreciation"
                          >
                            <Calculator className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No fixed assets found</p>
                    <p className="text-sm">Add assets to your register to get started</p>
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
