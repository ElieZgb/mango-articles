export const slugify = (text: string, id: string): string => {
	return text
		.toLowerCase() // Convert to lowercase
		.normalize("NFD") // Normalize accents (é → e)
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.replace(/[^a-z0-9\s-]/g, "") // Remove special characters (except spaces and hyphens)
		.trim() // Remove extra spaces
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Remove duplicate hyphens
		.concat(`-${id}`);
};

export const deslugify = (slug: string): { title: string; id: string } => {
	const match = slug.match(
		/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/
	);

	if (!match) {
		throw new Error("Invalid slug format. No UUID found.");
	}

	const id = match[0]; // Extract UUID
	const title = slug.replace(`-${id}`, ""); // Remove UUID from the title

	return { title, id };
};
