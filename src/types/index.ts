
// User related types
export type UserRole = "leader" | "checker" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
}

// Project related types
export interface Project {
  id: string;
  name: string;
  status: string;
  created_by: string;
  created_at: string;
  num_workers: number;
  total_distance: number;
}

// Progress related types
export interface Photo {
  id: string;
  url: string;
  metadata: {
    timestamp: string;
    location: GeoLocation;
    [key: string]: any;
  };
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface ProgressEntry {
  id: string;
  projectId: string;
  project_id?: string; // Added for database compatibility
  date: string;
  photos: Photo[];
  distanceCompleted: number;
  distance_completed?: number; // Added for database compatibility
  timeSpent: number;
  time_spent?: number; // Added for database compatibility
  workersPresent: number;
  workers_present?: number; // Added for database compatibility
  notes: string;
  status: string;
  createdBy: string;
  created_by?: string; // Added for database compatibility
  submittedBy?: string;
  submitted_by?: string; // Added for database compatibility
  submittedAt?: string;
  submitted_at?: string; // Added for database compatibility
  isLocked: boolean;
  is_locked?: boolean; // Added for database compatibility
  paymentRequests?: string[];
  payment_requests?: string[]; // Added for database compatibility
  vehicleUsed?: {
    vehicleId: string;
    driverId: string;
    [key: string]: any;
  };
  vehicle_used?: {
    vehicleId: string;
    driverId: string;
    [key: string]: any;
  }; // Added for database compatibility
  userName?: string;
  user_name?: string; // Added for database compatibility
  projectName?: string;
  project_name?: string; // Added for database compatibility
  reviewedBy?: string;
  reviewed_by?: string; // Added for database compatibility
  reviewedAt?: string;
  reviewed_at?: string; // Added for database compatibility
}

// Payment request types
export type PaymentPurpose = "food" | "fuel" | "labour" | "vehicle" | "water" | "other";

export interface PaymentRequest {
  id: string;
  projectId: string;
  project_id?: string; // Added for database compatibility
  amount: number;
  description: string;
  purposes: PaymentPurpose[];
  purposeCosts: Record<PaymentPurpose, number>;
  purpose_costs?: Record<PaymentPurpose, number>; // Added for database compatibility
  photos: Photo[];
  status: "pending" | "approved" | "rejected" | "scheduled" | "paid";
  requestedBy: string;
  requested_by?: string; // Added for database compatibility
  requestedAt: string;
  requested_at?: string; // Added for database compatibility
  reviewedBy?: string;
  reviewed_by?: string; // Added for database compatibility
  reviewedAt?: string;
  reviewed_at?: string; // Added for database compatibility
  comments?: string;
  statusHistory?: PaymentStatusHistoryItem[];
  status_history?: PaymentStatusHistoryItem[]; // Added for database compatibility
  scheduledDate?: string;
  scheduled_date?: string; // Added for database compatibility
  paidDate?: string;
  paid_date?: string; // Added for database compatibility
  vehicle_used?: boolean;
  vehicle_id?: string;
  driver_id?: string;
  meter_start_reading?: Photo;
  meter_end_reading?: Photo;
}

export interface PaymentStatusHistoryItem {
  status: "pending" | "approved" | "rejected" | "scheduled" | "paid";
  changedBy: string;
  changedAt: string;
  comments?: string;
}

// Vehicle and driver types
export interface Vehicle {
  id: string;
  model: string;
  registration_number: string;
  type: string;
  pollution_certificate?: any;
  fitness_certificate?: any;
  additional_details?: any;
  created_at: string;
}

export interface Driver {
  id: string;
  name: string;
  license_number: string;
  type: string;
  created_at: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: "payment_status" | "progress_review" | "system" | "storage_warning";
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

// Backup links
export interface BackupLink {
  id: string;
  title: string;
  url: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

// Storage metrics
export interface StorageMetrics {
  id: string;
  total_size: number;
  used_size: number;
  percentage_used: number;
  last_updated: string;
}
