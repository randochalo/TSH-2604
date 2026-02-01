import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Plus, Search, Package, Filter, Barcode } from 'lucide-react'

async function getInventory() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/inventory`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export default async function InventoryPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const inventory = await getInventory()

  const statusColors: Record<string, string> = {
    AVAILABLE: 'bg-green-100 text-green-800',
    RESERVED: 'bg-yellow-100 text-yellow-800',
    QUARANTINE: 'bg-orange-100 text-orange-800',
    DAMAGED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-red-100 text-red-800',
    IN_TRANSIT: 'bg-blue-100 text-blue-800',
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
            <p className="text-gray-600">Manage stock levels and item tracking</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search SKU or description..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Warehouses</option>
          </select>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="QUARANTINE">Quarantine</option>
            <option value="DAMAGED">Damaged</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Barcode className="w-4 h-4 mr-2" />
            Scan
          </button>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Warehouse</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4">UOM</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item: any) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{item.sku}</td>
                    <td className="px-6 py-4">{item.description || '-'}</td>
                    <td className="px-6 py-4">{item.warehouse?.name || '-'}</td>
                    <td className="px-6 py-4">
                      {item.location ? (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {item.location.code}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold">{item.quantity}</td>
                    <td className="px-6 py-4">{item.uom}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/wms/inventory/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No inventory items found</p>
                    <p className="text-sm">Add items to get started</p>
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