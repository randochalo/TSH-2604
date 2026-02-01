'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { 
  Camera, QrCode, Scan, CheckCircle, XCircle, 
  Package, ArrowRight, RotateCcw, AlertTriangle
} from 'lucide-react'

interface BarcodeScannerProps {
  onScan?: (barcode: string) => void
  onClose?: () => void
  mode?: 'receive' | 'pick' | 'verify'
}

export function BarcodeScanner({ onScan, onClose, mode = 'receive' }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState<string | null>(null)
  const [scanHistory, setScanHistory] = useState<{ code: string; timestamp: Date; status: 'success' | 'error' }[]>([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Simulate scanning
  const simulateScan = () => {
    setIsScanning(true)
    setCameraActive(true)
    
    // Simulate scan delay
    setTimeout(() => {
      const mockBarcodes = [
        'SKU-ELE-00042',
        'SKU-AUT-00123',
        'SKU-TEX-00891',
        'CONT-MSCU1234567',
        'PALLET-A-0123',
      ]
      const scannedCode = mockBarcodes[Math.floor(Math.random() * mockBarcodes.length)]
      
      setLastScan(scannedCode)
      setScanHistory(prev => [{
        code: scannedCode,
        timestamp: new Date(),
        status: Math.random() > 0.2 ? 'success' : 'error'
      }, ...prev].slice(0, 10))
      
      setShowSuccess(true)
      setIsScanning(false)
      setCameraActive(false)
      onScan?.(scannedCode)
      
      setTimeout(() => setShowSuccess(false), 2000)
    }, 1500)
  }

  const getModeTitle = () => {
    switch (mode) {
      case 'receive': return 'Scan to Receive'
      case 'pick': return 'Scan to Pick'
      case 'verify': return 'Scan to Verify'
      default: return 'Scan Barcode'
    }
  }

  const getModeDescription = () => {
    switch (mode) {
      case 'receive': return 'Scan incoming items to update inventory'
      case 'pick': return 'Scan items for order picking'
      case 'verify': return 'Scan to verify item location'
      default: return 'Scan barcode to process'
    }
  }

  return (
    <div className="space-y-4">
      {/* Scanner Area */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg">{getModeTitle()}</h3>
            <p className="text-sm text-gray-500">{getModeDescription()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
            <span className="text-sm text-gray-500">
              {isScanning ? 'Scanning...' : cameraActive ? 'Camera Active' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Camera Viewfinder */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
            {cameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <Camera className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>Camera preview</p>
                </div>
              </div>
            )}
            
            {/* Scan Frame Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-64 h-64 border-2 rounded-lg ${
                isScanning ? 'border-green-400' : 'border-white/30'
              } relative`}>
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 -mt-1 -ml-1" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 -mt-1 -mr-1" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 -mb-1 -ml-1" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 -mb-1 -mr-1" />
                
                {/* Scan Line */}
                {isScanning && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-400 animate-[scan_2s_ease-in-out_infinite]" />
                )}
              </div>
            </div>

            {/* Success Overlay */}
            {showSuccess && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-xl animate-in zoom-in duration-200">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold text-center">Scanned!</p>
                  <p className="text-sm text-gray-500 text-center">{lastScan}</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <button
              onClick={simulateScan}
              disabled={isScanning}
              className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center disabled:opacity-50 hover:scale-105 transition-transform"
            >
              <QrCode className="w-8 h-8 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Or enter barcode manually..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = (e.target as HTMLInputElement).value
                if (value) {
                  setLastScan(value)
                  setScanHistory(prev => [{
                    code: value,
                    timestamp: new Date(),
                    status: 'success'
                  }, ...prev].slice(0, 10))
                  onScan?.(value)
                  ;(e.target as HTMLInputElement).value = ''
                }
              }
            }}
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Enter
          </button>
        </div>
      </Card>

      {/* Last Scan Result */}
      {lastScan && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="flex-1">
              <div className="text-sm text-green-700 font-medium">Last Scanned</div>
              <div className="text-lg font-bold text-green-900">{lastScan}</div>
            </div>
            <button 
              onClick={() => setLastScan(null)}
              className="p-2 hover:bg-green-100 rounded-lg"
            >
              <RotateCcw className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </Card>
      )}

      {/* Scan History */}
      <Card className="p-4">
        <h4 className="font-medium mb-3">Scan History ({scanHistory.length})</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {scanHistory.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No scans yet</p>
          ) : (
            scanHistory.map((scan, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {scan.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{scan.code}</div>
                    <div className="text-xs text-gray-500">
                      {scan.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  scan.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {scan.status === 'success' ? 'Success' : 'Error'}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}

// Scan Page Component
export default function BarcodeScanPage() {
  const [mode, setMode] = useState<'receive' | 'pick' | 'verify'>('receive')
  const [scanStats, setScanStats] = useState({ today: 142, pending: 23 })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Barcode Scanner</h1>
          <p className="text-gray-500">Scan items for warehouse operations</p>
        </div>
        <div className="flex gap-2">
          <Card className="px-4 py-2">
            <div className="text-sm text-gray-500">Today's Scans</div>
            <div className="text-xl font-bold">{scanStats.today}</div>
          </Card>
          <Card className="px-4 py-2">
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-xl font-bold">{scanStats.pending}</div>
          </Card>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-2">
        {[
          { id: 'receive', label: 'Receive', icon: Package },
          { id: 'pick', label: 'Pick', icon: ArrowRight },
          { id: 'verify', label: 'Verify', icon: CheckCircle },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === m.id
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <m.icon className="w-4 h-4" />
            {m.label}
          </button>
        ))}
      </div>

      {/* Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BarcodeScanner mode={mode} />
        </div>
        <div className="lg:col-span-1">
          <Card className="p-4 h-full">
            <h3 className="font-semibold mb-4">Scan Instructions</h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-medium text-blue-700">
                  1
                </div>
                <div>
                  <div className="font-medium">Position barcode</div>
                  <p className="text-gray-500">Align barcode within the scan frame</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-medium text-blue-700">
                  2
                </div>
                <div>
                  <div className="font-medium">Tap to scan</div>
                  <p className="text-gray-500">Press the camera button or wait for auto-scan</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-medium text-blue-700">
                  3
                </div>
                <div>
                  <div className="font-medium">Verify scan</div>
                  <p className="text-gray-500">Check the confirmation and continue</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <div className="font-medium">Tip</div>
                  <p>For best results, ensure good lighting and hold the device steady.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
