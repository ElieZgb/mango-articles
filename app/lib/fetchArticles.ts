export const fetchArticles = async () => {
	const res = await fetch("/api/articles");
	if (!res.ok) throw new Error("Failed to fetch articles");
	return res.json();
};
