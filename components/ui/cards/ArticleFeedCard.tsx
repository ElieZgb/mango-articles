"use client";
import { formatTimeAgo } from "@lib/dateFormat";
import type { User } from "@node_modules/.prisma/client";
import Image from "@node_modules/next/image";
import React from "react";
import ProfilePlaceholder from "@public/assets/images/profile-placeholder.png";
import Link from "@node_modules/next/link";

interface ArticleFeedCardProps {
	title: string;
	content: string;
	likes: number;
	updatedAt: Date;
	author: User;
	image: string | null;
	slug: string;
}

export default function ArticleFeedCard({
	title,
	author,
	content,
	likes,
	updatedAt,
	image,
	slug,
}: ArticleFeedCardProps) {
	return (
		<div className="mb-5 flex max-w-[1000px] relative rounded-lg overflow-hidden bg-white shadow-lg">
			{/* <div className="mb-5 flex max-w-[1000px] relative rounded-lg overflow-hidden bg-white border-black border-[1px]"> */}
			<div className="flex-1 p-8 relative z-10 bg-mango/87">
				<div className={`flex w-full items-center gap-2`}>
					<div className="aspect-square w-7 flex-shrink-0 relative">
						<Image
							src={author.image || ProfilePlaceholder}
							alt="Author"
							fill={true}
							className="rounded-full object-cover"
						/>
					</div>
					<h3 className={`text-sm text-gray-800 pt-1`}>
						{author.name}
					</h3>
				</div>

				<Link href={`/article/${slug}`} className="py-3 block">
					<div className="">
						<h3 className="mb-2 text-2xl font-display-bold text-gray-800 line-clamp-2">
							{title}
						</h3>
						<p className="text-sm text-gray-800">
							{content.slice(0, 200)}...
						</p>
					</div>
				</Link>

				<div className="flex items-center gap-4 text-sm text-gray-700">
					<span>{formatTimeAgo(updatedAt)}</span>{" "}
					<span>❤️ {likes}</span>
				</div>
			</div>
			<div className="w-full h-full rounded-lg absolute left-0 top-0 z-0">
				<Image
					src={image!}
					alt="Article image preview"
					fill={true}
					className="object-cover rounded-lg"
				/>
			</div>
		</div>
	);
}
