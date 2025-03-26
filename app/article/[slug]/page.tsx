"use client";
import { deslugify } from "@lib/slugify";
import type { Article, User } from "@node_modules/@prisma/client";
import { useParams } from "@node_modules/next/navigation";
import React, { useEffect, useState } from "react";
import ArticleHeader from "@components/article/ArticleHeader";
import ArticleBody from "@components/article/ArticleBody";
import AuthorSideBar from "@components/article/AuthorSideBar";
import LoadingIcon from "@public/assets/icons/loading-icon.gif";
import Image from "@node_modules/next/image";

type ArticleWithAuthor = Article & { author: User };

export default function Page() {
	const { slug } = useParams();
	const [article, setArticle] = useState<ArticleWithAuthor | null>(null);

	useEffect(() => {
		const { id } = deslugify(slug as string);

		const fetchArticle = async () => {
			const res = await fetch(`/api/articles/${id}`);
			if (!res.ok) return;
			const data = await res.json();
			setArticle(data);
		};

		fetchArticle();
	}, [slug]);

	if (!article)
		return (
			<div className="h-screen">
				<div className="w-12 mx-auto mt-[30vh] aspect-square relative">
					<Image
						src={LoadingIcon}
						fill={true}
						alt="Loading"
						className="object-contain"
					/>
				</div>
			</div>
		);

	return (
		<div className="flex justify-center">
			<div className="flex max-w-[1200px] mx-16 py-11 min-h-screen gap-5">
				<AuthorSideBar author={article.author} />
				<div className="flex-1">
					<ArticleHeader
						author={article.author}
						title={article.title}
						likes={article.likes_count}
						updatedAt={article.updatedAt}
						articleID={article.id}
					/>

					<ArticleBody
						content={article.content}
						header_image={article.header_image}
					/>
				</div>
			</div>
		</div>
	);
}
