// Core User & Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  departmentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: RoleName;
  permissions: Permission[];
  description?: string;
}

export type RoleName = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'CEO'
  | 'MANAGER_INVENTORY'
  | 'MANAGER_SALES'
  | 'MANAGER_POS'
  | 'MANAGER_DELIVERY'
  | 'MANAGER_HR'
  | 'EMPLOYEE_INVENTORY'
  | 'EMPLOYEE_SALES'
  | 'EMPLOYEE_POS'
  | 'EMPLOYEE_DELIVERY'
  | 'EMPLOYEE_HR';

export interface Permission {
  id: string;
  resource: string;
  action: PermissionAction;
  description?: string;
}

export type PermissionAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'void'
  | 'export'
  | 'manage';

// Auth Tokens
export interface JwtPayload {
  sub: string; // user id
  email: string;
  roles: RoleName[];
  permissions: string[]; // formatted as "resource:action"
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string; // token id for rotation tracking
  iat: number;
  exp: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// API Response Envelope
export interface ApiResponse<T = any> {
  data?: T;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface ApiError {
  message: string | string[];
  statusCode: number;
  error?: string;
  timestamp?: string;
  path?: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Common Entities
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Department
export interface Department {
  id: string;
  name: string;
  code: string;
  managerId?: string;
  isActive: boolean;
}

// Inventory Types
export interface Product extends BaseEntity {
  name: string;
  sku: string;
  category: ProductCategory;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  unitOfMeasure: string;
  isActive: boolean;
}

export type ProductCategory = 
  | 'INGREDIENT'
  | 'FINISHED_GOOD'
  | 'PACKAGING'
  | 'EQUIPMENT';

export interface StockMovement extends BaseEntity {
  productId: string;
  quantity: number;
  movementType: StockMovementType;
  reason?: string;
  referenceId?: string; // order id, adjustment id, etc.
  performedBy: string;
}

export type StockMovementType = 
  | 'IN'
  | 'OUT'
  | 'ADJUSTMENT'
  | 'TRANSFER'
  | 'RETURN'
  | 'WASTE';

// POS Types
export interface Order extends BaseEntity {
  orderNumber: string;
  customerId?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paidAmount: number;
  createdBy: string;
  deliveredAt?: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export type OrderStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentMethod = 
  | 'CASH'
  | 'CARD'
  | 'DIGITAL_WALLET'
  | 'CREDIT';

// HR Types
export interface Employee extends BaseEntity {
  userId: string;
  employeeCode: string;
  position: string;
  departmentId: string;
  hireDate: Date;
  salary?: number;
  status: EmployeeStatus;
}

export type EmployeeStatus = 
  | 'ACTIVE'
  | 'ON_LEAVE'
  | 'TERMINATED'
  | 'PROBATION';

export interface Shift extends BaseEntity {
  employeeId: string;
  startTime: Date;
  endTime: Date;
  shiftType: ShiftType;
  status: ShiftStatus;
}

export type ShiftType = 'MORNING' | 'AFTERNOON' | 'NIGHT' | 'FLEXIBLE';
export type ShiftStatus = 'SCHEDULED' | 'COMPLETED' | 'MISSED' | 'CANCELLED';

// Delivery Types
export interface DeliveryRoute extends BaseEntity {
  routeName: string;
  driverId: string;
  orders: string[]; // order ids
  status: DeliveryStatus;
  scheduledDate: Date;
  completedAt?: Date;
}

export type DeliveryStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

// Dashboard Types
export interface DashboardMetrics {
  totalSales: number;
  todayOrders: number;
  lowStockItems: number;
  pendingDeliveries: number;
  activeEmployees: number;
  revenueChart: ChartDataPoint[];
}

export interface ChartDataPoint {
  label: string;
  value: number;
}
