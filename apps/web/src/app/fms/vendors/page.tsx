import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { Plus, Search, Users, Filter, Building2 } from 'lucide-react'

async function getVendors() {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/vendors`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    return res.json()
  } catch (error) {
    return []
  }
}

export default async function VendorsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const vendors = await getVendors()

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-600">Manage supplier and vendor accounts</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or code..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">All Types</option>
            <option value="SUPPLIER">Supplier</option>
            <option value="SERVICE">Service Provider</option>
            <option value="TRANSPORTER">Transporter</option>
            <option value="OTHER">Other</option>
          </select>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Vendors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Vendor Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Open Bills</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length > 0 ? (
                vendors.map((vendor: any) => (
                  <tr key={vendor.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{vendor.code}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{vendor.name}</p>
                        <p className="text-xs text-gray-500">{vendor.registrationNo || '-'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {vendor.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{vendor.contactPerson || '-'}</p>
                        <p className="text-xs text-gray-500">{vendor.email || '-'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.branch?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{vendor._count?.bills || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>No vendors found</p>
                    <p className="text-sm">Add vendors to get started</p>
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
