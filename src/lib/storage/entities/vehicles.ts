
import { Vehicle } from "@/types";
import { STORAGE_KEYS } from "../constants";
import { getFromStorage, saveToStorage } from "../utils";

// Vehicles
export function getVehicles(): Vehicle[] {
  return getFromStorage<Vehicle>(STORAGE_KEYS.VEHICLES);
}

export function getVehicle(id: string): Vehicle | undefined {
  const vehicles = getVehicles();
  return vehicles.find((vehicle) => vehicle.id === id);
}

export function saveVehicle(vehicle: Vehicle): Vehicle {
  const vehicles = getVehicles();
  vehicles.push(vehicle);
  saveToStorage(STORAGE_KEYS.VEHICLES, vehicles);
  return vehicle;
}

export function updateVehicle(updatedVehicle: Vehicle): Vehicle {
  const vehicles = getVehicles();
  const index = vehicles.findIndex((vehicle) => vehicle.id === updatedVehicle.id);
  
  if (index !== -1) {
    vehicles[index] = updatedVehicle;
    saveToStorage(STORAGE_KEYS.VEHICLES, vehicles);
  }
  
  return updatedVehicle;
}
