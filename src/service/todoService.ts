/**
 * Todo Service
 * Handles all todo-related business logic and operations
 */

import {Todo, TodoInput} from "../types/todo";
import {generateId} from "../utils/utils";

export interface TodoOperationResult {
	success: boolean;
	error?: string;
	data?: Todo | Todo[];
}

/**
 * Todo service class
 * Encapsulates all todo-related operations and business logic
 */
export class TodoService {
	/**
	 * Create a new todo item
	 * @param todoData - Input data for the new todo
	 * @returns Todo - The created todo item
	 */
	static createTodo(todoData: TodoInput): Todo {
		return {
			...todoData,
			id: generateId(),
			completed: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	}

	/**
	 * Update an existing todo item
	 * @param todo - The original todo item
	 * @param updates - Partial updates to apply
	 * @returns Todo - The updated todo item
	 */
	static updateTodo(todo: Todo, updates: Partial<Todo>): Todo {
		// Ensure updatedAt is strictly greater than previous updatedAt
		const prev = new Date(todo.updatedAt).getTime();
		const now = Date.now();
		const updatedAt = new Date(Math.max(now, prev + 1));
		return {
			...todo,
			...updates,
			updatedAt,
		};
	}

	/**
	 * Toggle the completion status of a todo
	 * @param todo - The todo item to toggle
	 * @returns Todo - The todo with toggled completion status
	 */
	static toggleTodoCompletion(todo: Todo): Todo {
		// Ensure updatedAt advances at least 1ms past previous updatedAt
		const prev = new Date(todo.updatedAt).getTime();
		const now = Date.now();
		const updatedAt = new Date(Math.max(now, prev + 1));
		return {
			...todo,
			completed: !todo.completed,
			updatedAt,
		};
	}

	/**
	 * Filter todos by completion status
	 * @param todos - Array of todos to filter
	 * @param completed - Filter by completion status (optional)
	 * @returns Todo[] - Filtered todos
	 */
	static filterTodos(todos: Todo[], completed?: boolean): Todo[] {
		if (completed === undefined) {
			return todos;
		}
		return todos.filter((todo) => todo.completed === completed);
	}

	/**
	 * Sort todos by creation date
	 * @param todos - Array of todos to sort
	 * @param ascending - Sort order (default: false for newest first)
	 * @returns Todo[] - Sorted todos
	 */
	static sortTodosByDate(todos: Todo[], ascending: boolean = false): Todo[] {
		return [...todos].sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime();
			const dateB = new Date(b.createdAt).getTime();
			return ascending ? dateA - dateB : dateB - dateA;
		});
	}

	/**
	 * Place pinned todos first (each group sorted by date desc)
	 */
	static sortPinnedFirst(todos: Todo[]): Todo[] {
		const pinned = todos
			.filter((t) => t.pinned)
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
		const others = todos
			.filter((t) => !t.pinned)
			.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			);
		return [...pinned, ...others];
	}

	/**
	 * Find a todo by ID
	 * @param todos - Array of todos to search
	 * @param id - ID of the todo to find
	 * @returns Todo | undefined - The found todo or undefined
	 */
	static findTodoById(todos: Todo[], id: string): Todo | undefined {
		return todos.find((todo) => todo.id === id);
	}

	/**
	 * Validate todo input data
	 * @param todoData - Input data to validate
	 * @returns boolean - true if valid, false otherwise
	 */
	static validateTodoInput(todoData: TodoInput): boolean {
		return Boolean(
			todoData.title &&
				todoData.title.trim().length > 0 &&
				todoData.title.trim().length <= 200,
		);
	}
}
