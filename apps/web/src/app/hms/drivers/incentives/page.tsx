'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { DollarSign, TrendingUp, Award, Calendar, Download, ChevronDown, ChevronUp } from 'lucide-react'

interface Driver {
  id: string
  name: string
  employeeNo: string
  totalJobs: number
  rating: number
  performance: {
    onTimeDelivery: number
    safetyScore: number
    fuelEfficiency: number
    customerRating: number
  }
}

interface IncentiveCalculation {
  baseAmount: number
  performanceBonus: number
  safetyBonus: number
  fuelBonus: number
  customerBonus: number
  totalAmount: number
  formula: string
}

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Ahmad Bin Abdullah',
    employeeNo: 'EMP0001',
    totalJobs: 45,
    rating: 4.8,
    performance: { onTimeDelivery: 95, safetyScore: 98, fuelEfficiency: 88, customerRating: 4.9 }
  },
  {
    id: 'd2',
    name: 'John Smith',
    employeeNo: 'EMP0002',
    totalJobs: 38,
    rating: 4.5,
    performance: { onTimeDelivery: 88, safetyScore: 92, fuelEfficiency: 85, customerRating: 4.6 }
  },
  {
    id: 'd3',
    name: 'Mohammad Hassan',
    employeeNo: 'EMP0003',
    totalJobs: 52,
    rating: 4.9,
    performance: { onTimeDelivery: 98, safetyScore: 99, fuelEfficiency: 91, customerRating: 4.8 }
  },
  {
    id: 'd4',
    name: 'David Lee',
    employeeNo: 'EMP0004',
    totalJobs: 41,
    rating: 4.3,
    performance: { onTimeDelivery: 85, safetyScore: 88, fuelEfficiency: 82, customerRating: 4.4 }
  },
  {
    id: 'd5',
    name: 'Kamaruddin Ibrahim',
    employeeNo: 'EMP0005',
    totalJobs: 48,
    rating: 4.7,
    performance: { onTimeDelivery: 92, safetyScore: 96, fuelEfficiency: 87, customerRating: 4.7 }
  },
]

// Incentive calculation formula
function calculateIncentive(driver: Driver, baseRate: number = 800): IncentiveCalculation {
  // Base amount per job completed
  const baseAmount = driver.totalJobs * (baseRate / 10)
  
  // Performance bonus based on on-time delivery
  const performanceBonus = driver.performance.onTimeDelivery >= 95 
    ? baseAmount * 0.15 
    : driver.performance.onTimeDelivery >= 90 
      ? baseAmount * 0.10 
      : baseAmount * 0.05

  // Safety bonus
  const safetyBonus = driver.performance.safetyScore >= 95 
    ? baseAmount * 0.10 
    : driver.performance.safetyScore >= 90 
      ? baseAmount * 0.05 
      : 0

  // Fuel efficiency bonus
  const fuelBonus = driver.performance.fuelEfficiency >= 90 
    ? baseAmount * 0.08 
    : driver.performance.fuelEfficiency >= 85 
      ? baseAmount * 0.04 
      : 0

  // Customer rating bonus
  const customerBonus = driver.performance.customerRating >= 4.8 
    ? baseAmount * 0.07 
    : driver.performance.customerRating >= 4.5 
      ? baseAmount * 0.04 
      : 0

  return {
    baseAmount: Math.round(baseAmount),
    performanceBonus: Math.round(performanceBonus),
    safetyBonus: Math.round(safetyBonus),
    fuelBonus: Math.round(fuelBonus),
    customerBonus: Math.round(customerBonus),
    totalAmount: Math.round(baseAmount + performanceBonus + safetyBonus + fuelBonus + customerBonus),
    formula: `Base: RM${Math.round(baseRate)}/10 jobs + Performance bonuses`
  }
}

