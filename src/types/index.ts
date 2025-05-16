
export interface User {
  id: string;
  name: string;
  email: string;
  role: "leader" | "checker" | "owner" | "admin";
  createdAt?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface Photo {
  id: string;
  url: string;
  metadata: {
    timestamp: string;
    location: GeoLocation;
  };
}

export interface Vehicle {
  id: string;
  model: string;
  registrationNumber: string;
  type: "truck" | "car" | "bike";
  pollutionCertificate?: {
    number: string;
    expiryDate: string;
  };
  fitnessCertificate?: {
    number: string;
    expiryDate: string;
  };
  additionalDetails?: Record<string, string>;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  type: "internal" | "external";
}

export interface MeterReading {
  id: string;
  vehicleId: string;
  reading: number;
  type: "start" | "end";
  photo: Photo;
}

export type PaymentPurpose = "food" | "fuel" | "labour" | "vehicle" | "water" | "other";
export type UserRole = "leader" | "checker" | "owner" | "admin";

export interface PaymentStatusHistoryEntry {
  status: PaymentRequest["status"];
  changedBy: string;
  changedAt: string;
  comments?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "payment_status" | "progress_update" | "general";
  title: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  numWorkers: number;
  createdBy: string;
  createdAt: string;
  status: "active" | "completed" | "on-hold";
  totalDistance?: number; // Total work distance in meters
}

export interface ProgressEntry {
  id: string;
  projectId: string;
  date: string;
  photos?: Photo[];
  vehicleUsed?: {
    vehicleId: string;
    driverId?: string;
    externalDriver?: {
      name: string;
      licenseNumber: string;
    };
    meterReadings?: {
      start: MeterReading;
      end: MeterReading;
    };
  };
  distanceCompleted?: number; // Distance completed in meters
  timeSpent?: number; // Time spent in hours
  workersPresent?: number; // Number of workers present
  notes?: string; // Additional notes
  paymentRequests?: string[];
  submittedBy?: string;
  submittedAt?: string;
  status?: "draft" | "submitted" | "approved" | "correction-requested" | "locked";
  isLocked?: boolean;
  correctionRequest?: {
    message: string;
    requestedAt: string;
    requestedBy: string;
  };
  createdBy?: string; // ID of the user who created this entry
  userName?: string; // Name of the user who created this entry
}

export interface PaymentRequest {
  id: string;
  projectId: string;
  amount: number;
  description: string;
  purposes: PaymentPurpose[];
  purposeCosts?: Record<PaymentPurpose, number>; // Store cost for each purpose
  photos: Photo[];
  status: "pending" | "approved" | "rejected" | "scheduled" | "paid";
  requestedBy: string;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
  statusHistory?: PaymentStatusHistoryEntry[];
  scheduledDate?: string;
  paidDate?: string;
}

