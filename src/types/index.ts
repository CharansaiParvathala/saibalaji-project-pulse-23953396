// User related types
export type Role = "admin" | "owner" | "checker";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

// Project related types
export type ProjectStatus = "active" | "completed" | "on_hold" | "planning";

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdBy: string;
  createdAt: string;
  numWorkers?: number;
  totalDistance?: number;
}

// Vehicle type definition
export type VehicleType = "truck" | "car" | "bike";

export interface Vehicle {
  id: string;
  vehicle_number: string;
  manufacturer: string;
  model: string;
  vehicle_type: VehicleType;
  year_manufactured?: number;
  last_service_date?: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

// Driver related types
export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  contactNumber: string;
  vehicleId?: string;
  assignedProjectId?: string;
  createdAt: string;
}

// Progress related types
export type ProgressEntryStatus = "draft" | "submitted" | "approved" | "rejected";

export interface ProgressEntry {
  id: string;
  projectId: string;
  date: string;
  distanceCompleted: number;
  timeSpent: number;
  workersPresent: number;
  notes?: string;
  photos?: string[];
  paymentRequests?: string[];
  status: ProgressEntryStatus;
  submittedBy?: string;
  submittedAt?: string;
  createdBy?: string;
  isLocked?: boolean;
}

// Payment related types
export type PaymentRequestStatus = "pending" | "approved" | "rejected" | "paid";

export type PaymentPurpose = 
  | "salary"
  | "equipment"
  | "materials"
  | "transport"
  | "maintenance"
  | "fuel"
  | "food"
  | "other";

export interface PaymentRequest {
  id: string;
  projectId: string;
  amount: number;
  description: string;
  purpose: PaymentPurpose;
  requestedBy: string;
  requestedAt: string;
  status: PaymentRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
  statusHistory?: {
    status: PaymentRequestStatus;
    changedBy: string;
    changedAt: string;
    comments?: string;
  }[];
}

// Notification related types
export type NotificationType = "payment_status" | "general";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

// Storage Metrics type
export interface StorageMetrics {
  id: number;
  total_size: number;
  used_size: number;
  percentage_used: number;
  last_updated: string;
}
