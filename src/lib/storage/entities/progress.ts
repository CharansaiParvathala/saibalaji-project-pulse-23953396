
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
  const entries = getProgressEntries();
  entries.push(entry);
  saveToStorage(STORAGE_KEYS.PROGRESS_ENTRIES, entries);
  return entry;
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
