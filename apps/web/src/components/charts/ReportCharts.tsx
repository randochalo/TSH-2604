'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

interface ChartProps {
  data: any[]
  height?: number
}

// Revenue Trend Chart
export function RevenueTrendChart({ data, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value: number) => `RM ${value.toLocaleString()}`} />
        <Legend />
        <Area type="monotone" dataKey="revenue" stroke="#0088FE" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (RM)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Bar Chart for Comparisons
export function ComparisonBarChart({ data, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number) => `RM ${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="actual" fill="#0088FE" name="Actual" />
        <Bar dataKey="budget" fill="#82CA9D" name="Budget" />
        <Bar dataKey="variance" fill="#FF8042" name="Variance" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Pie Chart for Distribution
export function DistributionPieChart({ data, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `RM ${value.toLocaleString()}`} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Line Chart for Trends
export function TrendLineChart({ data, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="shipments" stroke="#0088FE" name="Shipments" />
        <Line type="monotone" dataKey="target" stroke="#82CA9D" name="Target" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Stacked Bar Chart
export function StackedBarChart({ data, height = 300 }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value: number) => `RM ${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="ar" stackId="a" fill="#0088FE" name="Accounts Receivable" />
        <Bar dataKey="ap" stackId="a" fill="#00C49F" name="Accounts Payable" />
        <Bar dataKey="expenses" stackId="a" fill="#FFBB28" name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// KPI Card Component
interface KPICardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
}

export function KPICard({ title, value, change, changeType = 'neutral', icon }: KPICardProps) {
  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
                {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {change}
              </p>
            )}
          </div>
          {icon && <div className="text-gray-400">{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
