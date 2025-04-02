import { useMutation } from "@node_modules/@tanstack/react-query";

export const useUpdateUser = () => {
	return useMutation({
		mutationFn: async ({
			username,
			nameInput,
			bioInput,
			newImageURL,
		}: {
			username: string;
			nameInput: string | null;
			bioInput: string | null;
			newImageURL: string | null;
		}) => {
			const res = await fetch(`/api/users/${username}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: nameInput,
					bio: bioInput,
					image: newImageURL,
				}),
			});

			if (!res.ok) throw new Error("Failed to update user");

			return res.json();
		},
		onSuccess: (data) => {
			// Handle the success state, maybe show a success message or update cache
			console.log("User updated successfully:", data);
		},
		onError: (error) => {
			// Handle the error state, maybe show an error message
			console.error("Error updating user:", error);
		},
	});
};
