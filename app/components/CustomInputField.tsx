import { Controller } from "react-hook-form";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TextInputProps,
	TouchableWithoutFeedback,
	View,
} from "react-native";

type Props = {
	errors: any;
	control: any;
	label?: string;
	name: string;
	className?: string;
	icon?: React.ReactNode;
	iconRight?: React.ReactNode;
} & TextInputProps;

const CustomInputField = ({
	errors,
	control,
	label,
	name,
	className,
	icon,
	iconRight,
	...props
}: Props) => {
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View className="my-1 w-full">
					{/* <Text
						className={
							errors && errors[name]
								? "text-red-500 mb-1 text-lg font-PoppinsBold"
								: "mb-1 text-lg font-PoppinsBold"
						}
					>
						{label}
					</Text> */}
					<Controller
						control={control}
						rules={{
							required: true,
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<View className="relative">
								{icon && (
									<View className="absolute top-[50%] translate-y-[-50%] left-4">
										{icon}
									</View>
								)}
								<TextInput
									className={`rounded-[14px] pl-[45px]  py-6 border border-neutral-300 text-[18px] ${className} focus:border focus:border-talendy-secondary`}
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
									{...props}
									autoCapitalize="none"
								/>
								{iconRight && (
									<View className="absolute top-[50%] translate-y-[-50%] right-4">
										{iconRight}
									</View>
								)}
							</View>
						)}
						name={name}
					/>
					{errors && errors[name] ? (
						<Text className="text-red-500 h-[15px]">
							{errors[name].message}
						</Text>
					) : (
						<Text className="h-[15px]"></Text>
					)}
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default CustomInputField;
