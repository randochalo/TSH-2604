// User Types
export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: UserRole
  permissions: string[]
  branchId: string
  isActive: boolean
  lastLogin?: Date
  mfaEnabled: boolean
}

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'BRANCH_ADMIN' 
  | 'MANAGER' 
  | 'SUPERVISOR' 
  | 'OPERATOR' 
  | 'READ_ONLY' 
  | 'DRIVER'

// Auth Types
export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
  mfaCode?: string
}

// HMS Types
export interface HaulageJob {
  id: string
  jobNo: string
  status: HaulageJobStatus
  vehicleId?: string
  driverId?: string
  trailerId?: string
  containerNo?: string
  containerSize?: string
  pickupLocation: string
  deliveryLocation: string
  customerId: string
  customerName?: string
  rate?: number
  currency: string
  createdAt: Date
  updatedAt: Date
}

export type HaulageJobStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'DISPATCHED'
  | 'AT_PICKUP'
  | 'LOADED'
  | 'IN_TRANSIT'
  | 'AT_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface Vehicle {
  id: string
  registrationNo: string
  type: VehicleType
  make?: string
  model?: string
  year?: number
  status: VehicleStatus
  currentBranchId: string
}

export type VehicleType = 'PRIME_MOVER' | 'LORRY' | 'VAN' | 'TRAILER_ONLY'
export type VehicleStatus = 'ACTIVE' | 'MAINTENANCE' | 'RETIRED' | 'SOLD'

export interface Driver {
  id: string
  userId: string
  licenseNo: string
  licenseClass: string[]
  licenseExpiry: Date
  employeeNo?: string
  rating: number
  totalJobs: number
  user?: {
    firstName: string
    lastName: string
    phone?: string
  }
}

// Dashboard Types
export interface DashboardStats {
  totalJobs: number
  activeJobs: number
  completedJobsToday: number
  pendingJobs: number
  totalVehicles: number
  activeVehicles: number
  totalDrivers: number
  availableDrivers: number
}

export interface RecentActivity {
  id: string
  type: string
  description: string
  user: string
  timestamp: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form Types
export interface CreateJobForm {
  pickupLocation: string
  pickupAddress?: string
  deliveryLocation: string
  deliveryAddress?: string
  customerId: string
  containerNo?: string
  containerSize?: string
  cargoDesc?: string
  weight?: number
  instructions?: string
  rate?: number
  currency?: string
}
