
import { PaymentRequest } from "@/types";
import { STORAGE_KEYS } from "../constants";
import { getFromStorage, saveToStorage } from "../utils";
import { saveNotification } from "./notifications";
import { generateId } from "../utils";

// Payment Requests
export function getPaymentRequests(): PaymentRequest[] {
  return getFromStorage<PaymentRequest>(STORAGE_KEYS.PAYMENT_REQUESTS);
}

export function getPaymentRequestsByStatus(status: PaymentRequest["status"]): PaymentRequest[] {
  const requests = getPaymentRequests();
  return requests.filter((request) => request.status === status);
}

export function savePaymentRequest(request: PaymentRequest): PaymentRequest {
  const requests = getPaymentRequests();
  
  // Ensure statusHistory exists
  if (!request.statusHistory) {
    request.statusHistory = [{
      status: request.status,
      changedBy: request.requestedBy,
      changedAt: request.requestedAt,
    }];
  }
  
  requests.push(request);
  saveToStorage(STORAGE_KEYS.PAYMENT_REQUESTS, requests);
  return request;
}

export function updatePaymentRequest(updatedRequest: PaymentRequest): PaymentRequest {
  const requests = getPaymentRequests();
  const index = requests.findIndex((request) => request.id === updatedRequest.id);
  
  if (index !== -1) {
    // Add status to history if it changed
    const oldRequest = requests[index];
    if (oldRequest.status !== updatedRequest.status) {
      if (!updatedRequest.statusHistory) {
        updatedRequest.statusHistory = [];
      }
      
      updatedRequest.statusHistory.push({
        status: updatedRequest.status,
        changedBy: updatedRequest.reviewedBy || "system",
        changedAt: new Date().toISOString(),
        comments: updatedRequest.comments,
      });
      
      // Create notification for payment requester
      const notification = {
        id: generateId(),
        userId: oldRequest.requestedBy,
        type: "payment_status" as const,
        title: `Payment Request ${updatedRequest.status.charAt(0).toUpperCase() + updatedRequest.status.slice(1)}`,
        message: `Your payment request of ₹${updatedRequest.amount.toFixed(2)} has been ${updatedRequest.status}`,
        relatedId: updatedRequest.id,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      
      saveNotification(notification);
    }
    
    requests[index] = updatedRequest;
    saveToStorage(STORAGE_KEYS.PAYMENT_REQUESTS, requests);
  }
  
  return updatedRequest;
}
