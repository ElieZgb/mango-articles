"use client";
import Block from "@components/block-editor/Block";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import BlockTooltipControl from "@components/block-editor/BlockTooltipControl";
import SelectionFloatingToolbar from "@components/block-editor/SelectionFloatingToolbar";
import MentionPopup from "@components/block-editor/MentionPopup";
import { useMentionPopupState } from "@state/mentionBlockPopup";
import { useBlockTooltipState } from "@state/blockTooltipControl";
import { useSelectionFloatingToolbarState } from "@state/selectionFloatingToolbar";

export interface BlockData {
	id: string;
	type: "text" | "title" | "image" | "separator" | "codeblock" | "videolink";
	textValue?: string;
	className?: string;
	placeholder?: string;
	imageFile?: File | null;
	imagePreview?: string | null;
}

export default function Page() {
	const { data: tooltipState, setData: setBlockTooltip } =
		useBlockTooltipState();
	const { data: floatingToolbarState, setData: setFloatingToolbar } =
		useSelectionFloatingToolbarState();
	const { data: mentionPopup } = useMentionPopupState();

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

	const [blocks, setBlocks] = useState<BlockData[]>([
		{
			id: Date.now().toString(),
			type: "title",
			placeholder: "Title",
		},
	]);

	useEffect(() => {
		setBlockTooltip({ blockId: blocks[0].id });
	}, []);

	useEffect(() => {
		console.log("new blocks:", blocks);
	}, [blocks]);

	const addNewBlock = () => {
		setBlocks([
			...blocks,
			{
				id: Date.now().toString(),
				type: "text",
				placeholder: "Type something...",
			},
		]);
	};

	useEffect(() => {
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

	return (
		<div className="flex justify-center">
			<div className="mx-16 max-w-[900px] min-h-screen w-full py-10">
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
				<button
					onClick={addNewBlock}
					className="flex items-center justify-center gap-1 bg-mango/30 cursor-pointer text-[#888] px-10 w-full mx-auto mt-5 py-1 rounded-lg hover:text-[#444]"
				>
					Add a new block{" "}
					<Plus size={15} className="relative bottom-[1px]" />
				</button>
			</div>
		</div>
	);
}
