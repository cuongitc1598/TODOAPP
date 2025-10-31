/**
 * Authentication Service
 * Handles biometric authentication and related operations
 */

import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { checkBiometricSupport } from '../utils/utils';

export interface AuthResult {
  success: boolean;
  error?: string;
  reason?: string; // e.g. 'no-biometrics' | 'biometric-failed' | 'pin-required'
}

/**
 * Authentication service class
 * Encapsulates all authentication-related operations
 */
export class AuthService {
  /**
   * Authenticate user using biometric or fallback methods
   * @returns Promise<AuthResult> - authentication result with success status
   */
  static async authenticate(): Promise<AuthResult> {
    try {
      const isSupported = await checkBiometricSupport();
      if (!isSupported) {
        // Let caller know biometric is not available so UI can fallback to PIN
        return { success: false, reason: 'no-biometrics', error: 'Biometric not available' };
      }

      // Try biometric up to 3 times before requiring PIN
      const maxAttempts = 3;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Authenticate to access your todos',
          cancelLabel: 'Cancel',
          fallbackLabel: 'Use Passcode',
        });

        if (result.success) {
          return { success: true };
        }

        // if last attempt, require PIN
        if (attempt === maxAttempts) {
          return {
            success: false,
            reason: 'require-pin',
            error: `Authentication failed after ${maxAttempts} attempts`,
          };
        }
        // otherwise continue loop and let user try again
      }
    } catch (error) {
      return { 
        success: false,
        error: 'Authentication error: ' + (error as Error).message,
        reason: 'error',
      };
    }
    // fallback safe return (should be unreachable)
    return { success: false, reason: 'error', error: 'Unknown authentication error' };
  }

  /**
   * Check if biometric authentication is available on the device
   * @returns Promise<boolean>
   */
  static async isBiometricAvailable(): Promise<boolean> {
    return checkBiometricSupport();
  }

  /**
   * PIN management using SecureStore
   */
  static async setPin(pin: string): Promise<void> {
    // store PIN in SecureStore (no extra encryption layer)
    await SecureStore.setItemAsync('todo_pin', pin, { keychainAccessible: SecureStore.ALWAYS_THIS_DEVICE_ONLY });
  }

  static async getPin(): Promise<string | null> {
    return await SecureStore.getItemAsync('todo_pin');
  }

  static async hasPin(): Promise<boolean> {
    const p = await AuthService.getPin();
    return Boolean(p);
  }

  static async verifyPin(pin: string): Promise<boolean> {
    const stored = await AuthService.getPin();
    if (!stored) return false;
    return stored === pin;
  }
}
