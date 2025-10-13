import { View, Text, Image } from "react-native";
const CustomLogo = () => {
	return (
		<View className="flex-row items-center gap-3 justify-center pt-32 pb-8">
			<View className="h-[72px] w-[72px]">
				<Image
					source={require("@/assets/images/talendy.png")}
					className="object-contain w-full h-full"
				/>
			</View>

			<Text className="text-5xl text-black">Talendy</Text>
		</View>
	);
};

export default CustomLogo;
