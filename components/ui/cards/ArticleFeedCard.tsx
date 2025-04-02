"use client";
import { formatTimeAgo } from "@app/lib/dateFormat";
import type { User } from "@node_modules/.prisma/client";
import Image from "@node_modules/next/image";
import React from "react";
import ProfilePlaceholder from "@public/assets/images/profile-placeholder.png";
import Link from "@node_modules/next/link";

export type ArticleFeedCardProps = Article & { blocks: ArticleBlock[] };

type Article = {
	id: string;
	likes_count: number;
	title: string;
	header_image: string;
	published: boolean;
	author: User;
	authorId: string;
	blocks: ArticleBlock[];
	createdAt: Date;
	updatedAt: Date;
};

type ArticleBlock = {
	id: string;
	type: ArticleBlockType;
	textValue?: string;
	className?: string;
	placeholder?: string;
	imageFile?: string;
	imagePreview?: string;
	createdAt: Date;
	updatedAt: Date;
	article: Article;
	articleId: string;
};

enum ArticleBlockType {
	TEXT = "text",
	TITLE = "title",
	IMAGE = "image",
	SEPARATOR = "separator",
	CODEBLOCK = "codeblock",
	VIDEOLINK = "videolink",
}

export default function ArticleFeedCard({
	title,
	author,
	likes,
	updatedAt,
	header_image,
	slug,
	content,
}: Partial<ArticleFeedCardProps> & {
	likes: number;
	slug: string;
	content: string | null | undefined;
}) {
	return (
		<div className="mb-5 flex max-w-[1000px] relative rounded-lg overflow-hidden bg-white shadow-lg">
			{/* <div className="mb-5 flex max-w-[1000px] relative rounded-lg overflow-hidden bg-white border-black border-[1px]"> */}
			<div className="flex-1 p-8 relative z-10 bg-mango/87">
				<div className={`flex w-full items-center gap-2`}>
					<div className="aspect-square w-7 flex-shrink-0 relative">
						<Image
							src={author?.image || ProfilePlaceholder}
							alt="Author"
							fill={true}
							className="rounded-full object-cover"
						/>
					</div>
					<Link
						href={`/${author?.username}`}
						className={`text-sm text-gray-800 pt-1 hover:underline`}
					>
						{author?.name}
					</Link>
				</div>

				<Link href={`/article/${slug}`} className="py-3 block group">
					<div className="">
						<h3 className="mb-2 text-2xl font-display-bold text-gray-800 line-clamp-2 group-hover:underline">
							{title}
						</h3>
						<p className="text-sm text-gray-800">
							{content && content.slice(0, 200)}...
						</p>
					</div>
				</Link>

				<div className="flex items-center gap-4 text-sm text-gray-700">
					{updatedAt && <span>{formatTimeAgo(updatedAt)}</span>}{" "}
					<span>❤️ {likes}</span>
				</div>
			</div>
			{header_image && (
				<div className="w-full h-full rounded-lg absolute left-0 top-0 z-0">
					<Image
						src={header_image}
						alt="Article image preview"
						fill={true}
						className="object-cover rounded-lg"
					/>
				</div>
			)}
		</div>
	);
}
