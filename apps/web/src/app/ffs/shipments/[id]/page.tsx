import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { ArrowLeft, Ship, Package, FileText, Clock } from 'lucide-react'

async function getShipment(id: string) {
  try {
    const res = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/shipments/${id}`, {
      cache: 'no-store',
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  const shipment = await getShipment(params.id)

  if (!shipment) {
    return (
      <DashboardLayout user={session.user}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Shipment Not Found</h2>
          <p className="text-gray-600 mt-2">The shipment you are looking for does not exist.</p>
          <Link
            href="/ffs/shipments"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shipments
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const statusColors: Record<string, string> = {
    BOOKED: 'bg-gray-100 text-gray-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
    ARRIVED: 'bg-purple-100 text-purple-800',
    CUSTOMS_HOLD: 'bg-red-100 text-red-800',
    CLEARED: 'bg-green-100 text-green-800',
    DELIVERED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }

  return (
    <DashboardLayout user={session.user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/ffs/shipments"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900">{shipment.shipmentNo}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[shipment.status]}`}>
                  {shipment.status}
                </span>
              </div>
              <p className="text-gray-600">Shipment details and tracking information</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Edit
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Update Status
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipment Details */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Shipment Details</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Booking No</label>
                  <p className="mt-1 text-gray-900">{shipment.bookingNo || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Transport Mode</label>
                  <p className="mt-1 text-gray-900">{shipment.mode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">BL/AWB No</label>
                  <p className="mt-1 text-gray-900">{shipment.blNo || shipment.awbNo || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Shipment Type</label>
                  <p className="mt-1 text-gray-900">{shipment.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Vessel/Flight</label>
                  <p className="mt-1 text-gray-900">{shipment.vesselName || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Voyage No</label>
                  <p className="mt-1 text-gray-900">{shipment.voyageNo || '-'}</p>
                </div>
              </div>
            </div>

            {/* Route Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Route Information</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{shipment.origin}</p>
                    <p className="text-sm text-gray-500">Origin</p>
                    {shipment.pol && <p className="text-xs text-gray-400">{shipment.pol}</p>}
                  </div>
                  <div className="flex-1 px-8">
                    <div className="relative">
                      <div className="border-t-2 border-gray-300 absolute w-full top-1/2"></div>
                      <div className="relative flex justify-center">
                        <Ship className="w-8 h-8 text-blue-600 bg-white px-2" />
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-xs text-gray-500">
                        ETD: {shipment.etd ? new Date(shipment.etd).toLocaleDateString() : 'TBD'}
                      </p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{shipment.destination}</p>
                    <p className="text-sm text-gray-500">Destination</p>
                    {shipment.pod && <p className="text-xs text-gray-400">{shipment.pod}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Cargo Details */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Cargo Details</h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">Description</label>
                  <p className="mt-1 text-gray-900">{shipment.cargoDesc}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Packages</label>
                  <p className="mt-1 text-gray-900">
                    {shipment.packages || 0} {shipment.packageType || 'units'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gross Weight</label>
                  <p className="mt-1 text-gray-900">{shipment.grossWeight || 0} kg</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Volume</label>
                  <p className="mt-1 text-gray-900">{shipment.volume || 0} CBM</p>
                </div>
              </div>
            </div>

            {/* Containers */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Containers</h2>
              </div>
              <div className="p-6">
                {shipment.containers && shipment.containers.length > 0 ? (
                  <div className="space-y-3">
                    {shipment.containers.map((container: any) => (
                      <div key={container.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Package className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{container.containerNo}</p>
                            <p className="text-sm text-gray-500">
                              {container.size} {container.type && `• ${container.type}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {container.sealNo && (
                            <p className="text-sm text-gray-600">Seal: {container.sealNo}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No containers assigned</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Parties */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Parties</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Shipper</label>
                  <p className="mt-1 font-medium text-gray-900">{shipment.shipper?.name || '-'}</p>
                  <p className="text-sm text-gray-500">{shipment.shipper?.address || ''}</p>
                </div>
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-gray-600">Consignee</label>
                  <p className="mt-1 font-medium text-gray-900">{shipment.consignee?.name || '-'}</p>
                  <p className="text-sm text-gray-500">{shipment.consignee?.address || ''}</p>
                </div>
                {shipment.notifyParty && (
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-gray-600">Notify Party</label>
                    <p className="mt-1 font-medium text-gray-900">{shipment.notifyParty.name}</p>
                  </div>
                )}
                {shipment.carrier && (
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-gray-600">Carrier</label>
                    <p className="mt-1 font-medium text-gray-900">{shipment.carrier.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Timeline</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shipment Created</p>
                      <p className="text-xs text-gray-500">
                        {new Date(shipment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Last Updated</p>
                      <p className="text-xs text-gray-500">
                        {new Date(shipment.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
              </div>
              <div className="p-6">
                {shipment.documents && shipment.documents.length > 0 ? (
                  <div className="space-y-2">
                    {shipment.documents.map((doc: any) => (
                      <div key={doc.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{doc.originalName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No documents attached</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}