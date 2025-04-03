"use client";
import React, { useEffect, useState } from "react";
import type { BlockData } from "../page";
import { redirect, useParams } from "@node_modules/next/navigation";
import Block from "@components/block-editor/Block";
import { Loader2, Plus, Send } from "lucide-react";
import { useBlockTooltipState } from "@state/blockTooltipControl";
import BlockTooltipControl from "@components/block-editor/BlockTooltipControl";
import MentionPopup from "@components/block-editor/MentionPopup";
import { useMentionPopupState } from "@state/mentionBlockPopup";
import { useSelectionFloatingToolbarState } from "@state/selectionFloatingToolbar";
import SelectionFloatingToolbar from "@components/block-editor/SelectionFloatingToolbar";
import clsx from "clsx";
import Image from "@node_modules/next/image";
import LoadingIcon from "@public/assets/icons/loading-icon.gif";
import { useSession } from "@node_modules/next-auth/react";

export default function Page() {
	const [blocks, setBlocks] = useState<BlockData[]>([]);
	const { articleId } = useParams();
	const { data: tooltipState, setData: setBlockTooltip } =
		useBlockTooltipState();
	const { data: mentionPopup } = useMentionPopupState();
	const { data: floatingToolbarState, setData: setFloatingToolbar } =
		useSelectionFloatingToolbarState();
	const [isPublishing, setIsPublishing] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const { status: sessionStatus } = useSession();

	useEffect(() => {
		setIsLoading(true);
		const fetchArticle = async () => {
			const response = await fetch(`/api/articles/${articleId}`);
			const data = await response.json();
			setBlocks(data.blocks);
			setIsLoading(false);
		};

		fetchArticle();
	}, [articleId]);

	useEffect(() => {
		if (blocks.length > 0) {
			setBlockTooltip({ blockId: blocks[0].id });
		}

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

	const updateArticle = async () => {
		const filtereBlocks = blocks.filter(
			(block) => block.textValue.length > 0
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
		try {
			await fetch(`/api/articles/${articleId}?body=true`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					blocks,
				}),
			});
		} catch (e) {
			console.log("Error updating article", e);
			alert("Error updating article!");
		} finally {
			setIsPublishing(false);
		}
	};

	if (sessionStatus == "unauthenticated") {
		return redirect("/");
	}

	if (!blocks || isLoading)
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
		<div className="flex justify-center">
			<div className="mx-16 max-[500px]:mx-7 max-[500px]:py-2 max-w-[900px] min-h-screen w-full py-10">
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
						onClick={updateArticle}
						className={clsx(
							"relative flex items-center justify-center gap-1 bg-mango/30 cursor-pointer px-10 w-full mx-auto mt-5 py-1 rounded-lg hover:text-[#444]",
							"text-[#888]"
						)}
					>
						{isPublishing ? "Updating article" : "Update article"}
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