export default function DriverIncentivesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01')
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null)
  const [baseRate, setBaseRate] = useState(800)

  const totalIncentives = mockDrivers.reduce((sum, driver) => 
    sum + calculateIncentive(driver, baseRate).totalAmount, 0
  )

  const avgIncentive = totalIncentives / mockDrivers.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Incentives</h1>
          <p className="text-gray-500">Performance-based incentive calculator</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2024-01">January 2024</option>
            <option value="2024-02">February 2024</option>
            <option value="2024-03">March 2024</option>
            <option value="2023-12">December 2023</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">RM {totalIncentives.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Incentives</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">RM {Math.round(avgIncentive).toLocaleString()}</div>
              <div className="text-xs text-gray-500">Average per Driver</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{mockDrivers.length}</div>
              <div className="text-xs text-gray-500">Active Drivers</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold">{mockDrivers.reduce((sum, d) => sum + d.totalJobs, 0)}</div>
              <div className="text-xs text-gray-500">Total Jobs</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Base Incentive Rate:</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">RM</span>
            <input
              type="number"
              value={baseRate}
              onChange={(e) => setBaseRate(Number(e.target.value))}
              className="w-24 px-3 py-1 border border-gray-300 rounded text-sm"
              min="500"
              max="1500"
              step="50"
            />
            <span className="text-gray-500 text-sm">per 10 jobs</span>
          </div>
        </div>
      </Card>

      {/* Incentive Calculator */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Incentive Breakdown</h2>
        <div className="space-y-4">
          {mockDrivers.map((driver) => {
            const incentive = calculateIncentive(driver, baseRate)
            const isExpanded = expandedDriver === driver.id

            return (
              <div 
                key={driver.id} 
                className="border rounded-lg overflow-hidden"
              >
                {/* Summary Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedDriver(isExpanded ? null : driver.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-medium text-blue-700">
                      {driver.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{driver.name}</div>
                      <div className="text-sm text-gray-500">{driver.employeeNo} • {driver.totalJobs} jobs • Rating: {driver.rating}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        RM {incentive.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">Total Incentive</div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Performance Metrics */}
                      <div>
                        <h4 className="font-medium mb-3">Performance Metrics</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>On-Time Delivery</span>
                              <span className="font-medium">{driver.performance.onTimeDelivery}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${driver.performance.onTimeDelivery}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Safety Score</span>
                              <span className="font-medium">{driver.performance.safetyScore}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${driver.performance.safetyScore}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Fuel Efficiency</span>
                              <span className="font-medium">{driver.performance.fuelEfficiency}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${driver.performance.fuelEfficiency}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Customer Rating</span>
                              <span className="font-medium">{driver.performance.customerRating}/5.0</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${(driver.performance.customerRating / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Incentive Breakdown */}
                      <div>
                        <h4 className="font-medium mb-3">Incentive Breakdown</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Base Amount</span>
                            <span className="font-medium">RM {incentive.baseAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Performance Bonus</span>
                            <span className="font-medium text-green-600">+RM {incentive.performanceBonus.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Safety Bonus</span>
                            <span className="font-medium text-green-600">+RM {incentive.safetyBonus.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Fuel Efficiency Bonus</span>
                            <span className="font-medium text-green-600">+RM {incentive.fuelBonus.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Customer Rating Bonus</span>
                            <span className="font-medium text-green-600">+RM {incentive.customerBonus.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-2 bg-blue-50 px-2 rounded">
                            <span className="font-medium">Total Incentive</span>
                            <span className="font-bold text-blue-600">RM {incentive.totalAmount.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Formula: {incentive.formula}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Monthly Summary Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Monthly Incentive Trends</h2>
        <div className="h-64 flex items-end justify-around gap-2">
          {['Oct', 'Nov', 'Dec', 'Jan'].map((month, i) => {
            const values = [42000, 45600, 48200, totalIncentives]
            const maxValue = 60000
            const height = (values[i] / maxValue) * 100
            
            return (
              <div key={month} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className="w-full max-w-20 bg-blue-500 rounded-t-lg transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
                <span className="text-sm text-gray-600">{month}</span>
                <span className="text-xs text-gray-400">RM {(values[i] / 1000).toFixed(0)}k</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
