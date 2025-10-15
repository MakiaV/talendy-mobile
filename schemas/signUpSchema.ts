import { z } from "zod";

export const signUpSchema = z.object({
	firstName: z
		.string()
		.min(1, { message: "First name is required" })
		.max(50, { message: "First name is too long" }),
	lastName: z
		.string()
		.min(1, { message: "Last name is required" })
		.max(50, { message: "Last name is too long" }),
	email: z.email({ message: "Invalid email address." }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters." })
		.max(50),
});
