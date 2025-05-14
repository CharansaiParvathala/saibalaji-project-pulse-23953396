
export type UserRole = "leader" | "checker" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  model: string;
  registrationNumber: string;
  pollutionCertificate: {
    number: string;
    expiryDate: string;
  };
  fitnessCertificate: {
    number: string;
    expiryDate: string;
  };
  additionalDetails?: Record<string, string>;
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseType: string;
  experienceYears: number;
  additionalDetails?: Record<string, string>;
}

export interface Project {
  id: string;
  name: string;
  numWorkers: number;
  createdBy: string; // user ID
  createdAt: string;
  status: "active" | "completed" | "cancelled";
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface PhotoMetadata {
  timestamp: string;
  location: GeoLocation;
}

export interface Photo {
  id: string;
  url: string;
  metadata: PhotoMetadata;
}

export interface MeterReading {
  id: string;
  vehicleId: string;
  reading: number;
  type: "start" | "end";
  photo: Photo;
}

export type PaymentPurpose = "food" | "fuel" | "labour" | "vehicle" | "water" | "other";

export interface PaymentRequest {
  id: string;
  projectId: string;
  purposes: PaymentPurpose[];
  amount: number;
  description: string;
  photos: Photo[];
  status: "pending" | "approved" | "rejected" | "paid" | "scheduled";
  requestedBy: string; // user ID
  requestedAt: string;
  reviewedBy?: string; // user ID
  reviewedAt?: string;
  comments?: string;
  paymentDate?: string;
  statusHistory?: {
    status: "pending" | "approved" | "rejected" | "paid" | "scheduled";
    changedBy: string; // user ID
    changedAt: string;
    comments?: string;
  }[];
}

export interface ProgressEntry {
  id: string;
  projectId: string;
  date: string;
  photos: Photo[];
  vehicleUsed?: {
    vehicleId: string;
    driverId?: string;
    externalDriver?: {
      name: string;
      licenseNumber: string;
    };
    meterReadings: {
      start: MeterReading;
      end: MeterReading;
    };
  };
  paymentRequests: string[]; // Changed from PaymentRequest[] to string[] to store IDs
  submittedBy: string; // user ID
  submittedAt: string;
  status: "draft" | "submitted" | "locked" | "correction-requested";
  correctionRequest?: {
    message: string;
    requestedAt: string;
    requestedBy: string; // user ID
  };
  isLocked: boolean;
}

// New interface for notifications
export interface Notification {
  id: string;
  userId: string; // recipient
  type: "payment_status" | "progress_status" | "correction_request";
  title: string;
  message: string;
  relatedId: string; // ID of the related entity (payment, progress, etc.)
  isRead: boolean;
  createdAt: string;
}
