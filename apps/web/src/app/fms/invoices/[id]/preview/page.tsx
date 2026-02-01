'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft,
  Download,
  Printer,
  Send,
  FileText,
  CheckCircle,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  Hash,
  FileCheck,
  X
} from 'lucide-react'

interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  taxAmount: number
  amount: number
  sku?: string
}

interface Invoice {
  id: string
  invoiceNo: string
  type: string
  status: string
  invoiceDate: string
  dueDate: string
  total: number
  subtotal: number
  taxAmount: number
  balance: number
  currency: string
  eInvoiceStatus: string | null
  eInvoiceUuid: string | null
  customer?: {
    name: string
    code: string
    tin?: string
    registrationNo?: string
    address?: string
    email?: string
    phone?: string
  }
  vendor?: {
    name: string
    code: string
  }
  items: InvoiceItem[]
}

export default function InvoicePreviewPage() {
  const params = useParams()
  const invoiceId = params.id as string
  
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [showIRBMModal, setShowIRBMModal] = useState(false)

  useEffect(() => {
    fetchInvoice()
  }, [invoiceId])

  async function fetchInvoice() {
    try {
      const res = await fetch(`/api/invoices/${invoiceId}`)
      if (res.ok) {
        const data = await res.json()
        setInvoice(data)
      }
    } catch (error) {
      console.error('Error fetching invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'MYR') => {
    return new Intl.NumberFormat('en-MY', { style: 'currency', currency }).format(amount || 0)
  }

  const handleSubmitToIRBM = () => {
    setShowIRBMModal(true)
    // Simulate IRBM submission
    setTimeout(() => {
      setShowIRBMModal(false)
      fetchInvoice()
    }, 3000)
  }

  if (loading) {
    return (
      <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (!invoice) {
    return (
      <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Invoice not found</h2>
          <Link href="/fms/invoices" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Back to Invoices
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const party = invoice.type === 'AR' ? invoice.customer : invoice.vendor
  const isOverdue = invoice.dueDate && new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID'

  return (
    <DashboardLayout user={{ name: 'Admin', firstName: 'A', lastName: 'D', role: 'Admin' }}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/fms/invoices/${invoiceId}`} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">e-Invoice Preview</h1>
              <p className="text-gray-600">IRBM MyInvois-compliant e-Invoice format</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </button>
            {!invoice.eInvoiceStatus && invoice.type === 'AR' && (
              <button 
                onClick={handleSubmitToIRBM}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit to IRBM
              </button>
            )}
          </div>
        </div>

        {/* e-Invoice Document */}
        <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
          {/* e-Invoice Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FileCheck className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">e-Invoice (MyInvois)</h2>
                  <p className="text-sm text-blue-100">Malaysian Inland Revenue Board</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Document Type</p>
                <p className="font-semibold">INVOICE</p>
                <p className="text-sm text-blue-100 mt-1">Version 1.0</p>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {invoice.eInvoiceStatus && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-100">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">
                    Validated by LHDN Malaysia (IRBM)
                  </p>
                  <p className="text-sm text-green-600">
                    UUID: {invoice.eInvoiceUuid} | Validated: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Invoice Info Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Supplier Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Supplier</h3>
                <div className="space-y-1">
                  <p className="font-bold text-lg">MMF Logistics Sdn Bhd</p>
                  <p className="text-gray-600">TIN: C2584563202</p>
                  <p className="text-gray-600">Reg No: 202301012345 (1438355-A)</p>
                  <p className="text-gray-600">No. 1, Jalan Pelabuhan Utara</p>
                  <p className="text-gray-600">Port Klang Free Zone</p>
                  <p className="text-gray-600">42000 Port Klang, Selangor</p>
                  <p className="text-gray-600">Email: finance@mmf.com.my</p>
                </div>
              </div>

              {/* Buyer Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Buyer</h3>
                <div className="space-y-1">
                  <p className="font-bold text-lg">{party?.name}</p>
                  {party?.tin && <p className="text-gray-600">TIN: {party.tin}</p>}
                  {party?.registrationNo && <p className="text-gray-600">Reg No: {party.registrationNo}</p>}
                  {party?.address && (
                    <>
                      <p className="text-gray-600">{party.address}</p>
                    </>
                  )}
                  {party?.email && <p className="text-gray-600">Email: {party.email}</p>}
                  {party?.phone && <p className="text-gray-600">Phone: {party.phone}</p>}
                </div>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Invoice Number</p>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="font-mono font-medium">{invoice.invoiceNo}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Issue Date</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{new Date(invoice.invoiceDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Due Date</p>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={`font-medium ${isOverdue ? 'text-red-600' : ''}`}>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Currency</p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{invoice.currency || 'MYR'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Line Items</h3>
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Unit Price</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{item.description}</p>
                        {item.sku && <p className="text-xs text-gray-500">{item.sku}</p>}
                      </td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.taxAmount, invoice.currency)}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.amount, invoice.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(invoice.subtotal, invoice.currency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (SST)</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount, invoice.currency)}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-lg text-blue-600">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </span>
                  </div>
                </div>
                {invoice.balance > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Balance Due</span>
                    <span className="font-medium text-orange-600">{formatCurrency(invoice.balance, invoice.currency)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tax Summary (IRBM Required) */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Tax Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Tax Type</p>
                  <p className="font-medium">Sales and Service Tax (SST)</p>
                </div>
                <div>
                  <p className="text-gray-500">Tax Rate</p>
                  <p className="font-medium">6%</p>
                </div>
                <div>
                  <p className="text-gray-500">Tax Amount</p>
                  <p className="font-medium">{formatCurrency(invoice.taxAmount, invoice.currency)}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center text-sm text-gray-500">
              <p>This is a computer-generated e-Invoice and is valid without signature.</p>
              <p className="mt-1">Generated by LogisticsPro FMS - IRBM MyInvois Compliant</p>
              {invoice.eInvoiceStatus && (
                <p className="mt-2 text-green-600 font-medium">
                  ✓ Validated and registered with LHDN Malaysia
                </p>
              )}
            </div>
          </div>
        </div>

        {/* IRBM Submission Modal */}
        {showIRBMModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Submitting to IRBM</h3>
              <p className="text-gray-600 mb-4">
                Validating e-Invoice with LHDN MyInvois platform...
              </p>
              <div className="space-y-2 text-sm text-left bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Validating TIN numbers...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Checking invoice format...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Generating UUID...</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
