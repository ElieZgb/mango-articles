"use client";
import ArticleFeedCard from "@components/ui/cards/ArticleFeedCard";
import ArticleFeedCardSkeleton from "@components/ui/cards/ArticleFeedCardSkeleton";
import { fetchArticles } from "@app/lib/fetchArticles";
import { slugify } from "@app/lib/slugify";
import type { ArticleBlock, User } from "@node_modules/@prisma/client";
import { useQuery } from "@node_modules/@tanstack/react-query";
import React from "react";

export interface DataState {
	id: string;
	likes_count: number;
	title: string;
	published: boolean;
	author: User;
	authorId: string;
	blocks: ArticleBlock[];
	createdAt: Date;
	updatedAt: Date;
}

export default function Page() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["articles"],
		queryFn: fetchArticles,
		staleTime: 1000 * 60 * 5, // Cache for 5 minutes
	});

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	if (isLoading) {
		return (
			<div className="px-8 py-5">
				<ArticleFeedCardSkeleton index={0} />
				<ArticleFeedCardSkeleton index={300} />
				<ArticleFeedCardSkeleton index={600} />
			</div>
		);
	}

	return (
		<div className="px-8 py-5">
			{data.total_articles?.map((article: DataState, index: number) => {
				const title =
					article.blocks.find((block) => block.type == "title")
						?.textValue || "Title";

				return (
					<ArticleFeedCard
						key={index}
						content={
							article.blocks.find((block) => block.type == "text")
								?.textValue
						}
						likes={article.likes_count}
						updatedAt={article.updatedAt}
						title={title}
						author={article.author}
						header_image={
							article.blocks.find(
								(block) => block.type == "image"
							)?.imagePreview || ""
						}
						slug={slugify(title, article.id)}
					/>
				);
			})}
		</div>
	);
}
