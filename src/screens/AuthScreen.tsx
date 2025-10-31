/**
 * Authentication Screen
 * Handles biometric authentication using expo-local-authentication
 * Provides a secure entry point to the todo application
 */

import React, {useEffect, useState} from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Alert,
	SafeAreaView,
	ActivityIndicator,
} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import * as LocalAuthentication from "expo-local-authentication";
import {useTodoStore} from "../store/todoStore";
import {AuthService} from "../service/authService";
import {RootStackParamList} from "../navigation/AppNavigator";
import PinInput from "../components/PinInput";

type AuthScreenProps = NativeStackScreenProps<RootStackParamList, "Auth">;

export const AuthScreen: React.FC<AuthScreenProps> = ({navigation}) => {
	const {authenticate, isLoading, error, setError} = useTodoStore();
	const [biometricType, setBiometricType] = useState<string>("");
	const [isSupported, setIsSupported] = useState<boolean>(false);
	const [showPinEntry, setShowPinEntry] = useState<boolean>(false);
	const [pin, setPin] = useState<string>("");
	const [hasPin, setHasPin] = useState<boolean>(false);
	const [pinError, setPinError] = useState<string | null>(null);
	const [createPinMode, setCreatePinMode] = useState<boolean>(false);
	const [newPin, setNewPin] = useState<string>("");
	const [confirmPin, setConfirmPin] = useState<string>("");

	/**
	 * Check device capabilities on component mount
	 */
	useEffect(() => {
		(async () => {
			// Check PIN first -- if no PIN exists, require creation before biometric auth
			const p = await AuthService.hasPin();
			setHasPin(p);
			if (!p) setCreatePinMode(true);
			await checkDeviceCapabilities();
		})();
	}, []);

	/**
	 * Check if device supports biometric authentication
	 */
	const checkDeviceCapabilities = async () => {
		try {
			const hasHardware = await LocalAuthentication.hasHardwareAsync();
			const isEnrolled = await LocalAuthentication.isEnrolledAsync();
			const supportedTypes =
				await LocalAuthentication.supportedAuthenticationTypesAsync();

			setIsSupported(hasHardware && isEnrolled);

			// Debug: log reported supported types (helps on emulators)
			// supportedTypes is an array of LocalAuthentication.AuthenticationType values
			console.debug("LocalAuthentication supportedTypes:", supportedTypes);

			const hasFace = supportedTypes.includes(
				LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
			);
			const hasFingerprint = supportedTypes.includes(
				LocalAuthentication.AuthenticationType.FINGERPRINT,
			);
			const hasIris = supportedTypes.includes(
				LocalAuthentication.AuthenticationType.IRIS,
			);

			// Prefer fingerprint when both are reported (emulators sometimes report multiple types)
			if (hasFingerprint && hasFace) {
				setBiometricType("Fingerprint & Face");
			} else if (hasFingerprint) {
				setBiometricType("Fingerprint");
			} else if (hasFace) {
				setBiometricType("Face ID");
			} else if (hasIris) {
				setBiometricType("Iris");
			} else {
				setBiometricType("Biometric");
			}
		} catch (error) {
			console.error("Error checking device capabilities:", error);
			setError("Failed to check authentication capabilities");
		}
	};

	/**
	 * Handle authentication attempt
	 */
	const handleAuthenticate = async () => {
		try {
			setError(null);
			const result = await authenticate();

			if (result.success) {
				// navigation handled by AppNavigator
			} else if (result.reason === "no-biometrics") {
				// Show PIN entry UI so user can fallback to passcode
				setShowPinEntry(true);
			} else {
				// biometric failed (after max attempts) -> show PIN entry
				// If the service indicates the user reached the max biometric attempts,
				// hide biometric UI so they are forced to use PIN fallback.
				if (
					result.reason === "require-pin" ||
					result.reason === "biometric-failed"
				) {
					setIsSupported(false);
				}
				setShowPinEntry(true);
				// If biometric attempts exhausted, require PIN entry
				Alert.alert(
					"Biometric Unavailable",
					"Biometric authentication has been disabled for this session. You must enter your PIN to continue.",
					[{text: "OK"}],
				);
			}
		} catch (error) {
			Alert.alert("Authentication Error", (error as Error).message, [{text: "OK"}]);
		}
	};

	/**
	 * Show fallback for devices without biometric support
	 */
	const handleFallbackAuth = () => {
		Alert.alert(
			"Authentication Required",
			"This device does not support biometric authentication.",
			[{text: "Cancel", style: "cancel"}],
		);
	};

	return (
		<SafeAreaView className='flex-1 bg-[#047857]'>
			<View className='flex-1 justify-center px-[24px]'>
				{/* Header */}
				<View className='items-center mb-[48px]'>
					<Text className='text-white font-bold text-center mb-[8px] text-[32px]'>
						Todo List
					</Text>
					<Text className='text-center text-[16px] text-[#d1fae5] leading-[22px]'>
						Your tasks are protected with biometric authentication
					</Text>
				</View>

				{/* Authentication Section */}
				<View className='items-center'>
					<View className='justify-center items-center w-[80px] h-[80px] rounded-[40px] bg-[#ffffff33] mb-[24px]'>
						<Text className='text-[32px]'>🔒</Text>
					</View>

					{error && (
						<View className='rounded-lg border bg-[#ef44441a] border-[#ef44444d] p-[12px] mb-[16px]'>
							<Text className='text-center text-[#fef2f2] text-[14px]'>
								{error}
							</Text>
						</View>
					)}

					<Text className='text-white text-center text-[18px] mb-[32px] leading-[24px]'>
						{showPinEntry
							? "Please enter your PIN to continue"
							: isSupported
							? `Use ${biometricType} to access your todos`
							: "Authentication required to access your todos"}
					</Text>

					{/* Create PIN (first-run) OR Authentication Button */}
					{createPinMode ? (
						<PinInput
							createMode
							newPin={newPin}
							confirmPin={confirmPin}
							error={pinError}
							onChangeNewPin={setNewPin}
							onChangeConfirmPin={setConfirmPin}
							onClear={() => {
								setNewPin("");
								setConfirmPin("");
								setPinError(null);
							}}
							onSavePin={async () => {
								if (newPin.length < 4) {
									setPinError("PIN must be at least 4 digits");
									return;
								}
								if (newPin !== confirmPin) {
									setPinError("PIN and confirmation do not match");
									return;
								}
								try {
									await AuthService.setPin(newPin);
									setHasPin(true);
									setCreatePinMode(false);
									setNewPin("");
									setConfirmPin("");
									Alert.alert(
										"PIN Created",
										"PIN saved securely. Please authenticate using biometric or PIN.",
									);
								} catch (e) {
									setPinError("Failed to save PIN");
								}
							}}
						/>
					) : !showPinEntry ? (
						<TouchableOpacity
							className={`bg-white items-center rounded-[12px] ${
								isLoading ? "opacity-70" : ""
							} py-[16px] px-[32px] min-w-[200px] mb-[24px]`}
							onPress={
								isSupported ? handleAuthenticate : handleFallbackAuth
							}
							disabled={isLoading || !isSupported}
						>
							{isLoading ? (
								<ActivityIndicator color='#047857' size='small' />
							) : (
								<Text className='text-center font-semibold text-[#047857] text-[16px]'>
									{isSupported
										? `Authenticate with ${biometricType}`
										: "Please enable biometric authentication to continue"}
								</Text>
							)}
						</TouchableOpacity>
					) : null}

					{/* PIN Entry Modal (simple inline card) */}
					{showPinEntry && (
						<PinInput
							pin={pin}
							error={pinError}
							onChangePin={(t) => {
								setPin(t);
								setPinError(null);
							}}
							onVerifyPin={async () => {
								if (!pin) {
									setPinError("Please enter PIN");
									return;
								}
								const ok = await AuthService.verifyPin(pin);
								if (ok) {
									setShowPinEntry(false);
									setPin("");
									const {unlockWithPin} = useTodoStore.getState();
									unlockWithPin();
								} else {
									setPinError("Invalid PIN");
								}
							}}
							onSavePin={async () => {
								try {
									if (pin.length < 4) {
										setPinError("PIN must be at least 4 digits");
										return;
									}
									await AuthService.setPin(pin);
									setHasPin(true);
									setPin("");
									setShowPinEntry(false);
									Alert.alert(
										"Success",
										"PIN saved. Please authenticate again.",
									);
								} catch (e) {
									setPinError("Failed to save PIN");
								}
							}}
						/>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
};
