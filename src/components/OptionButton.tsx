import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type OptionButtonProps = {
  selected: boolean;
  label: string;
  onPress: () => void;
};

export const OptionButton: React.FC<OptionButtonProps> = ({ selected, label, onPress }) => {
  return (
    <TouchableOpacity
      className={`px-[12px] py-[8px] rounded ${selected ? 'bg-indigo-50 border border-indigo-500' : 'bg-gray-100'}`}
      onPress={onPress}
    >
      <Text className={`${selected ? 'text-indigo-700' : 'text-gray-600'}`}>{label}</Text>
    </TouchableOpacity>
  );
};

export default OptionButton;