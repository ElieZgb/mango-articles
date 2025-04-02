import type { Article } from "@node_modules/.prisma/client";

export const getTotalLikes = (articles: Article[]) => {
	return articles.reduce(
		(accumulator, article) => accumulator + article.likes_count,
		0
	);
};
