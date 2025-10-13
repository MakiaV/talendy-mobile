import CustomButton from "@/app/components/CustomButton";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Image, Platform, Pressable, Text, View } from "react-native";
import Swiper from "react-native-swiper";
import { onboarding } from "../../constants";

const Onboarding = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const swiperRef = useRef<Swiper>(null);
	const isLastSlide = activeIndex === onboarding.length - 1;
	return (
		<>
			{Platform.OS === "web" ? (
				<View className="h-screen items-center justify-center">
					<Text>Onboarding Web</Text>
					<CustomButton
						title="Get Started"
						onPress={() => router.replace("/(auth)/sign-in")}
						className="mt-4 flex items-center shadow-xl shadow-neutral-400/70 justify-center p-3 bg-general-secondary  rounded-full"
					/>
				</View>
			) : (
				<View className="flex-1 bg-talendy-bg pt-20 ">
					<View className="w-full flex items-end">
						<Pressable
							onPress={() => {
								router.replace("/(auth)/sign-in");
							}}
							className="pr-5 w-fit"
						>
							<Text className="text-black font-PoppinsBold text-md border border-talendy-inputBorder px-4 py-1 rounded-full">
								Skip
							</Text>
						</Pressable>
					</View>
					<Swiper
						ref={swiperRef}
						loop={false}
						dot={
							<View className="w-[32px] h-[4px] mx-1 bg-talendy-inputBorder rounded-full" />
						}
						className="h-full"
						activeDot={
							activeIndex === 0 ? (
								<View className="w-[32px] h-[4px] mx-1 bg-talendy-secondary rounded-full" />
							) : activeIndex === 1 ? (
								<View className="w-[32px] h-[4px] mx-1 bg-talendy-primary rounded-full" />
							) : activeIndex === 2 ? (
								<View className="w-[32px] h-[4px] mx-1 bg-talendy-secondary rounded-full" />
							) : null
						}
						onIndexChanged={(index) => setActiveIndex(index)}
					>
						{onboarding.map((item, index) => (
							<View key={item.id} className="h-full">
								<Image
									source={item.image}
									resizeMode="contain"
									alt="element"
									className="w-[400px] h-[400px]"
								/>
								<View className="bg-white flex-1 items-center px-4 pt-10 mt-10 rounded-t-[34px]">
									<Text className="font-PoppinsBold text-[27px] text-talendy-text">
										{item.title}
									</Text>
									<Text className="font-PoppinsRegular text-[18px] mt-6 text-talendy-textLight text-center">
										{item.description}
									</Text>
								</View>
							</View>
						))}
					</Swiper>
					<View className=" bg-white px-5  w-full flex items-center justify-center pb-12 pt-4">
						<CustomButton
							title={isLastSlide ? "Get Started" : "Next"}
							onPress={() =>
								isLastSlide
									? router.replace("/(auth)/sign-in")
									: swiperRef.current?.scrollBy(1)
							}
						/>
					</View>
				</View>
			)}
		</>
	);
};

export default Onboarding;
