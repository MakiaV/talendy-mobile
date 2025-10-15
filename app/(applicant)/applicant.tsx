import { useUser } from "@clerk/clerk-expo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Text, View } from "react-native";
import CustomButton from "../components/CustomButton";
import CustomInputField from "../components/CustomInputField";
import SignOutButton from "../components/SignOutButton";

const applicantSchema = z.object({
	fullname: z.string().min(2).max(100),
	email: z.email({ message: "Invalid email address." }),
	location: z.string().min(2).max(100),
	cv: z.string().min(2).max(100),
});

const ApplicantPage = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(applicantSchema),
		defaultValues: {
			fullname: "",
			location: "",
			cv: "",
		},
	});
	const { user } = useUser();
	const router = useRouter();

	// console.log("user", user);

	return (
		<View className="p-5">
			<SignOutButton />

			<Text className="text-xl font-PoppinsBold my-2 mb-10 text-center">
				Create your applicant account
			</Text>

			<CustomInputField
				errors={errors}
				control={control}
				name="fullname"
				placeholder="Enter your full name"
				className=""
				autoCapitalize="none"
				icon={<Feather name="user" size={22} color="gray" />}
			/>
			<CustomInputField
				errors={errors}
				control={control}
				name="location"
				placeholder="Location"
				className=""
				autoCapitalize="none"
				icon={
					<Ionicons name="location-outline" size={22} color="gray" />
				}
			/>
			<CustomButton
				title="Upload CV"
				className="bg-gray-300 border-dashed border-talendy-secondary border-2 text-talendy-secondary"
			/>

			<CustomButton title="Create Account" className="mt-20" />
		</View>
	);
};

export default ApplicantPage;
