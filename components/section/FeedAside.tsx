"use client";
import React, { useEffect, useState } from "react";
import type { User } from "@node_modules/@prisma/client";
import AsideCard from "@components/ui/cards/AsideCard";
import AsideCardSkeleton from "@components/ui/cards/AsideCardSkeleton";
import { slugify } from "@lib/slugify";

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

export default function FeedAside() {
	const [data, setData] = useState<DataState[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchArticles = async () => {
			const result = await fetch("/api/articles");
			const data = await result.json();
			setData(data.popular_articles);
			setLoading(false);
		};

		if (!data) {
			fetchArticles();
		}
	}, []);

	if (loading) {
		return (
			<aside className="max-[900px]:hidden w-[30vw] min-w-[250px] max-w-[400px] border-l-[1px] border-black py-5 px-5">
				<h1 className="text-lg mb-2">Popular Articles</h1>
				<AsideCardSkeleton index={0} />
				<AsideCardSkeleton index={300} />
				<AsideCardSkeleton index={600} />
			</aside>
		);
	}

	return (
		<aside className="max-[900px]:hidden w-[30vw] min-w-[250px] max-w-[400px] border-l-[1px] border-black py-5 px-5">
			<h1 className="text-lg mb-2">Popular Articles</h1>
			{data?.map((article, index) => {
				return (
					<AsideCard
						key={index}
						title={article.title}
						content={article.content}
						likes_count={article.likes_count}
						updatedAt={article.updatedAt}
						author={article.author}
						slug={slugify(article.title, article.id)}
					/>
				);
			})}
		</aside>
	);
}
