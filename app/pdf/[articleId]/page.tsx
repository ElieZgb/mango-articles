"use client";
import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ArticlePDF from "@components/pdf/ArticlePDF";
import { useParams } from "@node_modules/next/navigation";
import { Article, ArticleBlock, User } from "@node_modules/.prisma/client";
import LoadingIcon from "@public/assets/icons/loading-icon.gif";
import Image from "@node_modules/next/image";

export default function Page() {
	const { articleId } = useParams();
	const [article, setArticle] = useState<Article | null>(null);
	const [author, setAuthor] = useState<User | null>(null);
	const [blocks, setBlocks] = useState<ArticleBlock[] | null>(null);

	useEffect(() => {
		const fetchArticle = async () => {
			const response = await fetch(`/api/articles/${articleId}`);
			const data = await response.json();
			console.log(data);
			setArticle(data);
			setAuthor(data.author);
			setBlocks(data.blocks);
		};

		fetchArticle();
	}, [articleId]);

	if (!article || !blocks || !author)
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
		<div className="h-[85vh]">
			<PDFViewer className="h-full w-full">
				<ArticlePDF
					article={article}
					author={author}
					blocks={blocks}
					title={
						blocks.find(
							(b: Partial<ArticleBlock>) => b.type === "title"
						)?.textValue || "Title"
					}
				/>
			</PDFViewer>
		</div>
	);
}
