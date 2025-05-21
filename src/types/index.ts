
// User related types
export type Role = "admin" | "owner" | "checker" | "leader";
export type UserRole = Role; // Alias for backward compatibility

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
  vehicle_number: string;  // For backward compatibility
  manufacturer: string;
  model: string;
  vehicle_type: VehicleType;
  year_manufactured?: number;
  last_service_date?: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string;
  registration_number?: string;  // For backward compatibility
  
  // For backward compatibility with database
  registration_number?: string;
  type?: string;
  pollution_certificate?: any;
  fitness_certificate?: any;
  additional_details?: any;
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
  photos?: string[] | any[];  // Updated to accept complex photo objects
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
  correctionRequest?: { message: string; requestedBy: string; requestedAt: string };
}

// Photo interface for handling images with metadata
export interface Photo {
  id: string;
  url: string;
  metadata: {
    timestamp: string;
    location: GeoLocation;
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
  purposes?: PaymentPurpose[];  
  purposeCosts?: Record<string, number>;
  photos?: any[];
  paymentDate?: string;
  
  // Vehicle-related fields
  vehicle_used?: boolean;
  vehicle_id?: string;
  driver_id?: string;
  meter_start_reading?: any;
  meter_end_reading?: any;
  
  // Additional fields from database
  scheduled_date?: string;
  paid_date?: string;
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
  id: number | string;  // Updated to accept string IDs from Supabase
  total_size: number;
  used_size: number;
  percentage_used: number;
  last_updated: string;
  
  // For backward compatibility
  last_updated?: string;
  percentage_used?: number;
  total_size?: number;
  used_size?: number;
}

// Backup Link type
export interface BackupLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  created_at?: string;
  created_by?: string;
}
