export const isValidURL = (str: string) => {
	try {
		const url = new URL(str);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch (e) {
		return false;
	}
};
