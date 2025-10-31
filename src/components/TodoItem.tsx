import React, {useState, useEffect} from "react";
import {View, Text, TouchableOpacity, Alert} from "react-native";
import {Swipeable, RectButton} from "react-native-gesture-handler";
import {Todo} from "../types/todo";
import {theme} from "../theme";
import {Ionicons} from "@expo/vector-icons";

type Props = {
	todo: Todo;
	onToggle: (t: Todo) => Promise<void> | void;
	onDelete: (id: string) => Promise<void> | void;
	onLongPress?: (t: Todo) => void;
	onEdit?: (t: Todo) => void;
	onPin?: (t: Todo) => Promise<void> | void;
};

export const TodoItem: React.FC<Props> = ({
	todo,
	onToggle,
	onDelete,
	onLongPress,
	onEdit,
	onPin,
}) => {
	// Local optimistic pinned state so UI updates immediately on tap
	const [pinnedLocal, setPinnedLocal] = useState<boolean>(!!todo.pinned);

	useEffect(() => {
		setPinnedLocal(!!todo.pinned);
	}, [todo.pinned]);
	const handleDelete = () => {
		Alert.alert("Delete Todo", `Are you sure you want to delete "${todo.title}"?`, [
			{text: "Cancel", style: "cancel"},
			{text: "Delete", style: "destructive", onPress: () => onDelete(todo.id)},
		]);
	};

	return (
		<Swipeable
			// improve swipe responsiveness and prevent overshoot
			friction={2}
			overshootLeft={false}
			overshootRight={false}
			leftThreshold={80}
			rightThreshold={40}
			// only render left 'Done' action for not-completed items
			renderLeftActions={
				!todo.completed
					? () => (
							<RectButton
								style={{
									backgroundColor: theme.colors.primaryDark,
									justifyContent: "center",
									alignItems: "center",
									width: 100,
								}}
								onPress={() => onToggle(todo)}
							>
								<Text
									style={{
										color: "white",
										fontWeight: "700",
										fontSize: 16,
									}}
								>
									Done
								</Text>
							</RectButton>
					  )
					: undefined
			}
			renderRightActions={() => (
				<>
					{todo.completed ? (
						// Completed items: show Uncomplete + Delete (no Edit)
						<>
							<RectButton
								style={{
									backgroundColor: theme.colors.primaryDark,
									justifyContent: "center",
									alignItems: "center",
									width: 110,
								}}
								onPress={() => onToggle(todo)}
							>
								<Text
									style={{
										color: "white",
										fontWeight: "800",
										fontSize: 16,
									}}
								>
									Reopen
								</Text>
							</RectButton>
							<RectButton
								style={{
									backgroundColor: theme.colors.danger,
									justifyContent: "center",
									alignItems: "center",
									width: 110,
								}}
								onPress={handleDelete}
							>
								<Text
									style={{
										color: "white",
										fontWeight: "800",
										fontSize: 16,
									}}
								>
									Delete
								</Text>
							</RectButton>
						</>
					) : (
						// Pending items: Edit + Delete
						<>
							<RectButton
								style={{
									backgroundColor: theme.colors.primary,
									justifyContent: "center",
									alignItems: "center",
									width: 110,
								}}
								onPress={() => onEdit?.(todo)}
							>
								<Text
									style={{
										color: "white",
										fontWeight: "800",
										fontSize: 16,
									}}
								>
									Edit
								</Text>
							</RectButton>
							<RectButton
								style={{
									backgroundColor: theme.colors.danger,
									justifyContent: "center",
									alignItems: "center",
									width: 110,
								}}
								onPress={handleDelete}
							>
								<Text
									style={{
										color: "white",
										fontWeight: "800",
										fontSize: 16,
									}}
								>
									Delete
								</Text>
							</RectButton>
						</>
					)}
				</>
			)}
		>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: "white",
					borderRadius: 12,
					marginHorizontal: 20,
					marginBottom: 12,
					padding: 12,
					elevation: 3,
				}}
			>
				<TouchableOpacity
					style={{flex: 1, flexDirection: "row", alignItems: "center"}}
					onPress={() => {}}
					onLongPress={() => onLongPress?.(todo)}
					activeOpacity={0.9}
				>
					<View
						style={{
							width: 48,
							height: 48,
							borderRadius: 12,
							backgroundColor: theme.colors.surface,
							alignItems: "center",
							justifyContent: "center",
							marginRight: 12,
						}}
					>
						{/* left icon is fixed (default decorative icon) */}
						<Ionicons
							name='document-text-outline'
							size={20}
							color={theme.colors.primaryDark}
						/>
					</View>

					<View style={{flex: 1}}>
						<Text
							style={{
								fontSize: 16,
								marginBottom: 4,
								fontWeight: "600",
								color: todo.completed ? "#9CA3AF" : "#111827",
								textDecorationLine: todo.completed
									? "line-through"
									: "none",
							}}
						>
							{todo.title}
						</Text>
					</View>

					<View style={{flexDirection: "row", alignItems: "center"}}>
						{/* Pin action (professional icon) */}
						<TouchableOpacity
							onPress={async () => {
								// optimistic toggle for immediate feedback
								setPinnedLocal((p) => !p);
								try {
									await onPin?.(todo);
								} catch (e) {
									// revert on error
									setPinnedLocal(!!todo.pinned);
								}
							}}
							style={{
								paddingHorizontal: 12,
								paddingVertical: 8,
								borderRadius: 8,
								alignItems: "center",
								justifyContent: "center",
								marginLeft: 12,
								backgroundColor: theme.colors.surface,
							}}
							accessibilityLabel='pin-button'
						>
							<Ionicons
								// use bookmark icons for clearer visual difference
								name={pinnedLocal ? "bookmark" : "bookmark-outline"}
								size={18}
								color={pinnedLocal ? theme.colors.primaryDark : "#6B7280"}
								accessibilityLabel={pinnedLocal ? "pinned" : "not-pinned"}
							/>
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</View>
		</Swipeable>
	);
};

export default TodoItem;
