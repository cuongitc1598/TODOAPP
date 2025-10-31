/**
 * App Navigator
 * Main navigation structure for the secure todo application
 * Handles navigation between authentication and main app screens
 */

import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useTodoStore} from "../store/todoStore";
import {AuthScreen} from "../screens/AuthScreen";
import {TodoListScreen} from "../screens/TodoListScreen";
import {DetailTaskSCreen} from "../screens/DetailTaskScreen";

/**
 * Navigation parameter list for type safety
 */
export type RootStackParamList = {
	Auth: undefined;
	TodoList: undefined;
	AddTask: {id?: string} | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main App Navigator Component
 * Conditionally renders authenticated or unauthenticated screens
 */
export const AppNavigator: React.FC = () => {
	const {isAuthenticated} = useTodoStore();

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false, // Hide default header since screens have custom headers
				}}
			>
				{!isAuthenticated ? (
					// Unauthenticated Stack
					<Stack.Screen
						name='Auth'
						component={AuthScreen}
						options={{
							gestureEnabled: false, // Prevent swipe back from auth screen
							animation: "fade_from_bottom", // Smooth navigation animations
						}}
					/>
				) : (
					// Authenticated Stack
					<Stack.Group>
						<Stack.Screen
							name='TodoList'
							component={TodoListScreen}
							options={{
								gestureEnabled: false, // Prevent swipe back to auth
								animation: "slide_from_right", // Smooth navigation animations
							}}
						/>
						<Stack.Screen
							name='AddTask'
							component={DetailTaskSCreen}
							options={{
								presentation: "modal", // Present as modal for better UX
								animation: "slide_from_bottom",
							}}
						/>
					</Stack.Group>
				)}
			</Stack.Navigator>
		</NavigationContainer>
	);
};
