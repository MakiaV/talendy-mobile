import { useAuth, useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect } from "react";

import { Image, Platform, Pressable } from "react-native";

export const useWarmUpBrowser = () => {
	useEffect(() => {
		if (Platform.OS !== "android") return;
		void WebBrowser.warmUpAsync();
		return () => {
			// Cleanup: closes browser when component unmounts
			void WebBrowser.coolDownAsync();
		};
	}, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

type SignInWithProps = {
	strategy: "oauth_google" | "oauth_facebook";
};

const strategyIcons = {
	oauth_google: require("@/assets/images/google.png"),
	oauth_facebook: require("@/assets/images/facebook.png"),
	// oauth_linkedin: require("@/assets/images/linkedin.png"),
};

export default function SignInWith({ strategy }: SignInWithProps) {
	useWarmUpBrowser();
	const router = useRouter();
	const { user, isLoaded } = useUser();
	const { getToken } = useAuth();
	console.log("user", user);

	// Use the `useSSO()` hook to access the `startSSOFlow()` method
	const { startSSOFlow } = useSSO();

	const onPress = useCallback(async () => {
		try {
			// Start the authentication process by calling `startSSOFlow()`
			const { createdSessionId, setActive, signIn, signUp } =
				await startSSOFlow({
					strategy,
					// For web, defaults to current path
					// For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
					// For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
					redirectUrl: AuthSession.makeRedirectUri(),
				});

			// If sign in was successful, set the active session
			if (createdSessionId) {
				setActive!({
					session: createdSessionId,
					// Check for session tasks and navigate to custom UI to help users resolve them
					// See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
					navigate: async ({ session }) => {
						if (session?.currentTask) {
							console.log(session?.currentTask);
							//   router.push('/sign-in/tasks')
							return;
						}

						router.push("/");
					},
				});
			} else {
				// If there is no `createdSessionId`,
				// there are missing requirements, such as MFA
				// Use the `signIn` or `signUp` returned from `startSSOFlow`
				// to handle next steps
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	}, []);

	// 3️⃣ Une fois connecté, synchroniser automatiquement avec le backend
	useEffect(() => {
		const syncUserWithBackend = async () => {
			if (!isLoaded || !user) return;

			try {
				const token = await getToken();
				const clerkUserId = user.id;

				const res = await fetch(
					`${process.env.BACKEND_URL}/api/user/sync`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({ clerkUserId }),
					}
				);

				if (!res.ok)
					throw new Error(
						"Erreur de synchronisation avec le backend"
					);

				const data = await res.json();
				console.log("✅ Utilisateur synchronisé :", data);
			} catch (error) {
				console.error("Erreur de sync:", error);
			}
		};

		syncUserWithBackend();
	}, [isLoaded, user]);

	return (
		<Pressable
			onPress={onPress}
			className="border w-[55px] h-[55px] rounded-[10px] border-talendy-inputBorder p-4 flex items-center justify-center self-center"
		>
			<Image
				source={strategyIcons[strategy]}
				className="object-contain h-[40px] w-[40px]"
				// resizeMode="contain"
			/>
		</Pressable>
	);
}
