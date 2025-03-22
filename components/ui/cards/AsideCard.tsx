import { formatTimeAgo } from "@lib/dateFormat";
import type { User } from "@node_modules/@prisma/client";
import Image from "@node_modules/next/image";
import React from "react";
import ProfilePlaceholder from "@public/assets/images/profile-placeholder.png";

type AsideCardProps = {
	author: User;
	title: string;
	content: string;
	updatedAt: Date;
	likes_count: number;
};

export default function AsideCard({
	author,
	title,
	content,
	updatedAt,
	likes_count,
}: AsideCardProps) {
	return (
		<div className="mb-5 flex relative rounded-lg overflow-hidden bg-white border-black border-[1px]">
			<div className="flex-1 p-2 relative z-10">
				<div className={`flex w-full items-center gap-2`}>
					<div className="aspect-square w-6 flex-shrink-0 relative">
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

				<div className="py-2">
					<h3 className="text-lg font-display-bold text-gray-800 line-clamp-1">
						{title}
					</h3>
					<p className="text-sm text-gray-800 line-clamp-2">
						{content}
					</p>
				</div>

				<div className="flex items-center gap-4 text-sm text-gray-700">
					<span>{formatTimeAgo(updatedAt)}</span>{" "}
					<span>❤️ {likes_count}</span>
				</div>
			</div>
		</div>
	);
}
