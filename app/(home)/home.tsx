import SignOutButton from "@/app/components/SignOutButton";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, View } from "react-native";
import WhoAreYou from "../components/user/WhoAreYou";

const HomePage = () => {
	const { user, isLoaded } = useUser();
	const router = useRouter();

	// const [backendUser, setBackendUser] = useState<any>();

	// // console.log("user in Home", user);
	// console.log("backendUser in Home", backendUser);

	// useEffect(() => {
	// 	const getBackendUser = async () => {
	// 		if (!isLoaded || !user) return;

	// 		try {
	// 			// const token = await getToken();
	// 			const clerkUserId = user?.id;

	// 			const res = await fetch(
	// 				`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/${clerkUserId}`,
	// 				{
	// 					method: "GET",
	// 					headers: {
	// 						"Content-Type": "application/json",
	// 						"Access-Control-Allow-Origin": "*",
	// 						"no-cors": "true",
	// 					},
	// 				}
	// 			);

	// 			if (!res.ok)
	// 				throw new Error(
	// 					"Erreur de synchronisation avec le backend"
	// 				);

	// 			const data = await res.json();
	// 			if (data?.role === "APPLICANT") {
	// 				router.push("/applicant");
	// 			} else if (data?.role === "RECRUITER") {
	// 				router.push("/company");
	// 			}
	// 			setBackendUser(data);
	// 			// console.log("✅ Utilisateur synchronisé :", data);
	// 		} catch (error) {
	// 			console.error("Erreur de sync:", error);
	// 		}
	// 	};

	// 	getBackendUser();
	// }, [isLoaded, user]);

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
