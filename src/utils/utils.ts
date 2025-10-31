/**
 * Utility functions for the todo store
 * Contains helper functions for ID generation and device capabilities
 */

import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Generate unique ID for todos
 * Uses timestamp + random string for uniqueness
 */
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

/**
 * Check if device supports biometric authentication
 * @returns Promise<boolean> - true if device has biometric hardware and is enrolled
 */
export const checkBiometricSupport = async (): Promise<boolean> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && isEnrolled;
};
