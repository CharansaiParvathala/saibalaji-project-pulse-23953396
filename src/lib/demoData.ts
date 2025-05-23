
import { generateId } from "./storage";
import { Project, ProgressEntry, PaymentRequest, User, Vehicle, Driver, PaymentPurpose } from "@/types";

// Generate demo data for statistics and testing
export const generateDemoData = () => {
  // Check if demo data already exists
  const existingProjects = localStorage.getItem("sai-balaji-projects");
  const existingEntries = localStorage.getItem("sai-balaji-progress-entries");
  const existingPayments = localStorage.getItem("sai-balaji-payment-requests");
  
  if (existingProjects && existingEntries && existingPayments) {
    console.log("Demo data already exists");
    return;
  }
  
  console.log("Generating demo data...");
  
  // Demo projects
  const projects: Project[] = [
    {
      id: "proj1",
      name: "Highway Extension",
      numWorkers: 25,
      createdBy: "user1",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      status: "active",
      totalDistance: 10000
    },
    {
      id: "proj2",
      name: "Bridge Construction",
      numWorkers: 40,
      createdBy: "user2",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      status: "active",
      totalDistance: 5000
    },
    {
      id: "proj3",
      name: "Road Maintenance",
      numWorkers: 15,
      createdBy: "user3",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
      status: "completed",
      totalDistance: 8000
    }
  ];
  
  // Demo users
  const users: User[] = [
    {
      id: "user1",
      name: "Rajesh Leader",
      email: "leader@example.com",
      role: "leader",
      created_at: new Date().toISOString()
    },
    {
      id: "user2",
      name: "Priya Checker",
      email: "checker@example.com",
      role: "checker",
      created_at: new Date().toISOString()
    },
    {
      id: "user3",
      name: "Vijay Owner",
      email: "owner@example.com",
      role: "owner",
      created_at: new Date().toISOString()
    },
    {
      id: "user4",
      name: "Anil Admin",
      email: "admin@example.com",
      role: "admin",
      created_at: new Date().toISOString()
    }
  ];
  
  // Demo vehicles
  const vehicles: Vehicle[] = [
    {
      id: "veh1",
      model: "Tata Truck 407",
      registration_number: "MH02 AB1234",
      vehicle_type: "truck",
      manufacturer: "Tata",
      vehicle_number: "T407",
      is_active: true,
      created_at: new Date().toISOString(),
      created_by: "user1",
      pollution_certificate: {
        number: "POL123456",
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
      fitness_certificate: {
        number: "FIT789012",
        expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      }
    },
    {
      id: "veh2",
      model: "JCB Excavator",
      registration_number: "MH04 CD5678",
      vehicle_type: "truck",
      manufacturer: "JCB",
      vehicle_number: "EX200",
      is_active: true,
      created_at: new Date().toISOString(),
      created_by: "user1",
      pollution_certificate: {
        number: "POL789012",
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      fitness_certificate: {
        number: "FIT345678",
        expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      }
    }
  ];
  
  // Generate demo progress entries for the last 14 days
  const progressEntries: ProgressEntry[] = [];
  const paymentRequests: PaymentRequest[] = [];
  
  // Helper to generate a random number between min and max
  const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  // Generate data for the last 14 days
  for (let i = 0; i < 14; i++) {
    // Each project gets some random progress entries
    projects.forEach(project => {
      // Not every project has entries every day
      if (Math.random() > 0.3) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        // Create progress entry
        const entryId = generateId();
        const entry: ProgressEntry = {
          id: entryId,
          projectId: project.id,
          date: date.toISOString(),
          photos: [
            {
              id: generateId(),
              url: "https://picsum.photos/seed/" + Math.random() + "/200/300",
              metadata: {
                timestamp: date.toISOString(),
                location: { latitude: 19.076 + Math.random() * 0.1, longitude: 72.877 + Math.random() * 0.1, accuracy: 10 }
              }
            }
          ],
          paymentRequests: [],
          submittedBy: users[randomBetween(0, users.length - 1)].id,
          submittedAt: date.toISOString(),
          status: Math.random() > 0.7 ? "submitted" : "locked",
          isLocked: Math.random() > 0.7,
          distanceCompleted: randomBetween(100, 500),
          timeSpent: randomBetween(2, 8),
          workersPresent: randomBetween(5, 20),
          notes: "Progress note for day " + i,
          createdBy: users[randomBetween(0, users.length - 1)].id
        };
        
        // Add some payment requests associated with this entry
        if (Math.random() > 0.5) {
          const purposeOptions: PaymentPurpose[] = ["food", "fuel", "labour", "vehicle", "water", "other"];
          
          const numPayments = randomBetween(1, 3);
          for (let j = 0; j < numPayments; j++) {
            // Randomize some attributes
            const requestedDate = new Date(date);
            requestedDate.setHours(randomBetween(8, 17));
            
            const purposesList: PaymentPurpose[] = [];
            const purposeCosts: Record<PaymentPurpose, number> = {} as Record<PaymentPurpose, number>;
            
            const numPurposes = randomBetween(1, 3);
            for (let k = 0; k < numPurposes; k++) {
              const purpose = purposeOptions[randomBetween(0, purposeOptions.length - 1)] as PaymentPurpose;
              purposesList.push(purpose);
              purposeCosts[purpose] = randomBetween(500, 2000);
            }
            
            const paymentId = generateId();
            const paymentStatus: PaymentRequestStatus = Math.random() > 0.6 ? "pending" : 
                                 Math.random() > 0.5 ? "approved" : 
                                 Math.random() > 0.5 ? "rejected" : 
                                 Math.random() > 0.5 ? "scheduled" : "paid";
            
            const payment: PaymentRequest = {
              id: paymentId,
              projectId: project.id,
              purpose: purposesList[0], // Set primary purpose for compatibility
              purposes: Array.from(new Set(purposesList)), // Remove duplicates
              purposeCosts: purposeCosts,
              amount: Math.floor(Math.random() * 10000) + 500,
              description: `Payment for ${purposesList.join(", ")}`,
              photos: [
                {
                  id: generateId(),
                  url: "https://picsum.photos/seed/" + Math.random() + "/200/300",
                  metadata: {
                    timestamp: requestedDate.toISOString(),
                    location: { latitude: 19.076 + Math.random() * 0.1, longitude: 72.877 + Math.random() * 0.1, accuracy: 10 }
                  }
                }
              ],
              status: paymentStatus,
              requestedBy: entry.submittedBy || users[0].id,
              requestedAt: requestedDate.toISOString(),
              reviewedBy: paymentStatus !== "pending" ? users[randomBetween(0, users.length - 1)].id : undefined,
              reviewedAt: paymentStatus !== "pending" ? new Date(requestedDate.getTime() + randomBetween(1, 48) * 60 * 60 * 1000).toISOString() : undefined,
              comments: paymentStatus === "rejected" ? "Insufficient documentation provided" : undefined,
              statusHistory: [{
                status: "pending",
                changedBy: entry.submittedBy || users[0].id,
                changedAt: requestedDate.toISOString(),
              }]
            };
            
            // Add status history based on current status
            if (paymentStatus !== "pending") {
              payment.statusHistory!.push({
                status: paymentStatus,
                changedBy: payment.reviewedBy || "system",
                changedAt: payment.reviewedAt || new Date().toISOString(),
                comments: payment.comments
              });
            }
            
            paymentRequests.push(payment);
            entry.paymentRequests!.push(paymentId);
          }
        }
        
        progressEntries.push(entry);
      }
    });
  }
  
  // Save demo data to localStorage
  localStorage.setItem("sai-balaji-projects", JSON.stringify(projects));
  localStorage.setItem("sai-balaji-users", JSON.stringify(users));
  localStorage.setItem("sai-balaji-vehicles", JSON.stringify(vehicles));
  localStorage.setItem("sai-balaji-progress-entries", JSON.stringify(progressEntries));
  localStorage.setItem("sai-balaji-payment-requests", JSON.stringify(paymentRequests));
  
  console.log("Demo data generated successfully");
  return {
    projects,
    users,
    vehicles,
    progressEntries,
    paymentRequests
  };
};
