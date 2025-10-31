import {TodoService} from "../src/service/todoService";
import {TodoInput} from "../src/types/todo";

describe("TodoService", () => {
	test("createTodo returns a Todo with required fields", () => {
		const input: TodoInput = {title: "Test", pinned: false};
		const todo = TodoService.createTodo(input);

		expect(todo.id).toBeDefined();
		expect(todo.title).toBe("Test");
		expect(todo.pinned).toBe(false);
		expect(todo.completed).toBe(false);
		expect(todo.createdAt).toBeInstanceOf(Date);
		expect(todo.updatedAt).toBeInstanceOf(Date);
	});

	test("updateTodo applies updates and sets updatedAt", () => {
		const input: TodoInput = {title: "Original", pinned: false};
		const todo = TodoService.createTodo(input);

		const updated = TodoService.updateTodo(todo, {title: "Updated", pinned: true});

		expect(updated.title).toBe("Updated");
		expect(updated.pinned).toBe(true);
		expect(updated.updatedAt.getTime()).toBeGreaterThan(todo.updatedAt.getTime());
	});

	test("toggleTodoCompletion toggles completed and updates updatedAt", () => {
		const input: TodoInput = {title: "Toggle", pinned: false};
		const todo = TodoService.createTodo(input);
		const toggled = TodoService.toggleTodoCompletion(todo);

		expect(toggled.completed).toBe(!todo.completed);
		expect(toggled.updatedAt.getTime()).toBeGreaterThan(todo.updatedAt.getTime());
	});

	test("filterTodos and sortTodosByDate behave as expected", () => {
		const a = TodoService.createTodo({title: "A", pinned: false});
		const b = TodoService.createTodo({title: "B", pinned: true});
		// ensure ordering by createdAt
		const list = [a, b];
		const pinnedFirst = TodoService.sortPinnedFirst(list);
		expect(pinnedFirst[0].pinned).toBe(true);

		const filtered = TodoService.filterTodos(list, false);
		expect(filtered.every((t) => t.completed === false)).toBe(true);
	});
});
