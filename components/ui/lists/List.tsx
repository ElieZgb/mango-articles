"use client";
import { slugify } from "@lib/slugify";
import type { Article } from "@node_modules/.prisma/client";
import Link from "@node_modules/next/link";
import React, { useState } from "react";
import ProfilePagination from "../paginations/ProfilePagination";

export default function List({
	paginated = false,
	title,
	list,
}: {
	paginated?: boolean;
	title?: string;
	list: Article[];
}) {
	const [currentPage] = useState(0);

	return (
		<div className="mb-20">
			{title && <h3 className="text-[#777] font-bold mb-1">{title}</h3>}
			<div className="">
				{list.map((article, index) => {
					return (
						<div
							key={index}
							className="bg-mango/60 py-2 px-4 mb-2 rounded-sm flex items-end"
						>
							<span className="mr-2 font-logo text-lg">
								{index + 1}.
							</span>
							<div className="mr-3 flex-1 hover:underline relative">
								<Link
									href={`/article/${slugify(
										article.title!,
										article.id!
									)}`}
									className="absolute top-0 left-0 w-full h-full"
								/>
								{article.title}
							</div>

							<div className="text-sm relative bottom-[2px]">
								{article.likes_count} ❤️
							</div>
						</div>
					);
				})}

				{paginated && <ProfilePagination currentPage={currentPage} />}
			</div>
		</div>
	);
}
