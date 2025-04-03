"use client";
import Block from "@components/block-editor/Block";
import React, { useEffect, useState } from "react";
import { Loader2, Plus, Send } from "lucide-react";
import BlockTooltipControl from "@components/block-editor/BlockTooltipControl";
import SelectionFloatingToolbar from "@components/block-editor/SelectionFloatingToolbar";
import MentionPopup from "@components/block-editor/MentionPopup";
import { useMentionPopupState } from "@state/mentionBlockPopup";
import { useBlockTooltipState } from "@state/blockTooltipControl";
import { useSelectionFloatingToolbarState } from "@state/selectionFloatingToolbar";
import { useSession } from "@node_modules/next-auth/react";
import clsx from "clsx";
import { redirect, useRouter } from "@node_modules/next/navigation";
import { useUploadImage } from "@app/lib/uploadImage";
import { ArticleBlock } from "@node_modules/.prisma/client";

export interface BlockData extends Partial<ArticleBlock> {
	id: string;
	type: "text" | "title" | "image" | "separator" | "codeblock" | "videolink";
	textValue: string;
	className?: string;
	placeholder?: string;
	imagePreview?: string | null;
	codeLanguage?: string | null;
	imageFileTemp?: File;
}

export default function Page() {
	const router = useRouter();
	const { data: tooltipState, setData: setBlockTooltip } =
		useBlockTooltipState();
	const { data: floatingToolbarState, setData: setFloatingToolbar } =
		useSelectionFloatingToolbarState();
	const { data: mentionPopup } = useMentionPopupState();
	const { mutateAsync } = useUploadImage();
	const [blocks, setBlocks] = useState<BlockData[]>([
		{
			id: Date.now().toString(),
			type: "title",
			placeholder: "Title",
			textValue: "",
		},
	]);
	const { data: sessionData, status: sessionStatus } = useSession();
	const [isPublishing, setIsPublishing] = useState<boolean>(false);

	const updateBlock = (
		id: string,
		newblock: Partial<BlockData>,
		action: "update" | "delete" = "update"
	) => {
		if (action == "update") {
			setBlocks((prevBlocks) =>
				prevBlocks.map((block) =>
					block.id === id ? { ...block, ...newblock } : block
				)
			);
		} else if (action == "delete") {
			setBlocks((prevBlocks) =>
				prevBlocks.filter((block) => block.id !== id)
			);
		}
	};

	const addNewBlock = () => {
		setBlocks([
			...blocks,
			{
				id: Date.now().toString(),
				type: "text",
				placeholder: "Type something...",
				textValue: "",
			},
		]);
	};

	useEffect(() => {
		setBlockTooltip({ blockId: blocks[0].id });

		const handleSelectionChange = () => {
			const selection = window.getSelection();

			if (!selection || selection.isCollapsed) {
				setFloatingToolbar({ active: false });
			}
		};

		document.addEventListener("selectionchange", handleSelectionChange);

		return () => {
			document.removeEventListener(
				"selectionchange",
				handleSelectionChange
			);
		};
	}, []);

	const publishArticle = async () => {
		const filtereBlocks = blocks.filter(
			(block) =>
				(block.textValue.length > 0 && block.type === "text") ||
				(block.textValue.length > 0 && block.type === "title") ||
				(block.textValue.length > 0 && block.type === "codeblock") ||
				block.type == "image" ||
				block.type == "videolink" ||
				block.type == "separator"
		);

		if (filtereBlocks.length == 0) return;

		if (!filtereBlocks.find((b) => b.type == "title")) {
			window.scrollTo({ top: 0, behavior: "smooth" });
			setBlocks((prev) => [
				{
					id: Date.now().toString(),
					type: "title",
					placeholder: "At least one Title must be present!",
					textValue: "",
					className: "border-[#ff3535]",
				},
				...prev,
			]);

			return;
		}

		setIsPublishing(true);

		const updatedBlocks = await Promise.all(
			filtereBlocks.map(async (block) => {
				if (block.type === "image" && block.imageFileTemp) {
					try {
						const imageUrl = await mutateAsync({
							file: block.imageFileTemp,
							folder: "/previews",
						});
						return {
							id: block.id,
							type: block.type,
							textValue: block.textValue,
							createdAt: block.createdAt,
							updatedAt: block.updatedAt,
							imagePreview: imageUrl,
						};
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
					} catch (e) {
						return block;
					}
				}
				return block;
			})
		);

		try {
			setIsPublishing(true);
			const res = await fetch(`/api/articles`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					blocks: updatedBlocks,
					authorId: sessionData?.user.id,
				}),
			});
			await res.json();
			router.push("/articles");
		} catch (e) {
			console.log("Error publishing", e);
			alert(
				`Something went wrong publishing the article...\n Error: ${e}`
			);
		} finally {
			setIsPublishing(false);
		}
	};

	if (sessionStatus == "unauthenticated") {
		return redirect("/");
	}

	return (
		<div className="flex justify-center">
			<div className="mx-16 max-[500px]:mx-7 max-w-[900px] min-h-screen w-full py-10">
				<BlockTooltipControl
					blockId={tooltipState?.blockId || null}
					position={tooltipState?.position || { x: null, y: null }}
					visible={tooltipState?.visible || false}
					updateBlock={updateBlock}
				/>
				{mentionPopup?.active && (
					<MentionPopup
						position={mentionPopup?.position || { x: 0, y: 0 }}
						blockRef={mentionPopup.blockRef}
						blockId={mentionPopup.blockId}
						updateBlock={updateBlock}
					/>
				)}
				{floatingToolbarState?.active && (
					<SelectionFloatingToolbar
						position={floatingToolbarState.position}
						updateBlock={updateBlock}
						blockId={floatingToolbarState.blockId}
						blockRef={floatingToolbarState.blockRef}
					/>
				)}
				{blocks.map((block) => {
					return (
						<Block
							key={block.id}
							{...block}
							updateBlock={updateBlock}
						/>
					);
				})}
				<div className="flex gap-2">
					<button
						onClick={addNewBlock}
						className="flex items-center justify-center gap-1 bg-mango/30 cursor-pointer text-[#888] px-10 w-full mx-auto mt-5 py-1 rounded-lg hover:text-[#444]"
					>
						Add a new block{" "}
						<Plus size={15} className="relative bottom-[1px]" />
					</button>
					<button
						onClick={publishArticle}
						className={clsx(
							"relative flex items-center justify-center gap-1 bg-mango/30 cursor-pointer px-10 w-full mx-auto mt-5 py-1 rounded-lg hover:text-[#444]",
							"text-[#888]"
						)}
					>
						{isPublishing ? "Publishing" : "Publish"}
						{!isPublishing && (
							<Send size={15} className="relative bottom-[1px]" />
						)}
						{isPublishing && (
							<Loader2 size={20} className="animate-spin" />
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
