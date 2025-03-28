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
import type { Block, Tooltip } from "@app/write/page";

const ICON_SIZE = 27;

export default function BlockTooltipControl({
	tooltip,
	updateBlock,
	updateTooltip,
}: {
	tooltip: Tooltip;
	updateBlock: (
		id: string,
		newBlock: Partial<Block>,
		action?: "update" | "delete"
	) => void;
	updateTooltip: (updates: Partial<Tooltip>) => void;
}) {
	const { visible, position, blockId } = tooltip;
	const [options, setOptions] = useState<boolean>(false);
	const imageInputRef = useRef<HTMLInputElement | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);

	const addImage = () => {
		if (imageInputRef.current) {
			imageInputRef.current.click();
		}
	};

	const addSeparator = () => {
		if (blockId) {
			updateBlock(blockId, { type: "separator" });
			updateTooltip({ visible: false });
		}
	};

	const addCodeBlock = () => {
		if (blockId) {
			updateBlock(blockId, { type: "codeblock" });
			updateTooltip({ visible: false });
		}
	};

	const addVideoLink = () => {
		if (blockId) {
			updateBlock(blockId, {
				type: "videolink",
				placeholder:
					"Paste a Youtube, Vimeo, or other video link, and press Enter",
			});
			updateTooltip({ visible: false });
		}
	};

	useEffect(() => {
		setOptions(false);
	}, [visible, position]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateTooltip({ visible: false });
		const selectedFile = e.target.files![0];

		if (!selectedFile) return;

		setImageFile(selectedFile);
		const reader = new FileReader();
		reader.onloadend = () => {
			setImagePreview(reader.result as string);
			if (blockId) {
				updateBlock(blockId, {
					imageFile: selectedFile,
					imagePreview: reader.result as string,
					type: "image",
				});
			}
		};
		reader.readAsDataURL(selectedFile);
	};

	const handleDeleteBlock = () => {
		if (!blockId) return;
		updateBlock(blockId, {}, "delete");
		updateTooltip({ visible: false });
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
