/**
 * Device State Constants
 * 
 * Centralized definition of device states used throughout the application.
 * Update this file when device states change in the business logic.
 */

export enum DeviceState {
  FREE = 0,
  UNLOCKED = 1,
  LOCKED = 2
}

/**
 * Device state options for dropdown/select components
 * Format: { label: string, value: string }
 */
export const DEVICE_STATE_OPTIONS: { label: string; value: string }[] = [
  { label: "Free", value: "0" },
  { label: "Unlocked", value: "1" },
  { label: "Locked", value: "2" }
];

/**
 * Get the label for a device state value
 * @param state - The numeric device state value (can be number, BigNumber, or string)
 * @returns The human-readable label for the state
 */
export const getDeviceStateLabel = (state: number | string | any): string => {
  // Convert state to number, handling BigNumber objects and other types
  let stateNum: number;
  
  if (typeof state === 'number') {
    stateNum = state;
  } else if (typeof state === 'string') {
    stateNum = parseInt(state, 10);
  } else if (state && typeof state === 'object' && 'toNumber' in state) {
    // Handle BigNumber from ethers
    stateNum = state.toNumber();
  } else {
    stateNum = Number(state);
  }
  
  // Handle NaN case
  if (isNaN(stateNum)) {
    return "Unknown";
  }
  
  // Convert to string and compare with option values, or compare as numbers
  const stateStr = String(stateNum);
  const option = DEVICE_STATE_OPTIONS.find(opt => opt.value === stateStr);
  
  return option?.label || "Unknown";
};

