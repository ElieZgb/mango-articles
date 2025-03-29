"use client";
import React, { useState, useRef, useEffect } from "react";
import {
	PlusCircle,
	Image,
	Braces,
	BetweenHorizonalStart,
	Play,
	Trash2,
	type LucideProps,
} from "lucide-react";
import clsx from "clsx";
import type { BlockData } from "@app/write/page";
import { useBlockTooltipState } from "@state/blockTooltipControl";

const ICON_SIZE = 27;

export default function BlockTooltipControl({
	visible,
	position,
	blockId,
	updateBlock,
}: {
	updateBlock: (
		id: string,
		newBlock: Partial<BlockData>,
		action?: "update" | "delete"
	) => void;
	visible: boolean;
	position: {
		x: number | null;
		y: number | null;
	};
	blockId: string | null;
}) {
	const { setData } = useBlockTooltipState();
	// const { visible, position, blockId } = tooltip;
	const [options, setOptions] = useState<boolean>(false);
	const imageInputRef = useRef<HTMLInputElement | null>(null);

	const addImage = () => {
		if (imageInputRef.current) {
			imageInputRef.current.click();
		}
	};

	const addSeparator = () => {
		if (blockId) {
			updateBlock(blockId, { type: "separator", placeholder: undefined });
			setData({ visible: false });
		}
	};

	const addCodeBlock = () => {
		if (blockId) {
			updateBlock(blockId, {
				type: "codeblock",
				placeholder: "const x = 10;",
			});
			setData({ visible: false });
		}
	};

	const addVideoLink = () => {
		if (blockId) {
			updateBlock(blockId, {
				type: "videolink",
				placeholder:
					"Paste a Youtube, Vimeo, or other video link, and press Enter",
			});
			setData({ visible: false });
		}
	};

	useEffect(() => {
		setOptions(false);
	}, [visible, position]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({ visible: false });
		const selectedFile = e.target.files![0];

		if (!selectedFile) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			if (blockId) {
				updateBlock(blockId, {
					imageFile: selectedFile,
					imagePreview: reader.result as string,
					type: "image",
					placeholder: undefined,
				});
			}
		};
		reader.readAsDataURL(selectedFile);
	};

	const handleDeleteBlock = () => {
		if (!blockId) return;
		updateBlock(blockId, {}, "delete");
		setData({ visible: false });
	};

	if (!visible || !position.x || !position.y) {
		return null;
	}

	return (
		<div
			className="absolute flex items-center gap-1"
			style={{
				top: position.y ? position.y - ICON_SIZE / 2 : 0,
				left: position.x ? position.x - ICON_SIZE * 2.5 : 0,
			}}
		>
			<div
				onClick={handleDeleteBlock}
				className={`aspect-square cursor-pointer rounded-full flex items-center justify-center transition-transform `}
			>
				<Trash2 strokeWidth={1.3} size={ICON_SIZE} />
			</div>

			<div
				onClick={() => setOptions((prev) => !prev)}
				className={`aspect-square cursor-pointer rounded-full flex items-center justify-center transition-transform ${
					options ? "rotate-45" : ""
				}`}
			>
				<PlusCircle strokeWidth={1.3} size={ICON_SIZE} />
			</div>
			<div
				className={clsx(
					"flex gap-2 bg-background absolute top-[50%] translate-y-[-50%] left-[120%] py-3",
					options && "z-50 opacity-100",
					!options && "-z-50 opacity-0"
				)}
			>
				<input
					type="file"
					accept="image/*"
					ref={imageInputRef}
					hidden
					onChange={handleImageChange}
				/>
				<TooltipOption
					onClick={addImage}
					Icon={Image}
					options={options}
					index={1}
				/>
				<TooltipOption
					onClick={addCodeBlock}
					Icon={Braces}
					options={options}
					index={2}
				/>
				<TooltipOption
					onClick={addSeparator}
					Icon={BetweenHorizonalStart}
					options={options}
					index={3}
				/>
				<TooltipOption
					onClick={addVideoLink}
					Icon={Play}
					options={options}
					index={4}
				/>
			</div>
		</div>
	);
}
function TooltipOption({
	options,
	Icon,
	index,
	onClick,
}: {
	options: boolean;
	Icon: React.ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
	>;
	index: number;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			disabled={!options}
			style={{ "--i": index } as React.CSSProperties}
			className={clsx(
				"border-[1.5px] cursor-pointer border-black p-2 rounded-full transition-opacity delay-[calc(var(--i)*25ms)]",
				options && "opacity-100",
				!options && "opacity-0"
			)}
		>
			<Icon size={18} />
		</button>
	);
}
