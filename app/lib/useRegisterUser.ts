import { useMutation } from "@node_modules/@tanstack/react-query";
import { signIn } from "next-auth/react";

export const useRegisterUser = () => {
	return useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				body: JSON.stringify(data),
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok)
				throw new Error(`Something went wrong: ${res.statusText}`);

			return res.json();
		},
		onSuccess: async (signUpInfo, variables) => {
			await signIn("credentials", {
				email: variables.email,
				password: variables.password,
				redirect: false,
			});
		},
		onError: (error) => {
			console.error("Error signing up:", error);
		},
	});
};
