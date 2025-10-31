import React from "react";
import {render, waitFor} from "@testing-library/react-native";
import {AuthScreen} from "../src/screens/AuthScreen";

// Mock useTodoStore
jest.mock("../src/store/todoStore", () => ({
	useTodoStore: jest.fn(() => ({
		authenticate: jest.fn().mockResolvedValue({success: true}),
		isLoading: false,
		error: null,
		setError: jest.fn(),
	})),
}));

// Mock AuthService
jest.mock("../src/service/authService", () => ({
	AuthService: {
		hasPin: jest.fn().mockResolvedValue(true),
		setPin: jest.fn().mockResolvedValue(undefined),
		verifyPin: jest.fn().mockResolvedValue(true),
	},
}));

// Mock expo-local-authentication to behave as supporting biometric
jest.mock("expo-local-authentication", () => ({
	hasHardwareAsync: jest.fn().mockResolvedValue(true),
	isEnrolledAsync: jest.fn().mockResolvedValue(true),
	supportedAuthenticationTypesAsync: jest.fn().mockResolvedValue([]),
	AuthenticationType: {FACIAL_RECOGNITION: 1, FINGERPRINT: 2, IRIS: 3},
}));

describe("AuthScreen", () => {
	test("renders and shows authenticate button when biometrics supported", async () => {
		const navigation: any = {goBack: jest.fn(), navigate: jest.fn()};
		const route: any = {};
		const {getByText} = render(<AuthScreen navigation={navigation} route={route} />);

		await waitFor(() => {
			expect(getByText(/Todo List/)).toBeTruthy();
			expect(getByText(/Authenticate with/)).toBeTruthy();
		});
	});
});
