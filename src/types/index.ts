
// User related types
export type Role = "admin" | "owner" | "checker" | "leader";
export type UserRole = Role; // Alias for backward compatibility

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
  
  // For backward compatibility
  createdAt?: string;
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
  
  // For backward compatibility
  created_by?: string;
  created_at?: string;
  num_workers?: number;
  total_distance?: number;
}

// Vehicle type definition
export type VehicleType = "truck" | "car" | "bike";

export interface Vehicle {
  id: string;
  vehicle_number: string;  // Required for backward compatibility
  manufacturer: string;
  model: string;
  vehicle_type: VehicleType;
  year_manufactured?: number;
  last_service_date?: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string;
  
  // For backward compatibility with database
  registration_number?: string;
  registrationNumber?: string;
  type?: string;
  vehicleType?: VehicleType;
  pollution_certificate?: any;
  pollutionCertificate?: any;
  fitness_certificate?: any;
  fitnessCertificate?: any;
  additional_details?: any;
  additionalDetails?: any;
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
  
  // For backward compatibility with database
  license_number?: string;
  contact_number?: string;
  vehicle_id?: string;
  assigned_project_id?: string;
  type?: string;
  created_at?: string;
}

// Progress related types
export type ProgressEntryStatus = "draft" | "submitted" | "approved" | "rejected" | "locked" | "correction-requested";

export interface ProgressEntry {
  id: string;
  projectId: string;
  date: string;
  distanceCompleted: number;
  timeSpent: number;
  workersPresent: number;
  notes?: string;
  photos?: string[] | any[] | Photo[];  // Updated to accept complex photo objects
  paymentRequests?: string[];
  status: ProgressEntryStatus;
  submittedBy?: string;
  submittedAt?: string;
  createdBy?: string;
  isLocked?: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  projectName?: string;  // Added for display purposes
  userName?: string;     // Added for display purposes
  vehicleUsed?: boolean | any; // Added for tracking vehicle usage
  correctionRequest?: { message: string; requestedBy: string; requestedAt: string };
  
  // For backward compatibility
  project_id?: string;
  distance_completed?: number;
  time_spent?: number;
  workers_present?: number;
  payment_requests?: string[];
  submitted_by?: string;
  submitted_at?: string;
  created_by?: string;
  is_locked?: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
  project_name?: string;
  user_name?: string;
  vehicle_used?: boolean | any;
  externalDriver?: string;
  vehicleId?: string;
  driverId?: string;
  meterReadings?: {
    start?: Photo;
    end?: Photo;
  };
}

// Photo interface for handling images with metadata
export interface Photo {
  id: string;
  url: string;
  metadata?: {
    timestamp: string;
    location?: GeoLocation;
  };
}

// Geolocation type
export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// Payment related types
export type PaymentRequestStatus = "pending" | "approved" | "rejected" | "paid" | "scheduled";

export type PaymentPurpose = 
  | "salary"
  | "equipment"
  | "materials"
  | "transport"
  | "maintenance"
  | "fuel"
  | "food"
  | "other"
  | "vehicle"  // Added for backward compatibility
  | "water"    // Added for backward compatibility
  | "labour";  // Added for backward compatibility

export interface PaymentRequest {
  id: string;
  projectId: string;
  amount: number;
  description: string;
  purpose: PaymentPurpose;  // Single purpose
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
  
  // Backward compatibility fields
  project_id?: string;
  purposes?: PaymentPurpose[];  
  purposeCosts?: Record<string, number>;
  purpose_costs?: Record<string, number>;
  photos?: Photo[] | any[];
  paymentDate?: string;
  payment_date?: string;
  requested_by?: string;
  requested_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  status_history?: {
    status: PaymentRequestStatus;
    changed_by: string;
    changed_at: string;
    comments?: string;
  }[];
  
  // Vehicle-related fields
  vehicle_used?: boolean;
  vehicleUsed?: boolean;
  vehicle_id?: string;
  vehicleId?: string;
  driver_id?: string;
  driverId?: string;
  meter_start_reading?: any;
  meterStartReading?: any;
  meter_end_reading?: any;
  meterEndReading?: any;
  
  // Additional fields from database
  scheduled_date?: string;
  scheduledDate?: string;
  paid_date?: string;
  paidDate?: string;
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
  
  // For backward compatibility
  user_id?: string;
  related_id?: string;
  is_read?: boolean;
  created_at?: string;
}

// Storage Metrics type
export interface StorageMetrics {
  id: string | number;  // Updated to accept string IDs
  total_size: number;
  used_size: number;
  percentage_used: number;
  last_updated: string;
  
  // For backward compatibility
  totalSize?: number;
  usedSize?: number;
  percentageUsed?: number;
  lastUpdated?: string;
}

// Backup Link type
export interface BackupLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  created_at?: string;
  created_by?: string;
  createdAt?: string;
  createdBy?: string;
}

// Define a JSON type for compatibility
export type Json = 
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];
