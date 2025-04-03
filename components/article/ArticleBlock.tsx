import type { ArticleBlock } from "@node_modules/.prisma/client";
import clsx from "clsx";
import Image from "@node_modules/next/image";
import React from "react";
import { Loader2 } from "lucide-react";
import ReactPlayer from "react-player";
import SyntaxHighlighter from "react-syntax-highlighter";

export default function ArticleBlock({ block }: { block: ArticleBlock }) {
	if (block.type == "text" || block.type == "title") {
		return (
			<div
				dangerouslySetInnerHTML={{ __html: block.textValue }}
				className={clsx(
					block.type == "text" &&
						"text-xl max-[700px]:text-lg max-[500px]:text-base max-[400px]:text-sm",
					block.type == "title" && "text-5xl",
					"mb-4",
					block.className
				)}
			></div>
		);
	}

	if (block.type == "image" && block.imagePreview) {
		return (
			<div className={clsx("w-full,", block.className)}>
				<div className="aspect-video w-full relative mb-3">
					<Image
						src={block.imagePreview}
						alt="Image Preview"
						fill={true}
						className="object-cover"
					/>
				</div>
			</div>
		);
	}

	if (block.type == "separator") {
		return (
			<div className={clsx("flex my-2 w-full", block.className)}>
				<div className="h-16 flex items-center justify-center w-full gap-5">
					<div className="h-[10px] aspect-square bg-mango rounded-full" />
					<div className="h-[10px] aspect-square bg-mango rounded-full" />
					<div className="h-[10px] aspect-square bg-mango rounded-full" />
				</div>
			</div>
		);
	}

	if (block.type == "videolink" && block.textValue) {
		return (
			<div className="w-full aspect-video rounded-sm overflow-hidden relative mb-3">
				<div className="absolute w-full h-full left-0 top-0 bg-mango/60 flex items-center justify-center">
					<Loader2 size={40} className="animate-spin text-black" />
				</div>
				<div className="w-full h-full relative">
					<ReactPlayer
						url={block.textValue}
						width="100%"
						height="100%"
						controls
					/>
				</div>
			</div>
		);
	}

	if (block.type == "codeblock" && block.codeLanguage) {
		return (
			<div className="border rounded-sm overflow-hidden px-4 py-3 border-black text-base my-10 max-[500px]:text-base max-[400px]:text-sm">
				<SyntaxHighlighter
					language={block.codeLanguage ?? "javascript"}
					customStyle={{ background: "transparent" }}
				>
					{block.textValue || "No code provided."}
				</SyntaxHighlighter>
			</div>
		);
	}

	return;
}
