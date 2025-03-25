import { z } from "zod";

export const signUpSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	confirm_password: z
		.string()
		.min(8, "Password must be at least 8 characters"),
	name: z.string().min(3, "Minimum 3 letters"),
	username: z.string().min(3, "Minimum 3 letters"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
