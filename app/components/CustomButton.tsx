import { ComponentProps, ReactNode } from "react";
import { Pressable, Text } from "react-native";

type Props = {
	title: string;
	className?: string;
	icon?: ReactNode;
	activityIndicator?: ReactNode;
} & ComponentProps<typeof Pressable>;
const CustomButton = ({
	title,
	className,
	icon,
	activityIndicator,
	...pressableProps
}: Props) => {
	return (
		<Pressable
			className={`${className} w-full h-[56px] flex-row items-center  justify-center gap-2 p-2  bg-talendy-secondary rounded-[16px]`}
			{...pressableProps}
		>
			{icon && icon}
			<Text className="text-white font-PoppinsBold text-[18px]">
				{title}
			</Text>
			{activityIndicator && activityIndicator}
		</Pressable>
	);
};

export default CustomButton;
