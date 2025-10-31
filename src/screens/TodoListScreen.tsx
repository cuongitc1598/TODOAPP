/**
 * Todo List Screen
 * Main screen displaying the user's todo items with categories and completion status
 * Matches the design provided in the requirements
 */

import React, {useRef} from "react";
import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	SafeAreaView,
	Alert,
	Animated,
	StyleSheet,
} from "react-native";
import TodoItem from "../components/TodoItem";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useTodoStore} from "../store/todoStore";
import {Todo} from "../types/todo";
import {TodoService} from "../service/todoService";
import {RootStackParamList} from "../navigation/AppNavigator";
import {theme} from "../theme";

type TodoListScreenProps = NativeStackScreenProps<RootStackParamList, "TodoList">;

export const TodoListScreen: React.FC<TodoListScreenProps> = ({navigation}) => {
	const {todos, toggleTodo, deleteTodo, logout, togglePin} = useTodoStore();

	/**
	 * Get icon based on todo category
	 */
	// Show pinned items first
	const sortedTodos = TodoService.sortPinnedFirst(todos);

	/**
	 * Handle todo item press (toggle completion)
	 */
	const handleTodoPress = async (todo: Todo) => {
		try {
			await toggleTodo(todo.id);
		} catch (error) {
			Alert.alert("Error", "Failed to update todo");
		}
	};

	/**
	 * Handle todo item long press (show actions: Edit / Delete)
	 */
	const handleTodoLongPress = (todo: Todo) => {
		Alert.alert(todo.title, undefined, [
			{text: "Cancel", style: "cancel"},
			{text: "Edit", onPress: () => navigation.navigate("AddTask", {id: todo.id})},
			{
				text: "Delete",
				style: "destructive",
				onPress: () => handleDeleteTodo(todo.id),
			},
		]);
	};

	/**
	 * Delete todo item
	 */
	const handleDeleteTodo = async (id: string) => {
		try {
			await deleteTodo(id);
		} catch (error) {
			Alert.alert("Error", "Failed to delete todo");
		}
	};

	/**
	 * Handle logout
	 */
	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{text: "Cancel", style: "cancel"},
			{
				text: "Logout",
				onPress: () => {
					logout();
					// Navigation will be handled automatically by AppNavigator
					// when isAuthenticated state changes
				},
			},
		]);
	};

	/**
	 * Navigate to add task screen
	 */
	const handleAddTodo = () => {
		navigation.navigate("AddTask");
	};

	/**
	 * Render individual todo item
	 */
	const renderTodoItem = ({item}: {item: Todo}) => (
		<TodoItem
			todo={item}
			onToggle={handleTodoPress}
			onDelete={handleDeleteTodo}
			onLongPress={handleTodoLongPress}
			onEdit={(t) => navigation.navigate("AddTask", {id: t.id})}
			onPin={(t) => togglePin(t.id)}
		/>
	);

	/**
	 * Get current date formatted
	 */
	const getCurrentDate = () => {
		const now = new Date();
		return now.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Separate completed and pending todos using sorted list (pinned first)
	const pendingTodos = sortedTodos.filter((todo) => !todo.completed);
	const completedTodos = sortedTodos.filter((todo) => todo.completed);

	return (
		<SafeAreaView
			style={[styles.container, {backgroundColor: theme.colors.primary}] as any}
		>
			{/* Header */}
			<View style={styles.headerRow}>
				<TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
					<Text
						style={[
							styles.headerButtonText,
							{color: theme.colors.background},
						]}
					>
						←
					</Text>
				</TouchableOpacity>
				<Text style={[styles.headerDate, {color: theme.colors.background}]}>
					{getCurrentDate()}
				</Text>
				<View style={{width: 40}} />
			</View>

			{/* Title */}
			<Text style={[styles.title, {color: theme.colors.background}]}>
				My Todo List
			</Text>

			{/* Todo List */}
			<FlatList
				data={pendingTodos}
				renderItem={renderTodoItem}
				keyExtractor={(item) => item.id}
				style={styles.listContainer}
				showsVerticalScrollIndicator={false}
				ListHeaderComponent={() =>
					pendingTodos.length === 0 ? (
						<View className='items-center justify-center py-[60px]'>
							<Text className='font-semibold text-[18px] text-gray-400 mb-[8px]'>
								No pending tasks
							</Text>
							<Text className='text-[14px] text-gray-500'>
								Tap "Add New Task" to get started
							</Text>
						</View>
					) : null
				}
				ListFooterComponent={() =>
					completedTodos.length > 0 ? (
						<View className='border-t border-gray-200 mt-[30px] pt-[20px]'>
							<Text className='font-semibold text-[18px] text-gray-800 mb-[16px] mx-[20px]'>
								Completed
							</Text>
							{completedTodos.map((todo) => (
								<View key={todo.id}>{renderTodoItem({item: todo})}</View>
							))}
						</View>
					) : null
				}
			/>

			{/* Add Button */}
			<View style={{backgroundColor: theme.colors.background}}>
				<TouchableOpacity
					style={[
						styles.addButton,
						{backgroundColor: theme.colors.primaryDark},
					]}
					onPress={handleAddTodo}
				>
					<Text style={styles.addButtonText}>Add New Task</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {flex: 1},
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 20,
	},
	headerButton: {
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 20,
		width: 40,
		height: 40,
		backgroundColor: "rgba(255,255,255,0.18)",
	},
	headerButtonText: {fontWeight: "700", fontSize: 18, color: "#fff"},
	headerDate: {fontSize: 16, fontWeight: "600"},
	title: {fontSize: 28, fontWeight: "800", textAlign: "center", marginBottom: 30},
	listContainer: {
		flex: 1,
		backgroundColor: theme.colors.background,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 20,
	},
	addButton: {
		alignItems: "center",
		borderRadius: 12,
		marginHorizontal: 20,
		marginBottom: 20,
		paddingVertical: 16,
	},
	addButtonText: {color: theme.colors.background, fontWeight: "700", fontSize: 16},
});
