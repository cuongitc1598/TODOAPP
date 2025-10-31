import React from "react";
import {View, Text, TextInput, TextInputProps} from "react-native";

type FormFieldProps = {
	label: string;
	error?: string;
} & TextInputProps;

export const FormField: React.FC<FormFieldProps> = ({label, error, ...inputProps}) => {
	return (
		<View style={{marginBottom: 24}}>
			<Text
				style={{
					fontWeight: "600",
					fontSize: 16,
					color: "#374151",
					marginBottom: 8,
				}}
			>
				{label}
			</Text>
			<TextInput
				style={{
					backgroundColor: "#fff",
					borderWidth: 1,
					borderRadius: 12,
					paddingHorizontal: 16,
					paddingVertical: 12,
					fontSize: 16,
					color: "#374151",
					borderColor: error ? "#ef4444" : "#e5e7eb",
				}}
				placeholderTextColor='#9CA3AF'
				{...inputProps}
			/>
			{error && (
				<Text style={{color: "#ef4444", fontSize: 14, marginTop: 4}}>
					{error}
				</Text>
			)}
		</View>
	);
};

export default FormField;
