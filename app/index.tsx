import { useAuth, useUser } from "@clerk/clerk-expo";
import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";

const Index = () => {
	const { user, isLoaded } = useUser();
	const router = useRouter();
	const { isSignedIn } = useAuth();

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

				if (data?.role === "APPLICANT") {
					router.replace("/applicant");
				} else if (data?.role === "RECRUITER") {
					router.replace("/company");
				} else if (isSignedIn) {
					router.replace("/(home)/home");
				}

				// console.log("✅ Utilisateur synchronisé :", data);
			} catch (error) {
				console.error("Erreur de sync:", error);
			}
		};

		getBackendUser();
	}, [isLoaded, user, isSignedIn]);

	// if (isSignedIn) return <Redirect href="/(home)/home" />;

	return <Redirect href="/(auth)/welcome" />;
};

export default Index;
