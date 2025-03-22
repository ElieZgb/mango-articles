"use client";
import { ArticlesApiType } from "@app/api/articles/route";
import ArticleFeedCard from "@components/ui/cards/ArticleFeedCard";
import ArticleFeedCardSkeleton from "@components/ui/cards/ArticleFeedCardSkeleton";
import type { User } from "@node_modules/@prisma/client";
import React, { useEffect, useState } from "react";

interface DataState {
	title: string;
	id: string;
	content: string;
	header_image: string | null;
	likes_count: number;
	published: boolean;
	createdAt: Date;
	updatedAt: Date;
	author: User;
}

export default function page() {
	const [data, setData] = useState<DataState[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchArticles = async () => {
			const result = await fetch("/api/articles");
			const data = await result.json();
			setData(data.total_articles);
			setLoading(false);
		};

		if (!data) {
			fetchArticles();
		}
	}, []);

	if (loading) {
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
			{data?.map((article, index) => {
				return (
					<ArticleFeedCard
						key={index}
						content={article.content}
						likes={article.likes_count}
						updatedAt={article.updatedAt}
						title={article.title}
						author={article.author}
						image={article.header_image}
					/>
				);
			})}
		</div>
	);
}
