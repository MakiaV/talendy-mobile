import SignOutButton from "@/app/components/SignOutButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import WhoAreYou from "../components/user/WhoAreYou";

const HomePage = () => {
	const { user, isLoaded } = useUser();
	const router = useRouter();

	useEffect(() => {
		const getData = async () => {
			try {
				const value = await AsyncStorage.getItem("role");
				// console.log("value", value);

				if (value !== "" && isLoaded) {
					// value previously stored
					if (value === "APPLICANT") {
						router.replace("/applicant");
					} else if (value === "RECRUITER") {
						router.replace("/company");
					}
				}
			} catch (e) {
				// error reading value
				console.log("error", e);
			}
		};
		getData();
	}, [isLoaded, router]);

	return (
		<View className="p-5">
			<SignedIn>
				<View>
					<Text className="font-PoppinsBold text-xl text-center text-talendy-secondary">
						Hello {user?.firstName}
					</Text>
					<SignOutButton />
				</View>
				<WhoAreYou />
			</SignedIn>
			<SignedOut>
				<View className="">
					<Link href="/(auth)/sign-in">
						<Text className="text-4xl text-blue-600">Sign in</Text>
					</Link>
					<Link href="/(auth)/sign-up">
						<Text>Sign up</Text>
					</Link>
				</View>
			</SignedOut>
		</View>
	);
};

export default HomePage;
