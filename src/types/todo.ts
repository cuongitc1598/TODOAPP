/**
 * Core Types
 */
export interface Todo {
	id: string;
	title: string;
	completed: boolean;
	pinned?: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type TodoInput = Pick<Todo, "title" | "pinned">;

/**
 * Authentication Types
 */
export interface AuthResult {
	success: boolean;
	reason?: "no-biometrics" | "pin-required" | string;
	error?: string;
}

/**
 * Store Types
 */
export interface TodoState {
	todos: Todo[];
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

export interface TodoActions {
	// Auth
	authenticate: () => Promise<AuthResult>;
	logout: () => void;
	unlockWithPin: () => void;

	// CRUD
	addTodo: (todo: TodoInput) => Promise<void>;
	updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
	deleteTodo: (id: string) => Promise<void>;
	toggleTodo: (id: string) => Promise<void>;
	togglePin: (id: string) => Promise<void>;

	// State
	loadTodos: () => Promise<void>;
	setError: (error: string | null) => void;
	setLoading: (loading: boolean) => void;
}

export type TodoStore = TodoState & TodoActions;
