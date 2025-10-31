import React from "react";
import {Text, TextProps} from "react-native";

// Mock for @expo/vector-icons that returns a Text component
export const Ionicons = ({
	name,
	size,
	color,
	style,
}: {
	name: string;
	size?: number;
	color?: string;
	style?: any;
}) => {
	return React.createElement(
		Text,
		{
			style: [{color}, style],
		},
		`Icon:${name}`,
	);
};
