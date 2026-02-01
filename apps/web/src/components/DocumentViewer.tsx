'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { 
  FileText, X, Download, CheckCircle, Clock, AlertCircle,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Printer, FileCheck
} from 'lucide-react'

interface Document {
  id: string
  name: string
  type: 'BL' | 'AWB' | 'CO' | 'PL' | 'CI' | 'OTHER'
  size: string
  uploadedAt: Date
  uploadedBy: string
  status: 'pending' | 'approved' | 'rejected'
  url: string
}

interface DocumentViewerProps {
  documents: Document[]
  onClose: () => void
  initialDocumentId?: string
}

const documentTypeLabels: Record<string, string> = {
  BL: 'Bill of Lading',
  AWB: 'Air Waybill',
  CO: 'Certificate of Origin',
  PL: 'Packing List',
  CI: 'Commercial Invoice',
  OTHER: 'Other Document',
}

const mockDocuments: Document[] = [
  {
    id: 'doc1',
    name: 'BOL_MAERSK_001.pdf',
    type: 'BL',
    size: '1.2 MB',
    uploadedAt: new Date(2024, 0, 15),
    uploadedBy: 'John Manager',
    status: 'approved',
    url: '#',
  },
  {
    id: 'doc2',
    name: 'Commercial_Invoice_001.pdf',
    type: 'CI',
    size: '856 KB',
    uploadedAt: new Date(2024, 0, 15),
    uploadedBy: 'Sarah Operator',
    status: 'approved',
    url: '#',
  },
  {
    id: 'doc3',
    name: 'Packing_List_001.pdf',
    type: 'PL',
    size: '423 KB',
    uploadedAt: new Date(2024, 0, 16),
    uploadedBy: 'Ahmad Supervisor',
    status: 'pending',
    url: '#',
  },
  {
    id: 'doc4',
    name: 'Certificate_of_Origin.pdf',
    type: 'CO',
    size: '2.1 MB',
    uploadedAt: new Date(2024, 0, 14),
    uploadedBy: 'David Lee',
    status: 'pending',
    url: '#',
  },
]

// Mock PDF content component
function MockPdfViewer({ document }: { document: Document }) {
  const [zoom, setZoom] = useState(100)
  
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setZoom(z => Math.max(50, z - 10))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-16 text-center">{zoom}%</span>
          <button 
            onClick={() => setZoom(z => Math.min(200, z + 10))}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Printer className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto p-8">
        <div 
          className="bg-white shadow-lg mx-auto transition-transform origin-top"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            transform: `scale(${zoom / 100})`,
          }}
        >
          {/* Mock PDF Page */}
          <div className="p-12">
            {/* Header */}
            <div className="flex justify-between items-start mb-8 border-b pb-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">LOGISTICS PRO</div>
                <div className="text-sm text-gray-500">Document ID: {document.id.toUpperCase()}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{documentTypeLabels[document.type]}</div>
                <div className="text-sm text-gray-500">
                  Uploaded: {document.uploadedAt.toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Document Content */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Shipper</div>
                  <div className="font-medium">ABC Logistics Sdn Bhd</div>
                  <div className="text-sm text-gray-600">
                    Lot 123, Port Klang Industrial Zone<br />
                    42000 Klang, Selangor<br />
                    Malaysia
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Consignee</div>
                  <div className="font-medium">Global Freight Services</div>
                  <div className="text-sm text-gray-600">
                    456 Shipping Lane<br />
                    Rotterdam 3011 AA<br />
                    Netherlands
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500">Document No</div>
                    <div className="font-medium">DOC-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Date</div>
                    <div className="font-medium">{document.uploadedAt.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Reference</div>
                    <div className="font-medium">REF-2024-001</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Status</div>
                    <div className={`font-medium ${
                      document.status === 'approved' ? 'text-green-600' :
                      document.status === 'rejected' ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Content */}
              <div className="border rounded-lg overflow-hidden mt-6">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-4 border-b">Description</th>
                      <th className="text-right py-2 px-4 border-b">Quantity</th>
                      <th className="text-right py-2 px-4 border-b">Unit</th>
                      <th className="text-right py-2 px-4 border-b">Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b">Electronic Components</td>
                      <td className="text-right py-2 px-4 border-b">500</td>
                      <td className="text-right py-2 px-4 border-b">CTNS</td>
                      <td className="text-right py-2 px-4 border-b">2,500.00</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Automotive Parts</td>
                      <td className="text-right py-2 px-4 border-b">200</td>
                      <td className="text-right py-2 px-4 border-b">PLTS</td>
                      <td className="text-right py-2 px-4 border-b">8,500.00</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Textile Products</td>
                      <td className="text-right py-2 px-4 border-b">1,000</td>
                      <td className="text-right py-2 px-4 border-b">CTNS</td>
                      <td className="text-right py-2 px-4 border-b">3,200.00</td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="text-right py-2 px-4 font-medium">Total Weight:</td>
                      <td className="text-right py-2 px-4 font-bold">14,200.00 kg</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 mt-8">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Authorized Signature</div>
                    <div className="h-16 border-b border-gray-300" />
                    <div className="text-sm text-gray-600 mt-1">John Manager - Operations</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Date & Stamp</div>
                    <div className="h-16 border border-gray-300 rounded flex items-center justify-center text-gray-400">
                      OFFICIAL STAMP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DocumentViewer({ 
  documents = mockDocuments, 
  onClose,
  initialDocumentId 
}: DocumentViewerProps) {
  const [selectedDocId, setSelectedDocId] = useState(initialDocumentId || documents[0]?.id)
  const selectedDocument = documents.find(d => d.id === selectedDocId)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BL': return '📄'
      case 'AWB': return '✈️'
      case 'CO': return '📜'
      case 'PL': return '📦'
      case 'CI': return '💰'
      default: return '📎'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative z-10 flex w-full h-full max-w-7xl mx-auto my-8 bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Documents ({documents.length})</h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document List */}
          <div className="flex-1 overflow-y-auto">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`w-full p-4 text-left border-b transition-colors ${
                  selectedDocId === doc.id 
                    ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                    : 'hover:bg-gray-100 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getTypeIcon(doc.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{doc.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {documentTypeLabels[doc.type]} • {doc.size}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusIcon(doc.status)}
                      <span className="text-xs text-gray-500">
                        {doc.uploadedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="p-4 border-t bg-white space-y-2">
            {selectedDocument?.status === 'pending' && (
              <>
                <button className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  Approve Document
                </button>
                <button className="w-full py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center justify-center gap-2">
                  <X className="w-4 h-4" />
                  Reject Document
                </button>
              </>
            )}
            <button className="w-full py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedDocument ? (
            <>
              {/* Document Header */}
              <div className="p-4 border-b bg-white flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{selectedDocument.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>{documentTypeLabels[selectedDocument.type]}</span>
                    <span>•</span>
                    <span>{selectedDocument.size}</span>
                    <span>•</span>
                    <span>Uploaded by {selectedDocument.uploadedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedDocument.status === 'approved' ? 'bg-green-100 text-green-700' :
                    selectedDocument.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {selectedDocument.status.charAt(0).toUpperCase() + selectedDocument.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 overflow-hidden">
                <MockPdfViewer document={selectedDocument} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Select a document to view</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentViewer
