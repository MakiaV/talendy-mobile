import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Pressable, Text } from "react-native";

const SignOutButton = () => {
	// Use `useClerk()` to access the `signOut()` function
	const { signOut } = useClerk();
	const router = useRouter();

	const handleSignOut = async () => {
		try {
			await signOut();
			// Redirect to your desired page
			router.replace("/");
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	return (
		<Pressable
			onPress={handleSignOut}
			className="border border-gray-400 px-4 py-1 rounded-[10px] w-1/4 mx-auto my-4"
		>
			<Text className="text-red-600 text-center">Sign Out</Text>
		</Pressable>
	);
};

export default SignOutButton;
