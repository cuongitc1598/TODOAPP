import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {TodoStore} from "../types/todo";
import {AuthService} from "../service/authService";
import {TodoService} from "../service/todoService";

/**
 * Main Todo Store with Zustand
 * Implements secure CRUD operations with authentication checks using modular services
 */
export const useTodoStore = create<TodoStore>()(
	persist(
		(set, get) => ({
			// Initial state
			todos: [],
			isAuthenticated: false,
			isLoading: false,
			error: null,

			// Authentication actions
			authenticate: async (): Promise<{
				success: boolean;
				reason?: string;
				error?: string;
			}> => {
				try {
					set({isLoading: true, error: null});

					const authResult = await AuthService.authenticate();

					if (authResult.success) {
						set({isAuthenticated: true, isLoading: false});
						await get().loadTodos();
						return {success: true};
					} else {
						set({
							isAuthenticated: false,
							isLoading: false,
							error: authResult.error || "Authentication failed",
						});
						// return full authResult so UI can decide to prompt PIN
						return {
							success: false,
							reason: authResult.reason,
							error: authResult.error,
						};
					}
				} catch (error) {
					set({
						isAuthenticated: false,
						isLoading: false,
						error: "Authentication error: " + (error as Error).message,
					});
					return {
						success: false,
						error: "Authentication error: " + (error as Error).message,
						reason: "error",
					};
				}
			},

			logout: () => {
				// Lock the app (require re-authentication) but keep todos persisted on device
				set({
					isAuthenticated: false,
					error: null,
				});
			},
			// Called when user successfully verifies PIN to unlock app
			unlockWithPin: () => {
				set({isAuthenticated: true, error: null});
				// loadTodos will be called by authenticate flow normally; we can call it here to ensure todos are in memory
				get().loadTodos();
			},

			// Todo CRUD operations with authentication checks
			addTodo: async (todoData) => {
				const {isAuthenticated} = get();
				if (!isAuthenticated) {
					throw new Error("Authentication required");
				}

				try {
					set({isLoading: true, error: null});

					// Validate input
					if (!TodoService.validateTodoInput(todoData)) {
						throw new Error("Invalid todo data");
					}

					const newTodo = TodoService.createTodo(todoData);

					set((state) => ({
						todos: [...state.todos, newTodo],
						isLoading: false,
					}));
				} catch (error) {
					set({
						isLoading: false,
						error: "Failed to add todo: " + (error as Error).message,
					});
					throw error;
				}
			},

			updateTodo: async (id, updates) => {
				const {isAuthenticated} = get();
				if (!isAuthenticated) {
					throw new Error("Authentication required");
				}

				try {
					set({isLoading: true, error: null});

					set((state) => ({
						todos: state.todos.map((todo) =>
							todo.id === id ? TodoService.updateTodo(todo, updates) : todo,
						),
						isLoading: false,
					}));
				} catch (error) {
					set({
						isLoading: false,
						error: "Failed to update todo: " + (error as Error).message,
					});
					throw error;
				}
			},

			deleteTodo: async (id) => {
				const {isAuthenticated} = get();
				if (!isAuthenticated) {
					throw new Error("Authentication required");
				}

				try {
					set({isLoading: true, error: null});

					set((state) => ({
						todos: state.todos.filter((todo) => todo.id !== id),
						isLoading: false,
					}));
				} catch (error) {
					set({
						isLoading: false,
						error: "Failed to delete todo: " + (error as Error).message,
					});
					throw error;
				}
			},

			toggleTodo: async (id) => {
				const {isAuthenticated} = get();
				if (!isAuthenticated) {
					throw new Error("Authentication required");
				}

				const todo = TodoService.findTodoById(get().todos, id);
				if (todo) {
					const toggledTodo = TodoService.toggleTodoCompletion(todo);
					await get().updateTodo(id, {completed: toggledTodo.completed});
				}
			},

			// Toggle pinned state of a todo
			togglePin: async (id: string) => {
				const todo = TodoService.findTodoById(get().todos, id);
				if (todo) {
					const newPinned = !todo.pinned;
					await get().updateTodo(id, {pinned: newPinned});
				}
			},

			// Data management
			loadTodos: async () => {
				try {
					set({isLoading: true, error: null});
					// Todos are automatically loaded from persistence
					set({isLoading: false});
				} catch (error) {
					set({
						isLoading: false,
						error: "Failed to load todos: " + (error as Error).message,
					});
				}
			},

			setError: (error) => set({error}),
			setLoading: (loading) => set({isLoading: loading}),
		}),
		{
			name: "todo-storage",
			storage: createJSONStorage(() => AsyncStorage),
			// Only persist todos, not authentication state
			partialize: (state) => ({
				todos: state.todos,
			}),
		},
	),
);
