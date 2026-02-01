'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Calculator, TrendingUp, DollarSign, Ship, Plane, Truck, Train, ArrowRight, Search } from 'lucide-react'

interface RateResult {
  carrier: string
  route: string
  baseRate: number
  fuelSurcharge: number
  otherCharges: number
  total: number
  transitTime: string
  currency: string
}

const carriers = [
  { id: 'maersk', name: 'Maersk Line', type: 'sea' },
  { id: 'msc', name: 'MSC Malaysia', type: 'sea' },
  { id: 'cma', name: 'CMA CGM', type: 'sea' },
  { id: 'cosco', name: 'COSCO Shipping', type: 'sea' },
  { id: 'one', name: 'Ocean Network Express', type: 'sea' },
  { id: 'mas', name: 'Malaysia Airlines', type: 'air' },
  { id: 'sg', name: 'Singapore Airlines', type: 'air' },
  { id: 'dhl', name: 'DHL Express', type: 'air' },
]

const ports = [
  'Port Klang', 'Singapore', 'Hong Kong', 'Shanghai', 'Ningbo', 'Shenzhen', 
  'Kaohsiung', 'Busan', 'Tokyo', 'Rotterdam', 'Hamburg', 'Felixstowe', 
  'Los Angeles', 'New York', 'Dubai'
]

const containerTypes = [
  { code: '20GP', name: '20\' General Purpose', teu: 1 },
  { code: '40GP', name: '40\' General Purpose', teu: 2 },
  { code: '40HC', name: '40\' High Cube', teu: 2 },
  { code: '45HC', name: '45\' High Cube', teu: 2.25 },
  { code: '20RF', name: '20\' Reefer', teu: 1 },
  { code: '40RF', name: '40\' Reefer', teu: 2 },
]

export default function RateCalculatorPage() {
  const [origin, setOrigin] = useState('Port Klang')
  const [destination, setDestination] = useState('Rotterdam')
  const [containerType, setContainerType] = useState('40HC')
  const [cargoWeight, setCargoWeight] = useState(20000)
  const [cargoVolume, setCargoVolume] = useState(65)
  const [transportMode, setTransportMode] = useState<'sea' | 'air'>('sea')
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState<RateResult[] | null>(null)

  const handleCalculate = () => {
    setIsCalculating(true)
    
    // Simulate calculation delay
    setTimeout(() => {
      const selectedContainer = containerTypes.find(c => c.code === containerType)
      const teu = selectedContainer?.teu || 1
      
      // Generate mock rate results
      const mockResults: RateResult[] = carriers
        .filter(c => c.type === transportMode)
        .map(carrier => {
          const baseRate = transportMode === 'sea' 
            ? (800 + Math.random() * 400) * teu 
            : (3.5 + Math.random() * 2) * cargoWeight
          const fuelSurcharge = baseRate * 0.15
          const otherCharges = transportMode === 'sea' ? 250 : 150
          
          return {
            carrier: carrier.name,
            route: `${origin} → ${destination}`,
            baseRate: Math.round(baseRate),
            fuelSurcharge: Math.round(fuelSurcharge),
            otherCharges,
            total: Math.round(baseRate + fuelSurcharge + otherCharges),
            transitTime: transportMode === 'sea' 
              ? `${18 + Math.floor(Math.random() * 10)} days`
              : `${1 + Math.floor(Math.random() * 2)} days`,
            currency: transportMode === 'sea' ? 'USD' : 'MYR',
          }
        })
        .sort((a, b) => a.total - b.total)
      
      setResults(mockResults)
      setIsCalculating(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Freight Rate Calculator</h1>
          <p className="text-gray-500">Compare shipping rates across carriers and routes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Form */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Rate Parameters</h2>
            </div>

            <div className="space-y-4">
              {/* Transport Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transport Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setTransportMode('sea')}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      transportMode === 'sea'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Ship className="w-4 h-4" />
                    Sea Freight
                  </button>
                  <button
                    onClick={() => setTransportMode('air')}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      transportMode === 'air'
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Plane className="w-4 h-4" />
                    Air Freight
                  </button>
                </div>
              </div>

              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origin
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ports.map(port => (
                    <option key={port} value={port}>{port}</option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ports.filter(p => p !== origin).map(port => (
                    <option key={port} value={port}>{port}</option>
                  ))}
                </select>
              </div>

              {/* Container Type (for sea) */}
              {transportMode === 'sea' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Container Type
                  </label>
                  <select
                    value={containerType}
                    onChange={(e) => setContainerType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {containerTypes.map(type => (
                      <option key={type.code} value={type.code}>
                        {type.name} ({type.teu} TEU)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Cargo Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo Weight (kg)
                </label>
                <input
                  type="number"
                  value={cargoWeight}
                  onChange={(e) => setCargoWeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="100"
                />
              </div>

              {/* Cargo Volume */}
              {transportMode === 'sea' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo Volume (CBM)
                  </label>
                  <input
                    type="number"
                    value={cargoVolume}
                    onChange={(e) => setCargoVolume(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                </div>
              )}

              {/* Calculate Button */}
              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Get Rates
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Rate Comparison</h2>
            </div>

            {!results ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <Calculator className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Enter parameters and click "Get Rates"</p>
                <p className="text-sm">Compare freight rates from multiple carriers</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Route Summary */}
                <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{origin}</span>
                    <ArrowRight className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">{destination}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {transportMode === 'sea' ? containerType : cargoWeight.toLocaleString() + ' kg'}
                  </div>
                </div>

                {/* Rate Cards */}
                {results.map((result, index) => (
                  <div 
                    key={result.carrier}
                    className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                      index === 0 ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {index === 0 && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded">
                            BEST RATE
                          </span>
                        )}
                        <span className="font-semibold text-gray-900">{result.carrier}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {result.currency} {result.total.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Transit: {result.transitTime}
                        </div>
                      </div>
                    </div>

                    {/* Rate Breakdown */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Base Rate</div>
                          <div className="font-medium">{result.currency} {result.baseRate.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Fuel Surcharge</div>
                          <div className="font-medium">{result.currency} {result.fuelSurcharge.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Other Charges</div>
                          <div className="font-medium">{result.currency} {result.otherCharges.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Historical Rates Chart Placeholder */}
                <div className="mt-6">
                  <h3 className="font-medium mb-3">Historical Rate Trends</h3>
                  <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-around p-4">
                    {['Oct', 'Nov', 'Dec', 'Jan'].map((month, i) => {
                      const baseValue = results[0]?.total || 1000
                      const heights = [0.9, 0.95, 1.0, 0.92]
                      return (
                        <div key={month} className="flex flex-col items-center gap-2 flex-1">
                          <div 
                            className="w-12 bg-blue-500 rounded-t transition-all duration-500"
                            style={{ height: `${heights[i] * 60}%` }}
                          />
                          <span className="text-xs text-gray-600">{month}</span>
                          <span className="text-xs text-gray-400">
                            {Math.round(baseValue * heights[i]).toLocaleString()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
