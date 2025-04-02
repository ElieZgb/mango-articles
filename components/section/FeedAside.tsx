"use client";
import React from "react";
import AsideCard from "@components/ui/cards/AsideCard";
import AsideCardSkeleton from "@components/ui/cards/AsideCardSkeleton";
import { slugify } from "@app/lib/slugify";
import { useQuery } from "@node_modules/@tanstack/react-query";
import { fetchArticles } from "@app/lib/fetchArticles";
import { Article, ArticleBlock, User } from "@node_modules/.prisma/client";

export default function FeedAside() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["articles"],
		queryFn: fetchArticles,
		staleTime: 1000 * 60 * 5,
	});

	if (isLoading) {
		return (
			<aside className="max-[900px]:hidden w-[30vw] min-w-[250px] max-w-[400px] border-l-[1px] border-black py-5 px-5">
				<h1 className="text-lg mb-2">Popular Articles</h1>
				<AsideCardSkeleton index={0} />
				<AsideCardSkeleton index={300} />
				<AsideCardSkeleton index={600} />
			</aside>
		);
	}

	if (error) {
		return <div className="text-red-500">Error fetching articles</div>;
	}

	return (
		<aside className="max-[900px]:hidden w-[30vw] min-w-[250px] max-w-[400px] border-l-[1px] border-black py-5 px-5">
			<h1 className="text-lg mb-2">Popular Articles</h1>
			{data.popular_articles?.map(
				(
					article: Article & { blocks: ArticleBlock[]; author: User },
					index: number
				) => {
					const title =
						article.blocks.find((block) => block.type == "title")
							?.textValue || "Title";

					console.log(article);
					return (
						<AsideCard
							key={index}
							title={title}
							content={
								article.blocks.find(
									(block) => block.type == "text"
								)?.textValue
							}
							likes={article.likes_count}
							updatedAt={article.updatedAt}
							author={article.author}
							slug={slugify(title, article.id)}
						/>
					);
				}
			)}
		</aside>
	);
}
