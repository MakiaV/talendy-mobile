import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import CustomButton from "../CustomButton";

type Role = "APPLICANT" | "RECRUITER" | null;

const WhoAreYou = () => {
	const { user, isLoaded } = useUser();
	// const { getToken } = useAuth();
	// console.log("user in WhoAreYou", user?.firstName, user?.lastName);
	const [role, setRole] = useState<Role>(null);
	const [backendUser, setBackendUser] = useState<any>();
	// console.log("backendUser in WhoAreYou", backendUser);
	// console.log("role", role);

	const router = useRouter();

	useEffect(() => {
		const getBackendUser = async () => {
			if (!isLoaded || !user) return;

			try {
				// const token = await getToken();
				const clerkUserId = user?.id;

				const res = await fetch(
					`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/${clerkUserId}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Access-Control-Allow-Origin": "*",
							"no-cors": "true",
						},
					}
				);

				if (!res.ok)
					throw new Error(
						"Erreur de synchronisation avec le backend"
					);

				const data = await res.json();
				setBackendUser(data);
				// console.log("✅ Utilisateur synchronisé :", data);
			} catch (error) {
				console.error("Erreur de sync:", error);
			}
		};

		getBackendUser();
	}, [isLoaded, user]);

	const selectApplicant = async () => {
		setRole("APPLICANT");
	};

	const selectRecruiter = async () => {
		setRole("RECRUITER");
	};

	const handleSubmit = async () => {
		console.log("role submit", role);
		if (!role || !user || !backendUser) return;
		// router.push("/applicant");
		try {
			// const token = await getToken();
			const clerkUserId = user?.id;
			const updatedUser = { ...backendUser, role: role };
			console.log("updatedUser", updatedUser);

			const res = await fetch(
				`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/${clerkUserId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*",
						"no-cors": "true",
					},
					body: JSON.stringify({ ...updatedUser }),
				}
			);

			if (!res.ok)
				throw new Error("Erreur de synchronisation avec le backend");

			const data = await res.json();
			setBackendUser(data);
			// console.log("✅ Utilisateur synchronisé :", data);

			if (role === "APPLICANT") {
				router.push("/applicant");
			} else if (role === "RECRUITER") {
				router.push("/company");
			}
		} catch (error) {
			console.error("Erreur de sync:", error);
		}
	};

	return (
		<View className="h-full">
			<Text className="text-4xl font-PoppinsBold text-center">
				Who are you ?
			</Text>
			<View>
				<Pressable
					className={
						role === "APPLICANT"
							? "border-2 border-talendy-primary rounded-[10px] p-5 items-center space-y-2 mt-10 bg-white"
							: "rounded-[10px] p-5 items-center space-y-2 mt-10 bg-white"
					}
					onPress={selectApplicant}
				>
					<Image
						source={require("@/assets/images/applicant.png")}
						resizeMode="contain"
						className="w-[150px] h-[150px]"
					/>
					<Text className="text-[23px] font-PoppinsBold">
						Applicant
					</Text>
				</Pressable>
				<Pressable
					className={
						role === "RECRUITER"
							? "border-2 border-talendy-primary rounded-[10px] p-5 items-center space-y-2 mt-10 bg-white"
							: "rounded-[10px] p-5 items-center space-y-2 mt-10 bg-white"
					}
					onPress={selectRecruiter}
				>
					<Image
						source={require("@/assets/images/company.png")}
						resizeMode="contain"
						className="w-[150px] h-[150px]"
					/>
					<Text className="text-[23px] font-PoppinsBold">
						Recruiter
					</Text>
				</Pressable>
			</View>

			{role ? (
				role === "APPLICANT" ? (
					<CustomButton
						title="Next"
						className="mt-10"
						onPress={handleSubmit}
					/>
				) : role === "RECRUITER" ? (
					<CustomButton
						title="Next"
						className="mt-10"
						onPress={handleSubmit}
					/>
				) : null
			) : (
				<CustomButton title="Next" className="bg-gray-300 mt-10" />
			)}
		</View>
	);
};

export default WhoAreYou;
