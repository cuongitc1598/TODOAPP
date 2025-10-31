/**
 * Jest configuration for React Native + TypeScript
 */
module.exports = {
	preset: "react-native",
	clearMocks: true,
	setupFiles: ["<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js"],
	setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
	transform: {
		"^.+\\.tsx?$": "babel-jest",
		"^.+\\.jsx?$": "babel-jest",
	},
	// Use node environment for react-native tests
	testEnvironment: "node",
	testEnvironment: "node",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$":
			"<rootDir>/__mocks__/fileMock.js",
		"\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
	},
	transformIgnorePatterns: [
		"node_modules/(?!(react-native|@react-native|@react-navigation|react-native-gesture-handler|@react-native-async-storage|expo-local-authentication|expo-modules-core|expo-secure-store)/)",
	],
	automock: false,
	moduleDirectories: ["node_modules", "<rootDir>/__mocks__"],
};
