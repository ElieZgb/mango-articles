export const isValidURL = (str: string) => {
	try {
		const url = new URL(str);
		return url.protocol === "http:" || url.protocol === "https:";
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (e) {
		return false;
	}
};
