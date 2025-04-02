import type { ArticleBlock as ArticleBlockType } from "@node_modules/.prisma/client";
import Image from "@node_modules/next/image";
import ArticleBlock from "./ArticleBlock";
import React from "react";

const PLACEHOLDER =
	"https://ik.imagekit.io/gdlddng3g/image-placeholder?updatedAt=1742920604247";

export default function ArticleBody({
	blocks,
	imagePreview,
}: {
	blocks: ArticleBlockType[];
	imagePreview: string | null;
}) {
	return (
		<div>
			{/* <div className="relative w-full aspect-video mb-5">
				<Image
					src={imagePreview || PLACEHOLDER}
					alt="Article header image"
					fill={true}
					className="object-cover"
				/>
			</div> */}
			{blocks
				.filter(
					(b) => b.id != blocks.find((b) => b.type == "title")?.id
				)
				.map((b) => {
					return <ArticleBlock key={b.id} block={b} />;
				})}
		</div>
	);
}
