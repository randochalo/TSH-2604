'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { 
  FileText, Upload, CheckCircle, Clock, XCircle, 
  ArrowRight, Download, Paperclip, Send, AlertCircle 
} from 'lucide-react'

interface TenderWorkflow {
  id: string
  tenderRef: string
  customer: string
  description: string
  value: number
  submissionDeadline: Date
  status: 'draft' | 'review' | 'submitted' | 'under_review' | 'won' | 'lost'
  documents: { name: string; uploaded: boolean }[]
  assignedTo: string
  notes: string
}

const mockTenders: TenderWorkflow[] = [
  {
    id: 't1',
    tenderRef: 'TEND-2024-001',
    customer: 'ABC Logistics Sdn Bhd',
    description: 'Annual haulage contract for Port Klang operations',
    value: 500000,
    submissionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'draft',
    documents: [
      { name: 'Technical Proposal.pdf', uploaded: true },
      { name: 'Financial Proposal.xlsx', uploaded: false },
      { name: 'Company Profile.pdf', uploaded: true },
    ],
    assignedTo: 'John Manager',
    notes: 'Need to finalize pricing',
  },
  {
    id: 't2',
    tenderRef: 'TEND-2024-002',
    customer: 'Global Freight Services',
    description: 'Warehouse management services tender',
    value: 750000,
    submissionDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'review',
    documents: [
      { name: 'Technical Proposal.pdf', uploaded: true },
      { name: 'Financial Proposal.xlsx', uploaded: true },
      { name: 'References.pdf', uploaded: true },
    ],
    assignedTo: 'Sarah Supervisor',
    notes: 'Under internal review',
  },
  {
    id: 't3',
    tenderRef: 'TEND-2024-003',
    customer: 'Tech Solutions Inc',
    description: 'Cross-border logistics contract',
    value: 320000,
    submissionDeadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'submitted',
    documents: [
      { name: 'Complete Proposal.pdf', uploaded: true },
      { name: 'Annex A.pdf', uploaded: true },
    ],
    assignedTo: 'Ahmad Manager',
    notes: 'Submitted on time',
  },
  {
    id: 't4',
    tenderRef: 'TEND-2024-004',
    customer: 'Marina Bay Logistics',
    description: 'Freight forwarding services',
    value: 450000,
    submissionDeadline: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    status: 'won',
    documents: [
      { name: 'Winning Proposal.pdf', uploaded: true },
    ],
    assignedTo: 'David Lee',
    notes: 'Won the contract! Start date March 2024',
  },
  {
    id: 't5',
    tenderRef: 'TEND-2024-005',
    customer: 'Sunrise Trading Co',
    description: 'Container haulage services',
    value: 280000,
    submissionDeadline: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    status: 'lost',
    documents: [
      { name: 'Proposal.pdf', uploaded: true },
    ],
    assignedTo: 'John Manager',
    notes: 'Lost to competitor. Review pricing strategy.',
  },
]

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileText },
  review: { label: 'In Review', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  submitted: { label: 'Submitted', color: 'bg-blue-100 text-blue-700', icon: Send },
  under_review: { label: 'Under Customer Review', color: 'bg-purple-100 text-purple-700', icon: Clock },
  won: { label: 'Won', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-700', icon: XCircle },
}

const workflowSteps = [
  { id: 'draft', label: 'Draft', description: 'Prepare tender documents' },
  { id: 'review', label: 'Review', description: 'Internal review process' },
  { id: 'submitted', label: 'Submit', description: 'Submit to customer' },
  { id: 'under_review', label: 'Evaluation', description: 'Customer evaluation' },
  { id: 'won', label: 'Won/Lost', description: 'Final outcome' },
]

interface TenderWorkflowPageProps {
  params: { id: string }
}

export default function TenderWorkflowPage({ params }: TenderWorkflowPageProps) {
  const [tender, setTender] = useState<TenderWorkflow | null>(mockTenders[0])
  const [activeTab, setActiveTab] = useState<'workflow' | 'documents' | 'history'>('workflow')
  const [notes, setNotes] = useState(tender?.notes || '')

  if (!tender) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-gray-400">
          <FileText className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">Tender not found</p>
        </div>
      </div>
    )
  }

  const currentStatusConfig = statusConfig[tender.status]
  const StatusIcon = currentStatusConfig.icon

  const getStepStatus = (stepId: string) => {
    const stepIndex = workflowSteps.findIndex(s => s.id === stepId)
    const currentIndex = workflowSteps.findIndex(s => s.id === tender.status)
    
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  const progressPercent = ((workflowSteps.findIndex(s => s.id === tender.status) + 1) / workflowSteps.length) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{tender.tenderRef}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentStatusConfig.color}`}>
              <StatusIcon className="w-4 h-4 inline mr-1" />
              {currentStatusConfig.label}
            </span>
          </div>
          <p className="text-gray-600">{tender.customer}</p>
          <p className="text-sm text-gray-500 mt-1">{tender.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Download className="w-4 h-4 inline mr-1" />
            Export
          </button>
          {tender.status === 'draft' && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Send className="w-4 h-4 inline mr-1" />
              Submit for Review
            </button>
          )}
          {tender.status === 'review' && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Approve & Submit
            </button>
          )}
        </div>
      </div>

      {/* Key Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-500">Tender Value</div>
          <div className="text-xl font-bold">RM {tender.value.toLocaleString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Submission Deadline</div>
          <div className="text-xl font-bold">{tender.submissionDeadline.toLocaleDateString()}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Days Remaining</div>
          <div className={`text-xl font-bold ${
            tender.submissionDeadline < new Date() ? 'text-red-600' : 'text-green-600'
          }`}>
            {Math.max(0, Math.ceil((tender.submissionDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-500">Assigned To</div>
          <div className="text-xl font-bold">{tender.assignedTo}</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { id: 'workflow', label: 'Workflow', icon: ArrowRight },
            { id: 'documents', label: 'Documents', icon: Paperclip },
            { id: 'history', label: 'History', icon: Clock },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'workflow' && (
          <>
            {/* Progress Bar */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Workflow Progress</h3>
                <span className="text-sm text-gray-500">{Math.round(progressPercent)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Workflow Steps */}
              <div className="grid grid-cols-5 gap-4">
                {workflowSteps.map((step, index) => {
                  const stepStatus = getStepStatus(step.id)
                  return (
                    <div key={step.id} className="relative">
                      {/* Connector Line */}
                      {index < workflowSteps.length - 1 && (
                        <div className={`absolute top-4 left-1/2 w-full h-0.5 ${
                          stepStatus === 'completed' ? 'bg-blue-500' : 'bg-gray-200'
                        }`} />
                      )}
                      
                      <div className="relative flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          stepStatus === 'completed' ? 'bg-blue-500 text-white' :
                          stepStatus === 'current' ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                          'bg-gray-200 text-gray-500'
                        }`}>
                          {stepStatus === 'completed' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="mt-2 text-center">
                          <div className={`text-sm font-medium ${
                            stepStatus === 'current' ? 'text-blue-600' : 'text-gray-700'
                          }`}>
                            {step.label}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Available Actions</h3>
              <div className="flex flex-wrap gap-3">
                {tender.status === 'draft' && (
                  <>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      Submit for Internal Review
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                      Edit Tender
                    </button>
                  </>
                )}
                {tender.status === 'review' && (
                  <>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                      Approve & Submit
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
                      Reject & Return
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                      Request Changes
                    </button>
                  </>
                )}
                {tender.status === 'submitted' && (
                  <>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      Mark as Won
                    </button>
                    <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">
                      Mark as Lost
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                      Follow Up
                    </button>
                  </>
                )}
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  Add Note
                </button>
              </div>
            </Card>

            {/* Notes */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes about this tender..."
              />
              <div className="mt-3 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                  Save Notes
                </button>
              </div>
            </Card>
          </>
        )}

        {activeTab === 'documents' && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Required Documents</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>
            <div className="space-y-3">
              {tender.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-gray-400" />
                    <div>
                      <div className="font-medium">{doc.name}</div>
                      <div className="text-sm text-gray-500">
                        {doc.uploaded ? 'Uploaded on Jan 10, 2024' : 'Not uploaded yet'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.uploaded ? (
                      <>
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Uploaded
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button className="flex items-center gap-1 px-3 py-1.5 text-blue-600 border border-blue-300 rounded text-sm hover:bg-blue-50">
                        <Upload className="w-4 h-4" />
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'history' && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Activity History</h3>
            <div className="space-y-4">
              {[
                { date: 'Jan 15, 2024', time: '14:30', user: 'John Manager', action: 'Created tender', icon: FileText },
                { date: 'Jan 16, 2024', time: '09:15', user: 'Sarah Supervisor', action: 'Uploaded Technical Proposal.pdf', icon: Upload },
                { date: 'Jan 16, 2024', time: '11:45', user: 'John Manager', action: 'Added note: "Need to finalize pricing"', icon: AlertCircle },
                { date: 'Jan 17, 2024', time: '16:00', user: 'Sarah Supervisor', action: 'Uploaded Company Profile.pdf', icon: Upload },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    {index < 3 && <div className="w-0.5 h-full bg-gray-200 mt-2" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.action}</span>
                      <span className="text-sm text-gray-500">by {item.user}</span>
                    </div>
                    <div className="text-sm text-gray-400">
                      {item.date} at {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
