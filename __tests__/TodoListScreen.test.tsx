import React from "react";
import {render} from "@testing-library/react-native";
import {TodoListScreen} from "../src/screens/TodoListScreen";

// Mock useTodoStore to provide todos
jest.mock("../src/store/todoStore", () => ({
	useTodoStore: jest.fn(() => ({
		todos: [
			{
				id: "1",
				title: "First",
				completed: false,
				pinned: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		],
		toggleTodo: jest.fn(),
		deleteTodo: jest.fn(),
		logout: jest.fn(),
	})),
}));

describe("TodoListScreen", () => {
	test("renders title and todo item", () => {
		const navigation: any = {navigate: jest.fn(), goBack: jest.fn()};
		const route: any = {};
		const {getByText} = render(
			<TodoListScreen navigation={navigation} route={route} />,
		);

		expect(getByText(/My Todo List/)).toBeTruthy();
		expect(getByText(/First/)).toBeTruthy();
	});
});
