import React from "react";
import {View, Text, TextInput, TouchableOpacity} from "react-native";

type PinInputProps = {
	createMode?: boolean;
	newPin?: string;
	confirmPin?: string;
	pin?: string;
	error?: string | null;
	onChangeNewPin?: (s: string) => void;
	onChangeConfirmPin?: (s: string) => void;
	onChangePin?: (s: string) => void;
	onSavePin?: () => void;
	onVerifyPin?: () => void;
	onClear?: () => void;
};

export const PinInput: React.FC<PinInputProps> = ({
	createMode = false,
	newPin = "",
	confirmPin = "",
	pin = "",
	error = null,
	onChangeNewPin,
	onChangeConfirmPin,
	onChangePin,
	onSavePin,
	onVerifyPin,
	onClear,
}) => {
	if (createMode) {
		return (
			<View className='w-full max-w-[360px] bg-white rounded-lg p-[16px] mb-[24px]'>
				<Text className='font-semibold text-[16px] mb-[8px]'>
					Create Admin PIN
				</Text>
				<Text className='text-[13px] text-gray-600 mb-[8px]'>
					This PIN is required as admin fallback.
				</Text>
				<TextInput
					className='border border-gray-200 rounded px-[12px] py-[8px] mb-[8px]'
					placeholder='Enter PIN (min 4 digits)'
					placeholderTextColor='#9CA3AF'
					value={newPin}
					onChangeText={onChangeNewPin}
					keyboardType='numeric'
					secureTextEntry
					maxLength={10}
				/>
				<TextInput
					className='border border-gray-200 rounded px-[12px] py-[8px] mb-[12px]'
					placeholder='Confirm PIN'
					placeholderTextColor='#9CA3AF'
					value={confirmPin}
					onChangeText={onChangeConfirmPin}
					keyboardType='numeric'
					secureTextEntry
					maxLength={10}
				/>
				{error && <Text className='text-red-500 mb-[8px]'>{error}</Text>}
				<View className='flex-row gap-[8px]'>
					<TouchableOpacity
						className='flex-1 bg-gray-100 rounded py-[12px] items-center'
						onPress={onClear}
					>
						<Text>Clear</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className='flex-1 bg-indigo-500 rounded py-[12px] items-center'
						onPress={onSavePin}
					>
						<Text className='text-white'>Save PIN</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View className='mt-[20px] w-full items-center'>
			<View className='bg-white rounded-lg p-[16px] w-full max-w-[320px]'>
				<Text className='text-center font-semibold mb-[8px]'>Enter PIN</Text>
				<TextInput
					className='border border-gray-200 rounded px-[12px] py-[8px] mb-[12px]'
					placeholder='PIN'
					placeholderTextColor='#9CA3AF'
					value={pin}
					onChangeText={onChangePin}
					keyboardType='numeric'
					secureTextEntry
					maxLength={10}
				/>
				{error && <Text className='text-red-500 mb-[8px]'>{error}</Text>}
				<View className='flex-row justify-between'>
					<TouchableOpacity
						className='px-[12px] py-[10px] bg-indigo-500 rounded flex-1 items-center'
						onPress={onVerifyPin}
					>
						<Text className='text-white'>Verify</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default PinInput;
