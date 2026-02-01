'use client'

import { useState, useEffect } from 'react'
import { X, Info, Play, Sparkles } from 'lucide-react'

interface DemoModeProps {
  showBanner?: boolean
  showHints?: boolean
}

export function DemoMode({ showBanner = true, showHints = true }: DemoModeProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentHint, setCurrentHint] = useState(0)
  const [showTour, setShowTour] = useState(false)

  const hints = [
    "💡 Tip: Use Quick Actions on the dashboard to navigate faster",
    "💡 Tip: Click on any stat card to see detailed breakdown",
    "💡 Tip: All forms can be auto-filled with demo data",
    "💡 Tip: Try the credit control feature with customer 'CUST004' (blocked)",
    "💡 Tip: Check out the real-time yard visualization in TMS",
    "💡 Tip: Use the freight calculator to compare carrier rates",
  ]

  useEffect(() => {
    if (showHints) {
      const interval = setInterval(() => {
        setCurrentHint((prev) => (prev + 1) % hints.length)
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [showHints])

  if (!isVisible || !showBanner) return null

  return (
    <>
      {/* Demo Banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              <span className="font-bold">DEMO MODE</span>
            </div>
            <div className="hidden md:flex items-center text-sm text-purple-100">
              <span className="mr-4">|</span>
              <span>{hints[currentHint]}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowTour(true)}
              className="flex items-center px-3 py-1 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
            >
              <Play className="w-4 h-4 mr-1" />
              Start Tour
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Demo Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">🎯 LogisticsPro Demo Guide</h2>
                <button
                  onClick={() => setShowTour(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Quick Demo Flow (15-20 minutes)</h3>
                <p className="text-blue-700 text-sm">Follow this script for a smooth demo experience</p>
              </div>

              <div className="space-y-4">
                <DemoStep
                  number={1}
                  title="Login & Dashboard"
                  time="2 min"
                  description="Show role-based access. Point out real-time stats, notifications, and quick actions."
                  highlight="Click on Quick Actions to jump between modules"
                />
                <DemoStep
                  number={2}
                  title="HMS - Haulage Management"
                  time="3 min"
                  description="Create a job → Assign driver → Track on map. Show driver incentive calculation."
                  highlight="Try creating a job with blocked customer CUST004 to see credit control"
                />
                <DemoStep
                  number={3}
                  title="FFS - Freight Forwarding"
                  time="3 min"
                  description="Create shipment, add containers, show freight rates comparison."
                  highlight="Use the freight calculator to compare rates across carriers"
                />
                <DemoStep
                  number={4}
                  title="WMS - Warehouse Management"
                  time="3 min"
                  description="Show inventory, create pick list, demonstrate packing with cartonization."
                  highlight="Show the auto-cartonization feature"
                />
                <DemoStep
                  number={5}
                  title="TMS - Terminal Management"
                  time="2 min"
                  description="Yard view with color-coded containers, create gate pass."
                  highlight="Hover over containers to see details"
                />
                <DemoStep
                  number={6}
                  title="FMS - Finance Management"
                  time="4 min"
                  description="Create invoice (show credit check), submit e-invoice, view reports."
                  highlight="Credit control dashboard shows blocked customers"
                />
                <DemoStep
                  number={7}
                  title="Documents & Reports"
                  time="2 min"
                  description="Upload document, preview files, export reports with charts."
                  highlight="All reports have export to CSV/Excel functionality"
                />
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Demo Tips</h4>
                    <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                      <li>• All data is realistic but fictional - safe for demos</li>
                      <li>• Forms have pre-fill options for quick data entry</li>
                      <li>• Credit control is enforced - try creating invoices for blocked customers</li>
                      <li>• e-Invoicing shows IRBM integration workflow</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowTour(false)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Got it, let's start! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function DemoStep({ number, title, time, description, highlight }: {
  number: number
  title: string
  time: string
  description: string
  highlight: string
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{time}</span>
        </div>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        <p className="text-blue-600 text-sm mt-1">💡 {highlight}</p>
      </div>
    </div>
  )
}

// Quick Action Card Component
export function QuickActionCard({ title, description, icon: Icon, href, color = 'blue' }: {
  title: string
  description: string
  icon: any
  href: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal'
}) {
  const colors = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
  }

  return (
    <a
      href={href}
      className={`block bg-gradient-to-br ${colors[color]} rounded-xl p-6 text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
          <p className="text-white/80 text-sm mt-1">{description}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </a>
  )
}

// Demo Data Button Component
export function DemoDataButton({ onClick, label = 'Fill with Demo Data' }: {
  onClick: () => void
  label?: string
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
    >
      <Sparkles className="w-4 h-4 mr-2" />
      {label}
    </button>
  )
}
