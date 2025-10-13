import SignOutButton from "@/app/components/SignOutButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import WhoAreYou from "../components/user/WhoAreYou";

const HomePage = () => {
	const { user } = useUser();

	// console.log("user", user);

	return (
		<View className="p-5">
			<SignedIn>
				<View>
					<Text className="font-PoppinsBold text-xl text-center text-talendy-secondary">
						Hello {user?.emailAddresses[0].emailAddress}
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
