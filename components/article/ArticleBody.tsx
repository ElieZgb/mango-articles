import Image from "@node_modules/next/image";
import React from "react";

const PLACEHOLDER =
	"https://ik.imagekit.io/gdlddng3g/image-placeholder?updatedAt=1742920604247";

export default function ArticleBody({
	content,
	header_image,
}: {
	content: string;
	header_image: string | null;
}) {
	return (
		<div>
			<div className="relative w-full aspect-video mb-5">
				<Image
					src={header_image || PLACEHOLDER}
					alt="Article header image"
					fill={true}
					className="object-cover"
				/>
			</div>
			<p>{content}</p>
		</div>
	);
}
