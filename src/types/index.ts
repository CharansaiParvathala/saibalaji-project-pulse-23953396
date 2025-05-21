
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
  date: string;
  photos: Photo[];
  distanceCompleted: number;
  timeSpent: number;
  workersPresent: number;
  notes: string;
  status: string;
  createdBy: string;
  submittedBy?: string;
  submittedAt?: string;
  isLocked: boolean;
  paymentRequests?: string[];
  vehicleUsed?: {
    vehicleId: string;
    driverId: string;
    [key: string]: any;
  };
  userName?: string;
  projectName?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Payment request types
export type PaymentPurpose = "food" | "fuel" | "labour" | "vehicle" | "water" | "other";

export interface PaymentRequest {
  id: string;
  projectId: string;
  amount: number;
  description: string;
  purposes: PaymentPurpose[];
  purposeCosts: Record<PaymentPurpose, number>;
  photos: Photo[];
  status: "pending" | "approved" | "rejected" | "scheduled" | "paid";
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
  statusHistory?: PaymentStatusHistoryItem[];
  scheduledDate?: string;
  paidDate?: string;
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
