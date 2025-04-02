import { useQuery } from "@node_modules/@tanstack/react-query";
import { useRouter } from "@node_modules/next/navigation";

export const fetchUsers = async () => {
	const res = await fetch("/api/users");
	if (!res.ok) throw new Error("Failed to fetch users");
	return res.json();
};

export const useFetchUserByEmail = (userEmail: string | null) => {
	return useQuery({
		queryKey: ["userByEmail", userEmail],
		queryFn: async () => {
			if (!userEmail) return null;

			const res = await fetch(`/api/users?email=${userEmail}`);

			if (!res.ok) throw new Error("Failed to fetch user data");

			return res.json();
		},
		enabled: !!userEmail, // Only run the query if the userEmail is truthy
	});
};

export const useFetchUserByUsername = (username: string) => {
	const router = useRouter();

	return useQuery({
		queryKey: ["user", username],
		queryFn: async () => {
			const res = await fetch(`/api/users/${username}`);
			if (res.status !== 200) {
				router.push("/");
				throw new Error("Failed to fetch user");
			}

			return res.json();
		},
		enabled: !!username,
	});
};
