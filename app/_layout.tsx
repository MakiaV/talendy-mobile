import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../global.css";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Poppins: require("../assets/fonts/Poppins-Regular.ttf"),
		PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
	});

	const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

	if (!publishableKey) {
		throw new Error(
			"Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
		);
	}

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
			<ClerkLoaded>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="index" />
					<Stack.Screen name="(auth)" />
					<Stack.Screen name="(home)" />
				</Stack>
			</ClerkLoaded>
		</ClerkProvider>
	);

	// return (
	// 	<ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
	// 		<Slot />
	// 	</ClerkProvider>
	// );
}
