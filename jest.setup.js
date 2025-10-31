// Jest setup file
// - extend expect with jest-native
// - mock react-native-reanimated and set minimal globals required
const matchers = require("@testing-library/jest-native/extend-expect");

// extend-expect registers itself by importing; keep this require for clarity
require("@testing-library/jest-native/extend-expect");

// react-native-reanimated mock (recommended shim)
jest.mock("react-native-reanimated", () => {
	const Reanimated = require("react-native-reanimated/mock");

	// The mock for `call` immediately calls the callback — keep predictable behavior
	Reanimated.default.call = () => {};
	return Reanimated;
});

// Silence useNativeDriver warnings (guarded in case path differs)
try {
	jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
} catch (e) {
	// module not present in some environments — ignore
}

// react-native-gesture-handler has a jestSetup, but ensure it's safe
try {
	require("react-native-gesture-handler/jestSetup");
} catch (e) {
	// ignore if not available in environment
}

// Mock expo-secure-store to avoid native calls during tests
jest.mock("expo-secure-store", () => ({
	setItemAsync: jest.fn(),
	getItemAsync: jest.fn(() => null),
	deleteItemAsync: jest.fn(),
}));

// Mock expo-local-authentication to avoid native calls
jest.mock("expo-local-authentication", () => ({
	hasHardwareAsync: jest.fn(() => Promise.resolve(false)),
	hasEnrolledAsync: jest.fn(() => Promise.resolve(false)),
	authenticateAsync: jest.fn(() => Promise.resolve({success: false})),
	supportedAuthenticationTypesAsync: jest.fn(() => Promise.resolve([])),
}));

// Mock expo-modules-core which is relied on by some expo packages
jest.mock("expo-modules-core", () => ({
	EventEmitter: class {
		constructor() {}
		addListener() {
			return {remove: () => {}};
		}
		removeAllListeners() {}
	},
	CodedError: class extends Error {},
}));
