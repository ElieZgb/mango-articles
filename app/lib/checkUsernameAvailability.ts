export const checkUsernameAvailability = async (username: string) => {
	try {
		const res = await fetch(`/api/users/${username}`);

		if (res.status != 404) return false; // this means username is not available

		if (res.status === 404) {
			return true; // username is not created yet, we can create it.
		}

		return false;
	} catch (e) {
		console.log("error", e);
		return false;
	}
};
