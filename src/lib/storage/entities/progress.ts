
import { ProgressEntry } from "@/types";
import { STORAGE_KEYS } from "../constants";
import { getFromStorage, saveToStorage } from "../utils";

// Progress Entries
export function getProgressEntries(): ProgressEntry[] {
  return getFromStorage<ProgressEntry>(STORAGE_KEYS.PROGRESS_ENTRIES);
}

export function getProgressEntry(id: string): ProgressEntry | undefined {
  const entries = getProgressEntries();
  return entries.find((entry) => entry.id === id);
}

export function saveProgressEntry(entry: ProgressEntry): ProgressEntry {
  // Ensure all required fields are present
  const completeEntry: ProgressEntry = {
    ...entry,
    photos: entry.photos || [],
    paymentRequests: entry.paymentRequests || [],
    status: entry.status || "draft",
    submittedBy: entry.submittedBy || entry.createdBy || "",
    submittedAt: entry.submittedAt || new Date().toISOString(),
    isLocked: entry.isLocked || false
  };
  
  const entries = getProgressEntries();
  entries.push(completeEntry);
  saveToStorage(STORAGE_KEYS.PROGRESS_ENTRIES, entries);
  return completeEntry;
}

export function updateProgressEntry(updatedEntry: ProgressEntry): ProgressEntry {
  const entries = getProgressEntries();
  const index = entries.findIndex((entry) => entry.id === updatedEntry.id);
  
  if (index !== -1) {
    entries[index] = updatedEntry;
    saveToStorage(STORAGE_KEYS.PROGRESS_ENTRIES, entries);
  }
  
  return updatedEntry;
}
