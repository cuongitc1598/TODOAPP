import React, {useState, useEffect} from "react";
import {
	View,
	Text,
	TouchableOpacity,
	SafeAreaView,
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
} from "react-native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {useTodoStore} from "../store/todoStore";
import {RootStackParamList} from "../navigation/AppNavigator";
import {TodoInput} from "../types/todo";
import Header from "../components/Header";
import FormField from "../components/FormField";
import {Ionicons} from "@expo/vector-icons";

type AddTaskScreenProps = NativeStackScreenProps<RootStackParamList, "AddTask">;

export const DetailTaskSCreen: React.FC<AddTaskScreenProps> = ({navigation, route}) => {
	const {addTodo, updateTodo, isLoading, todos} = useTodoStore();

	const [title, setTitle] = useState("");
	const [pinned, setPinned] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// If editing (route.params?.id present), prefill fields
	useEffect(() => {
		const id = route?.params?.id;
		if (id) {
			const t = todos.find((x) => x.id === id);
			if (t) {
				setTitle(t.title);
				setPinned(!!t.pinned);
			}
		}
	}, [route?.params?.id, todos]);

	const handleSave = async () => {
		if (!title.trim()) {
			setError("Please enter a task title");
			return;
		}

		try {
			const task: TodoInput = {
				title: title.trim(),
				pinned,
			};

			const editingId = route?.params?.id;
			if (editingId) {
				await updateTodo(editingId, {title: task.title, pinned: task.pinned});
				Alert.alert("Success", "Task updated successfully!", [
					{
						text: "OK",
						onPress: () => {
							navigation.goBack();
						},
					},
				]);
			} else {
				await addTodo(task);
				Alert.alert("Success", "Task added successfully!", [
					{
						text: "OK",
						onPress: () => {
							setTitle("");
							setPinned(false);
							setError(null);
							navigation.goBack();
						},
					},
				]);
			}
		} catch (err) {
			Alert.alert("Error", "Failed to save task. Please try again.");
		}
	};

	const canSave = title.trim().length > 0 && !isLoading;
	const isEditing = !!route?.params?.id;

	return (
		<SafeAreaView style={{flex: 1, backgroundColor: "#047857"}}>
			<KeyboardAvoidingView
				style={{flex: 1}}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<Header
					title={isEditing ? "Edit Task" : "Add New Task"}
					onBack={() => navigation.goBack()}
					icon='✕'
				/>

				<ScrollView
					style={{
						flex: 1,
						backgroundColor: "#fff",
						borderTopLeftRadius: 24,
						borderTopRightRadius: 24,
						paddingTop: 30,
						paddingHorizontal: 20,
					}}
				>
					<FormField
						label='Task Title'
						value={title}
						onChangeText={(text) => {
							setTitle(text);
							setError(null);
						}}
						maxLength={100}
						autoFocus
						placeholder='Enter task title'
						error={error ?? undefined}
					/>

					<View style={{marginBottom: 24}}>
						<Text
							style={{
								fontWeight: "600",
								fontSize: 16,
								color: "#374151",
								marginBottom: 8,
							}}
						>
							Pin to top
						</Text>
						<TouchableOpacity
							style={{flexDirection: "row", alignItems: "center"}}
							onPress={() => setPinned(!pinned)}
						>
							<Ionicons
								name={pinned ? "checkbox" : "square-outline"}
								size={20}
								color={pinned ? "#065f46" : "#6B7280"}
							/>
							<Text style={{marginLeft: 8, color: "#374151"}}>
								{pinned ? "Pinned" : "Not pinned"}
							</Text>
						</TouchableOpacity>

						{/* If editing, show created/updated timestamps */}
						{route?.params?.id ? (
							<View style={{marginTop: 12}}>
								<Text style={{color: "#6B7280"}}>
									Created:{" "}
									{(() => {
										const id = route.params.id;
										const t = todos.find((x) => x.id === id);
										if (!t) return "";
										const created = new Date(
											t.createdAt,
										).toLocaleString();
										return created;
									})()}
								</Text>
								<Text style={{color: "#6B7280", marginTop: 4}}>
									Updated:{" "}
									{(() => {
										const id = route.params.id;
										const t = todos.find((x) => x.id === id);
										if (!t) return "";
										const updated = new Date(
											t.updatedAt,
										).toLocaleString();
										return updated;
									})()}
								</Text>
							</View>
						) : null}
					</View>
				</ScrollView>

				{/* Save Button - Fixed at bottom */}
				<View
					style={{
						backgroundColor: "#fff",
						paddingHorizontal: 20,
						paddingBottom: 20,
						paddingTop: 12,
						borderTopWidth: 1,
						borderColor: "#f3f4f6",
					}}
				>
					<TouchableOpacity
						style={{
							alignItems: "center",
							borderRadius: 12,
							backgroundColor: "#047857",
							paddingVertical: 16,
							opacity: !canSave ? 0.6 : 1,
						}}
						onPress={handleSave}
						disabled={!canSave}
					>
						<Text style={{color: "#fff", fontWeight: "600", fontSize: 16}}>
							{isLoading
								? "Saving..."
								: isEditing
								? "Update Task"
								: "Save Task"}
						</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};
