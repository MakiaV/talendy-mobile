import Feather from "@expo/vector-icons/Feather";
import Octicons from "@expo/vector-icons/Octicons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	View,
} from "react-native";

import { signUpSchema } from "@/schemas/signUpSchema";
import { useSignUp } from "@clerk/clerk-expo";
import Fontisto from "@expo/vector-icons/Fontisto";
import { Link, useRouter } from "expo-router";
import CustomButton from "../components/CustomButton";
import CustomInputField from "../components/CustomInputField";
import CustomLogo from "../components/CustomLogo";
import SignInWith from "../components/SignInWith";

const SignUp = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			firstName: "",
			lastName: "",
		},
	});

	const [showPassword, setShowPassword] = useState(false);
	const [onSubmitError, setOnSubmitError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const [form, setForm] = useState({
		email: "",
		password: "",
		firstName: "",
		lastName: "",
	});

	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState("");
	const [verificationCodeError, setVerificationCodeError] = useState("");

	const { isLoaded, signUp, setActive } = useSignUp();
	const router = useRouter();
	const onSubmit = async ({
		email,
		password,
		firstName,
		lastName,
	}: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
	}) => {
		setOnSubmitError("");
		if (!isLoaded) return;
		setIsLoading(true);

		// Start sign-up process using email and password provided
		try {
			await signUp.create({
				emailAddress: email,
				password,
				firstName,
				lastName,
			});

			// Send user an email with verification code
			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			});

			setForm({ email, password, firstName, lastName });

			// Set 'pendingVerification' to true to display second form
			// and capture OTP code
			setPendingVerification(true);
			setIsLoading(false);
		} catch (err) {
			console.log("Sign up error: ", err);
			setOnSubmitError(err.errors[0].message);
			setIsLoading(false);
		}
	};

	// Handle submission of verification form
	const onVerifyPress = async () => {
		if (!isLoaded) return;
		setVerificationCodeError("");
		setIsLoading(true);

		try {
			// Use the code the user provided to attempt verification
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code,
			});

			// If verification was completed, set the session to active
			// and redirect the user
			if (signUpAttempt.status === "complete") {
				try {
					// const response = await fetch("/(api)/user", {
					// 	method: "POST",
					// 	// headers: {
					// 	// 	"Content-Type": "application/json",
					// 	// 	"Access-Control-Allow-Origin": "*",
					// 	// 	"no-cors": "true",
					// 	// },
					// 	body: JSON.stringify({
					// 		email: form.email,
					// 		password: form.password,
					// 		clerkId: signUpAttempt.createdUserId,
					// 	}),
					// });

					// if (!response.ok) {
					// 	new Error(`HTTP error! status: ${response.status}`);
					// }

					const response = await fetch(
						`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/user/register`,
						// "http://localhost:5000/api/user/register",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Access-Control-Allow-Origin": "*",
								"no-cors": "true",
							},
							body: JSON.stringify({
								email: form.email,
								password: form.password,
								clerkId: signUpAttempt.createdUserId,
								firstName: form.firstName,
								lastName: form.lastName,
							}),
						}
					);

					if (!response.ok) {
						new Error(`HTTP error! status: ${response.status}`);
					}
					// console.log("User created:", await response.json());

					// Set session to active
					await setActive({
						session: signUpAttempt.createdSessionId,
					});
					router.replace("/");
					return new Response(JSON.stringify({ data: response }), {
						status: 201,
					});
					// return await response.json();
				} catch (error) {
					console.error("Fetch error:", error);
					throw error;
				}
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				console.error(JSON.stringify(signUpAttempt, null, 2));
			}
			setIsLoading(false);
		} catch (err) {
			setVerificationCodeError(err.errors[0].message);
			setIsLoading(false);

			// console.error(JSON.stringify(err, null, 2));
		}
	};

	if (pendingVerification) {
		return (
			<View className="flex-1 bg-talendy-bg p-5 justify-center">
				<Text className="text-3xl text-talendy-secondary font-PoppinsBold text-center">
					A verification code has been sent to your email
				</Text>

				<View className="">
					<Text className="text-talendy-text text-center font-PoppinsBold text-2xl mb-4 mt-8">
						Verify your email
					</Text>
					<CustomInputField
						errors={errors}
						control={control}
						name="code"
						value={code}
						placeholder="Enter your verification code"
						onChangeText={(code) => setCode(code)}
						className=""
						autoCapitalize="none"
						icon={
							<Octicons
								name="unverified"
								size={22}
								color="gray"
							/>
						}
					/>
					{/* <TextInput
						value={code}
						placeholder="Enter your verification code"
						onChangeText={(code) => setCode(code)}
						className="rounded-[14px] pl-[45px]  py-6 border border-neutral-300 text-[18px] focus:border focus:border-talendy-secondary"
						autoCapitalize="none"
					/> */}
					{verificationCodeError && (
						<Text className="text-red-500 mb-4">
							{verificationCodeError}
						</Text>
					)}

					{/* <Button title="Verify" onPress={onVerifyPress}  /> */}
					<CustomButton
						title="Verify"
						onPress={onVerifyPress}
						className="mt-2"
						activityIndicator={
							isLoading ? (
								<ActivityIndicator size="small" color="white" />
							) : undefined
						}
					/>
				</View>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			className="bg-talendy-bg"
		>
			<CustomLogo />
			<View className="bg-white rounded-t-3xl px-5 grow h-full">
				<View className="py-8">
					<Text className="text-3xl font-PoppinsSemiBold font-bold text-talendy-text text-center">
						Create Your Account
					</Text>
					<Text className=" text-talendy-textLight text-xl  mt-2 text-center">
						Create an account to start your journey
					</Text>
				</View>

				<CustomInputField
					errors={errors}
					control={control}
					name="firstName"
					placeholder="First Name"
					icon={<Feather name="user" size={22} color="gray" />}
					autoCapitalize="none"
				/>
				<CustomInputField
					errors={errors}
					control={control}
					name="lastName"
					placeholder="Last Name"
					icon={<Feather name="user" size={22} color="gray" />}
					autoCapitalize="none"
				/>

				<CustomInputField
					errors={errors}
					control={control}
					name="email"
					placeholder="Email"
					icon={<Fontisto name="email" size={22} color="gray" />}
					autoCapitalize="none"
					keyboardType="email-address"
					textContentType="emailAddress"
					autoComplete="email"
				/>
				<CustomInputField
					errors={errors}
					control={control}
					name="password"
					placeholder="Password"
					secureTextEntry={!showPassword}
					icon={<Feather name="unlock" size={18} color="gray" />}
					iconRight={
						showPassword ? (
							<Pressable
								onPress={() => setShowPassword(!showPassword)}
							>
								<Octicons
									name="eye-closed"
									size={24}
									color="#8b5cf6"
								/>
							</Pressable>
						) : (
							<Pressable
								onPress={() => setShowPassword(!showPassword)}
							>
								<Octicons
									name="eye"
									size={24}
									color="#8b5cf6"
								/>
							</Pressable>
						)
					}
				/>
				{onSubmitError && (
					<Text className="text-red-500">{onSubmitError}</Text>
				)}

				<CustomButton
					title="Sign Up"
					onPress={handleSubmit(onSubmit)}
					className="mt-2"
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
					href="/sign-in"
					className="text-xl font-PoppinsBold text-center text-neutral-500 mt-5"
				>
					Already have an account? <Text className="">Log In</Text>
				</Link>
			</View>
		</KeyboardAvoidingView>
	);
};

export default SignUp;
