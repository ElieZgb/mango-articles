"use client";
import Block from "@components/block-editor/Block";
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import BlockTooltipControl from "@components/block-editor/BlockTooltipControl";

export interface Block {
	id: string;
	type: "text" | "title" | "image" | "separator" | "codeblock" | "videolink";
	textValue?: string;
	className?: string;
	placeholder?: string;
	updateTooltip: (updates: Partial<Tooltip>) => void;
	updateBlock: (
		id: string,
		newBlock: Partial<Block>,
		action?: "update" | "delete"
	) => void;
	imageFile?: File | null;
	imagePreview?: string | null;
}

export interface Tooltip {
	visible: boolean;
	position: {
		x: number | null;
		y: number | null;
	};
	blockId: string | null;
}

export default function Page() {
	const [tooltip, setTooltip] = useState<Tooltip>({
		visible: true,
		position: { x: null, y: null },
		blockId: null,
	});

	const updateTooltip = (updates: Partial<Tooltip>) => {
		setTooltip((prev) => ({ ...prev, ...updates }));
	};

	const updateBlock = (
		id: string,
		newblock: Partial<Block>,
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

	const [blocks, setBlocks] = useState<Block[]>([
		{
			id: Date.now().toString(),
			type: "title",
			placeholder: "Title",
			updateTooltip,
			updateBlock,
		},
	]);

	useEffect(() => {
		updateTooltip({ blockId: blocks[0].id });
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
				updateTooltip,
				placeholder: "Type something...",
				updateBlock,
			},
		]);
	};

	return (
		<div className="flex justify-center">
			<div className="mx-16 max-w-[900px] min-h-screen w-full py-10">
				<BlockTooltipControl
					tooltip={tooltip}
					updateBlock={updateBlock}
					updateTooltip={updateTooltip}
				/>
				{blocks.map((block) => {
					return <Block key={block.id} {...block} />;
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
