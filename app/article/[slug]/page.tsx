"use client";
import { deslugify } from "@app/lib/slugify";
import type { Article, ArticleBlock, User } from "@node_modules/@prisma/client";
import { useParams } from "@node_modules/next/navigation";
import React, { useEffect, useState } from "react";
import ArticleHeader from "@components/article/ArticleHeader";
import ArticleBody from "@components/article/ArticleBody";
import AuthorSideBar from "@components/article/AuthorSideBar";
import LoadingIcon from "@public/assets/icons/loading-icon.gif";
import Image from "@node_modules/next/image";

export type ArticleType = Article & { author: User; blocks: ArticleBlock[] };

export default function Page() {
	const { slug } = useParams();
	const [article, setArticle] = useState<ArticleType | null>(null);
	const [articleTitle, setArticleTitle] = useState<string | null>(null);
	// const [imagePreview, setImagePreview] = useState<string | null>(null);

	useEffect(() => {
		const { id } = deslugify(slug as string);

		const fetchArticle = async () => {
			const res = await fetch(`/api/articles/${id}`);
			if (!res.ok) return;
			const data = await res.json();
			setArticle(data);
			const title =
				data.blocks.find((b: ArticleBlock) => b.type === "title")
					?.textValue || "Title";
			setArticleTitle(title);
			// const img = data.blocks.find(
			// 	(b: ArticleBlock) => b.type === "image"
			// )?.imagePreview;
			// setImagePreview(img);
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
			<div className="flex max-w-[1200px] w-full mx-16 max-[500px]:mx-7 py-11 max-[500px]:py-7 min-h-screen gap-5">
				<AuthorSideBar author={article.author} />
				<div className="flex-1 min-w-[600px] max-[800px]:min-w-[unset]">
					<ArticleHeader
						article={article}
						author={article.author}
						title={articleTitle || "Title"}
						likes={article.likes_count}
						updatedAt={article.updatedAt}
						articleID={article.id}
					/>

					<ArticleBody
						blocks={article.blocks}
						// imagePreview={imagePreview}
					/>
				</div>
			</div>
		</div>
	);
}
