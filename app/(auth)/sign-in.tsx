import { zodResolver } from "@hookform/resolvers/zod";
import * as WebBrowser from "expo-web-browser";

import CustomLogo from "@/app/components/CustomLogo";

import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	View,
} from "react-native";

import CustomButton from "@/app/components/CustomButton";
import CustomInputField from "@/app/components/CustomInputField";
// import OAuth from "@/app/components/OAuth";

import { signInSchema } from "@/schemas/signInSchema";
import { useSignIn } from "@clerk/clerk-expo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import Octicons from "@expo/vector-icons/Octicons";
import SignInWith from "../components/SignInWith";

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

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
	useWarmUpBrowser();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");

	const router = useRouter();
	const { signIn, setActive, isLoaded } = useSignIn();

	const onSubmit = async ({
		email,
		password,
	}: {
		email: string;
		password: string;
	}) => {
		if (!isLoaded) return;
		setIsLoading(true);

		// Start the sign-in process using the email and password provided
		try {
			const signInAttempt = await signIn.create({
				identifier: email,
				password,
			});

			// If sign-in process is complete, set the created session as active
			// and redirect the user
			if (signInAttempt.status === "complete") {
				await setActive({
					session: signInAttempt.createdSessionId,
				});
				router.replace("/");
			} else {
				// If the status isn't complete, check why. User might need to
				// complete further steps.
				console.error(JSON.stringify(signInAttempt, null, 2));
			}

			setIsLoading(false);
		} catch (err) {
			if (err instanceof Error && "errors" in err) {
				const errorObj = err as { errors: { message: string }[] };
				setError(errorObj.errors[0].message);
			} else {
				setError("An error occurred. Please try again.");
			}
			setIsLoading(false);
		}
	};

	return (
		<KeyboardAvoidingView className="bg-talendy-bg">
			<CustomLogo />
			<View className="bg-white rounded-t-3xl px-5 grow h-full">
				<View className="py-8">
					<Text className="text-3xl font-PoppinsSemiBold font-bold text-talendy-text">
						Welcome Back 👋
					</Text>
					<Text className=" text-talendy-textLight text-xl  mt-2">
						Login to continue your journey
					</Text>
				</View>
				<CustomInputField
					errors={errors}
					control={control}
					label="Email"
					name="email"
					placeholder="Email"
					className=""
					icon={<Fontisto name="email" size={22} color="gray" />}
					autoCapitalize="none"
					keyboardType="email-address"
					textContentType="emailAddress"
					autoComplete="email"
				/>
				<CustomInputField
					errors={errors}
					control={control}
					label="Password"
					name="password"
					placeholder="Password"
					className=""
					secureTextEntry={!showPassword}
					icon={<AntDesign name="lock" size={22} color="gray" />}
					iconRight={
						showPassword ? (
							<Pressable
								onPress={() => setShowPassword(!showPassword)}
							>
								<Octicons
									name="eye-closed"
									size={22}
									color="#8b5cf6"
								/>
							</Pressable>
						) : (
							<Pressable
								onPress={() => setShowPassword(!showPassword)}
							>
								<Octicons
									name="eye"
									size={22}
									color="#8b5cf6"
								/>
							</Pressable>
						)
					}
				/>
				{error && (
					<Text className="text-red-500 text-center mt-2">
						{error}
					</Text>
				)}

				<View>
					<Text className="text-right text-xl text-talendy-secondary font-bold">
						Forget password?
					</Text>
				</View>

				<CustomButton
					title="Log In"
					onPress={handleSubmit(onSubmit)}
					className="mt-5"
					activityIndicator={
						isLoading ? (
							<ActivityIndicator size="small" color="white" />
						) : undefined
					}
				/>

				<View>
					<Text className="text-center text-xl text-talendy-textLight my-4">
						Or continue with
					</Text>
					<View className="flex-row justify-evenly">
						<SignInWith strategy="oauth_google" />

						<SignInWith strategy="oauth_facebook" />
						{/* <Pressable
							onPress={onPressGoogle}
							className="border w-[55px] h-[55px] rounded-[10px] border-talendy-inputBorder p-4 flex items-center justify-center self-center"
						>
							<Image
								source={require("@/assets/images/google.png")}
								className="object-contain h-[40px] w-[40px]"
							/>
						</Pressable>
						<Pressable
							onPress={onPressLinkedin}
							className="border w-[55px] h-[55px] rounded-[10px] border-talendy-inputBorder p-4 flex items-center justify-center self-center"
						>
							<Image
								source={require("@/assets/images/linkedin.png")}
								className="object-contain h-[40px] w-[40px]"
							/>
						</Pressable>
						<Pressable
							onPress={onPressFacebook}
							className="border w-[55px] h-[55px] rounded-[10px] border-talendy-inputBorder p-4 flex items-center justify-center self-center"
						>
							<Image
								source={require("@/assets/images/facebook.png")}
								className="object-contain h-[40px] w-[40px]"
							/>
						</Pressable> */}
					</View>
				</View>

				<Link
					href="/sign-up"
					className="text-neutral-500 text-center text-xl font-PoppinsBold mt-5"
				>
					Don&apos;t have an account?{" "}
					<Text className="">Sign Up</Text>
				</Link>
			</View>
		</KeyboardAvoidingView>
	);
};

export default SignIn;
