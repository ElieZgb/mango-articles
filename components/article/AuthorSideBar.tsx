"use client";
import type { Article, User } from "@node_modules/@prisma/client";
import Image from "@node_modules/next/image";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "@node_modules/next/link";
import { deslugify, slugify } from "@lib/slugify";
import { usePathname } from "@node_modules/next/navigation";
import ProfilePlaceholder from "@public/assets/images/profile-placeholder.png";

export default function AuthorSideBar({ author }: { author: User }) {
	const [authorArticles, setAuthorArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const pathname = usePathname();

	useEffect(() => {
		const fetchAuthorArticles = async () => {
			setLoading(true);
			const res = await fetch("/api/articles", {
				method: "POST",
				body: JSON.stringify({ authorId: author.id }),
			});

			const data = await res.json();
			const { id } = deslugify(pathname.split("/")[2]);
			setAuthorArticles(
				data.filter((article: Article) => article.id !== id)
			);
			setLoading(false);
		};

		fetchAuthorArticles();
	}, [author, pathname]);

	return (
		<div className="sticky top-22 self-start max-w-[200px] w-full">
			{/* author details  */}
			<div className="bg-white p-4 rounded-sm">
				<div className="flex items-center gap-[6px] mb-3 relative">
					<Link
						href={`/${author.username}`}
						className="absolute top-0 left-0 w-full h-full"
					/>
					<div className="w-10 h-10 rounded-full bg-red-300 relative overflow-hidden">
						<Image
							src={author.image || ProfilePlaceholder}
							alt={author.name || "Profile picture"}
							fill={true}
							className="object-cover"
						/>
					</div>
					<div>
						<h3 className="font-bold text-sm -mb-[4px]">
							{author.name}
						</h3>
						<p className="text-sm text-gray-500">
							{author.username}
						</p>
					</div>
				</div>

				<div className="text-xs leading-3.5">
					{author.bio || "No bio yet."}
				</div>

				{authorArticles.length > 0 && (
					<div className="h-[1px] bg-black/20 my-3" />
				)}

				<div
					className={`${
						authorArticles.length > 0 ? "block" : "hidden"
					}`}
				>
					<div className="leading-5 relative mb-2">
						More articles from author{" "}
					</div>
					<ul>
						{loading && (
							<li className="flex items-center gap-1">
								Loading
								<Loader2
									size={14}
									className="animate-spin relative bottom-[1px]"
								/>
							</li>
						)}
						{!loading &&
							authorArticles.map((article, index) => (
								<li className="text-xs font-bold" key={index}>
									<Link
										href={`/article/${slugify(
											article.title,
											article.id
										)}`}
									>
										{article.title}
									</Link>
								</li>
							))}
					</ul>
				</div>
			</div>
		</div>
	);
}
