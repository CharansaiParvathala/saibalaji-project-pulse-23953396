
import { Driver } from "@/types";
import { STORAGE_KEYS } from "../constants";
import { getFromStorage, saveToStorage } from "../utils";

// Drivers
export function getDrivers(): Driver[] {
  return getFromStorage<Driver>(STORAGE_KEYS.DRIVERS);
}

export function getDriver(id: string): Driver | undefined {
  const drivers = getDrivers();
  return drivers.find((driver) => driver.id === id);
}

export function saveDriver(driver: Driver): Driver {
  const drivers = getDrivers();
  drivers.push(driver);
  saveToStorage(STORAGE_KEYS.DRIVERS, drivers);
  return driver;
}

export function updateDriver(updatedDriver: Driver): Driver {
  const drivers = getDrivers();
  const index = drivers.findIndex((driver) => driver.id === updatedDriver.id);
  
  if (index !== -1) {
    drivers[index] = updatedDriver;
    saveToStorage(STORAGE_KEYS.DRIVERS, drivers);
  }
  
  return updatedDriver;
}
