'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Truck,
  Ship,
  Warehouse,
  Container,
  DollarSign,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  MapPin,
  FileText,
  CreditCard,
  BarChart3,
  CheckCircle,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: any
}

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    name: 'HMS',
    href: '/hms',
    icon: Truck,
    submenu: [
      { name: 'Jobs', href: '/hms/jobs', icon: FileText },
      { name: 'Fleet', href: '/hms/fleet', icon: Truck },
      { name: 'Drivers', href: '/hms/drivers', icon: Users },
      { name: 'Tracking', href: '/hms/tracking', icon: MapPin },
    ],
  },
  {
    name: 'FFS',
    href: '/ffs',
    icon: Ship,
    submenu: [
      { name: 'Shipments', href: '/ffs/shipments', icon: FileText },
      { name: 'Bookings', href: '/ffs/bookings', icon: FileText },
      { name: 'Customs', href: '/ffs/customs', icon: FileText },
    ],
  },
  {
    name: 'WMS',
    href: '/wms',
    icon: Warehouse,
    submenu: [
      { name: 'Inventory', href: '/wms/inventory', icon: FileText },
      { name: 'Locations', href: '/wms/locations', icon: MapPin },
      { name: 'Movements', href: '/wms/movements', icon: FileText },
    ],
  },
  {
    name: 'TMS',
    href: '/tms',
    icon: Container,
    submenu: [
      { name: 'Yard', href: '/tms/yard', icon: MapPin },
      { name: 'Gate Pass', href: '/tms/gatepass', icon: FileText },
    ],
  },
  {
    name: 'FMS',
    href: '/fms',
    icon: DollarSign,
    submenu: [
      { name: 'Dashboard', href: '/fms', icon: LayoutDashboard },
      { name: 'Customers', href: '/fms/customers', icon: Users },
      { name: 'Vendors', href: '/fms/vendors', icon: Users },
      { name: 'Invoices', href: '/fms/invoices', icon: FileText },
      { name: 'Payments', href: '/fms/payments', icon: CreditCard },
      { name: 'Chart of Accounts', href: '/fms/chart-of-accounts', icon: BarChart3 },
      { name: 'Journal Entries', href: '/fms/journal-entries', icon: FileText },
      { name: 'Fixed Assets', href: '/fms/fixed-assets', icon: DollarSign },
      { name: 'e-Invoicing', href: '/fms/e-invoicing', icon: CheckCircle },
    ],
  },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['HMS'])
  const pathname = usePathname()

  const toggleMenu = (name: string) => {
    setExpandedMenus((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg">LogisticsPro</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-xl font-bold">LogisticsPro</h1>
            <p className="text-xs text-slate-400 mt-1">MMF Enterprise Suite</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              const isExpanded = expandedMenus.includes(item.name)

              return (
                <div key={item.name}>
                  <Link
                    href={item.submenu ? '#' : item.href}
                    onClick={() => item.submenu && toggleMenu(item.name)}
                    className={`flex items-center px-6 py-3 text-sm font-medium transition-colors
                      ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                  >
                    <Icon size={18} className="mr-3" />
                    <span className="flex-1">{item.name}</span>
                    {item.submenu && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    )}
                  </Link>

                  {/* Submenu */}
                  {item.submenu && isExpanded && (
                    <div className="bg-slate-800 py-2">
                      {item.submenu.map((sub) => {
                        const SubIcon = sub.icon
                        const isSubActive = pathname === sub.href
                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className={`flex items-center px-10 py-2 text-sm transition-colors
                              ${isSubActive ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                          >
                            <SubIcon size={14} className="mr-2" />
                            {sub.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-slate-400">{user.role}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
