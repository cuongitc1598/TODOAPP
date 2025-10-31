import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type HeaderProps = {
  title: string;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
  icon?: string;
  light?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBack, 
  rightComponent = <View style={{ width: 40 }} />,
  icon = '←',
  light = true 
}) => {
  return (
    <View className="flex-row justify-between items-center px-[20px] pt-[10px] pb-[20px]">
      <TouchableOpacity 
        onPress={onBack} 
        className={`justify-center items-center rounded-[20px] w-[40px] h-[40px] ${light ? 'bg-white/20' : 'bg-gray-100'}`}
      >
        <Text className={`${light ? 'text-white' : 'text-gray-800'} font-bold text-[18px]`}>{icon}</Text>
      </TouchableOpacity>
      <Text className={`${light ? 'text-white' : 'text-gray-800'} font-medium text-[16px]`}>{title}</Text>
      {rightComponent}
    </View>
  );
};

export default Header;