"use client";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { BlockData } from "@app/write/page";
import Image from "@node_modules/next/image";
import LanguageSelector from "./LanguageSelector";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactPlayer from "react-player";
import { Loader2, Trash2 } from "lucide-react";
import { useMentionPopupState } from "@state/mentionBlockPopup";
import { useBlockTooltipState } from "@state/blockTooltipControl";
import { useSelectionFloatingToolbarState } from "@state/selectionFloatingToolbar";

export interface BlockProps extends BlockData {
	updateBlock: (
		id: string,
		newBlock: Partial<BlockData>,
		action?: "update" | "delete"
	) => void;
}

export default function Block({
	id,
	type,
	className,
	placeholder,
	updateBlock,
	imagePreview,
	textValue,
}: BlockProps) {
	const blockRef = useRef<HTMLElement>(null);
	const labelRef = useRef<HTMLLabelElement>(null);
	const [codeLanguage, setCodeLanguage] = useState<string>("javascript");
	const [videoLinkTextareaVisible, setVideoLinkTextareaVisible] =
		useState<boolean>(true);
	const { setData: setMentionPopup } = useMentionPopupState();
	const { setData: setBlockTooltip } = useBlockTooltipState();
	const { setData: setSelectionFloatingToolbar } =
		useSelectionFloatingToolbarState();

	useEffect(() => {
		if (blockRef.current) {
			const scrollY = window.scrollY || window.pageYOffset;
			const X = blockRef.current.getBoundingClientRect().x;
			const Y = blockRef.current.getBoundingClientRect().y + scrollY;
			const height = blockRef.current.getBoundingClientRect().height;

			setBlockTooltip({
				visible: true,
				position: { x: X, y: Y + height / 2 },
				blockId: id,
			});

			if (blockRef.current instanceof HTMLDivElement) {
				if (textValue.length > 0) {
					blockRef.current.style.height = "unset";
				}
				blockRef.current.innerHTML = textValue;
			} else if (blockRef.current instanceof HTMLTextAreaElement) {
				if (textValue.length > 0) {
					blockRef.current.style.height = "auto";
				}
				blockRef.current.value = textValue;
			}

			if (textValue.length > 0 && labelRef.current)
				labelRef.current.style.display = "none";
		}
	}, [blockRef]);

	const handleDeleteBlock = () => {
		updateBlock(id, {}, "delete");
		setBlockTooltip({ visible: false });
	};

	const handleSelection = () => {
		const selection = window.getSelection();

		if (!selection || !selection.rangeCount)
			return setSelectionFloatingToolbar({ active: false });

		if (selection.toString().length == 0)
			return setSelectionFloatingToolbar({ active: false });
		const range = selection.getRangeAt(0);
		const rect = range.getBoundingClientRect();

		if (!rect.width) {
			setSelectionFloatingToolbar({ active: false });
			return;
		}

		setSelectionFloatingToolbar({
			active: true,
			position: {
				x: rect.left + window.scrollX,
				y: rect.top + window.scrollY - 70,
			},
			blockRef,
			blockId: id,
		});
	};

	if (type == "text" || type == "title") {
		return (
			<div
				className={clsx(
					"flex my-2 w-full relative",
					type == "title"
						? "text-5xl max-[500px]:text-4xl"
						: "text-xl max-[700px]:text-lg max-[500px]:text-base max-[400px]:text-sm",
					className
				)}
			>
				<label
					ref={labelRef}
					className={clsx(
						"absolute left-1 top-[58%] translate-y-[-50%] text-[#aaa] font-logo"
					)}
				>
					{placeholder}
				</label>
				<div
					ref={blockRef as React.Ref<HTMLDivElement>}
					contentEditable={true}
					onMouseUp={handleSelection}
					onPaste={(e) => {
						if (blockRef.current) {
							const text = e.clipboardData.getData("text/plain");
							blockRef.current.innerHTML += text;
						}
					}}
					className={clsx(
						"bg-transparent font-display-regular outline-none flex-1 p-1 relative top-1",
						type == "title" ? "h-[55px]" : "h-[36px]"
					)}
					onClick={(e) => {
						const target = e.currentTarget;
						if (
							target.innerHTML.length > 0 &&
							target.innerHTML.trim() != "<br>"
						)
							return;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = target.getBoundingClientRect().x;
						const Y = target.getBoundingClientRect().y + scrollY;
						const height = target.getBoundingClientRect().height;

						setBlockTooltip({
							visible: true,
							position: { x: X, y: Y + height / 2 },
							blockId: id,
						});
					}}
					onInput={(e) => {
						const target = e.currentTarget;
						target.style.height = "auto";
						target.style.height = `${target.scrollHeight}px`;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = target.getBoundingClientRect().x;
						const Y = target.getBoundingClientRect().y + scrollY;
						const height = target.getBoundingClientRect().height;

						if (target.innerHTML.length > 0) {
							if (target.innerHTML.trim() == "<br>") {
								target.innerHTML = "";
								if (labelRef.current)
									labelRef.current.style.display = "unset";
								setBlockTooltip({
									visible: true,
									blockId: id,
									position: { x: X, y: Y + height / 2 },
								});
							} else {
								if (labelRef.current)
									labelRef.current.style.display = "none";
								setBlockTooltip({
									visible: false,
									blockId: id,
									position: { x: X, y: Y + height / 2 },
								});
							}
						} else {
							if (labelRef.current)
								labelRef.current.style.display = "unset";
							setBlockTooltip({
								visible: true,
								blockId: id,
								position: { x: X, y: Y + height / 2 },
							});
						}

						setMentionPopup({ active: false });

						updateBlock(id, {
							placeholder,
							className,
							type,
							id,
							textValue: target.innerHTML,
						});
					}}
					onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => {
						if (e.key === "@") {
							const selection = window.getSelection();
							if (!selection || selection.rangeCount === 0)
								return;

							const range = selection.getRangeAt(0);
							const rect = range.getBoundingClientRect();

							setMentionPopup({
								active: true,
								position: {
									x: rect.left,
									y: rect.top + rect.height + 20,
								},
								blockId: id,
								blockRef,
							});
						}
					}}
				></div>
			</div>
		);
	}

	if (type == "image" && imagePreview) {
		return (
			<div className={clsx("flex my-2 w-full", className)}>
				<div className="aspect-video w-full relative group">
					<Image
						src={imagePreview}
						alt="Image Preview"
						fill={true}
						className="object-cover"
					/>
					<button
						onClick={handleDeleteBlock}
						className="absolute bottom-5 left-5 invisible max-[500px]:visible rounded-full bg-white p-3 border-[1.5px] cursor-pointer group-hover:visible shadow-2xl"
					>
						<Trash2 size={25} />
					</button>
				</div>
			</div>
		);
	}

	if (type == "separator") {
		return (
			<div
				className={clsx(
					"flex my-2 w-full group relative hover:bg-mango/20",
					className
				)}
			>
				<div className="h-16 flex items-center justify-center w-full gap-5">
					<div className="h-[10px] aspect-square bg-mango rounded-full" />
					<div className="h-[10px] aspect-square bg-mango rounded-full" />
					<div className="h-[10px] aspect-square bg-mango rounded-full" />
				</div>
				<button
					onClick={handleDeleteBlock}
					className="rounded-full p-3 invisible max-[500px]:visible cursor-pointer border-[1.5px] bg-white absolute left-5 top-[50%] translate-y-[-50%] group-hover:visible shadow-2xl"
				>
					<Trash2 size={20} className="" />
				</button>
			</div>
		);
	}

	if (type == "codeblock") {
		return (
			<div
				className={clsx(
					"flex flex-col my-2 w-full relative text-lg max-[700px]:text-lg max-[500px]:text-base max-[400px]:text-sm",
					className
				)}
			>
				<textarea
					ref={blockRef as React.Ref<HTMLTextAreaElement>}
					placeholder={placeholder}
					className={clsx(
						"bg-[#ececec] border border-black rounded-sm resize-none font-mono outline-none w-full px-10 py-10 relative top-1"
					)}
					onFocus={(v) => {
						const target = v.currentTarget;
						if (target.value.length > 0) return;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = target.getBoundingClientRect().x;
						const Y = target.getBoundingClientRect().y + scrollY;
						const height = target.getBoundingClientRect().height;

						setBlockTooltip({
							visible: true,
							position: { x: X, y: Y + height / 2 },
							blockId: id,
						});
					}}
					onInput={(e) => {
						const target = e.currentTarget;
						target.style.height = "auto";
						target.style.height = `${target.scrollHeight}px`;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = target.getBoundingClientRect().x;
						const Y = target.getBoundingClientRect().y + scrollY;
						const height = target.getBoundingClientRect().height;

						if (target.value.length > 0) {
							setBlockTooltip({
								visible: false,
								blockId: id,
								position: { x: X, y: Y + height / 2 },
							});
						} else {
							setBlockTooltip({
								visible: true,
								blockId: id,
								position: { x: X, y: Y + height / 2 },
							});
						}

						updateBlock(id, {
							placeholder,
							className,
							type,
							id,
							textValue: target.value,
							codeLanguage: codeLanguage,
						});
					}}
				></textarea>
				<span className="mt-3 text-sm">Code Preview:</span>
				<div className="border rounded-sm border-black text-base">
					<SyntaxHighlighter language={codeLanguage}>
						{(blockRef.current as HTMLTextAreaElement | null)
							?.value || "const x = 10;"}
					</SyntaxHighlighter>
				</div>
				<div className="absolute left-5 top-4 text-base">
					<LanguageSelector
						language={codeLanguage}
						setCodeLanguage={setCodeLanguage}
					/>
				</div>
			</div>
		);
	}

	if (type == "videolink") {
		return (
			<div
				className={clsx(
					"flex flex-col my-2 w-full relative text-xl",
					className
				)}
			>
				<label
					ref={labelRef}
					className={clsx(
						"absolute left-1 top-[58%] translate-y-[-50%] text-[#aaa] font-logo"
					)}
				>
					{placeholder}
				</label>
				<div
					ref={blockRef as React.Ref<HTMLDivElement>}
					onMouseUp={handleSelection}
					contentEditable={true}
					className={clsx(
						"bg-transparent resize-none underline h-[36px] font-display-regular outline-none w-full p-1 relative top-1 placeholder:font-logo placeholder:text-[#aaa]",
						!videoLinkTextareaVisible && "hidden"
					)}
					onClick={(e) => {
						const target = e.currentTarget;
						if (
							target.innerHTML.length > 0 &&
							target.innerHTML != "<br>"
						)
							return;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = target.getBoundingClientRect().x;
						const Y = target.getBoundingClientRect().y + scrollY;
						const height = target.getBoundingClientRect().height;

						setBlockTooltip({
							visible: true,
							position: { x: X, y: Y + height / 2 },
							blockId: id,
						});
					}}
					onInput={(e) => {
						const target = e.currentTarget;
						target.style.height = "auto";
						target.style.height = `${target.scrollHeight}px`;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = target.getBoundingClientRect().x;
						const Y = target.getBoundingClientRect().y + scrollY;
						const height = target.getBoundingClientRect().height;

						if (target.innerHTML.length > 0) {
							if (target.innerHTML.trim() == "<br>") {
								target.innerHTML = "";
								if (labelRef.current)
									labelRef.current.style.display = "unset";
								setBlockTooltip({
									visible: true,
									blockId: id,
									position: { x: X, y: Y + height / 2 },
								});
							} else {
								if (labelRef.current)
									labelRef.current.style.display = "none";
								setBlockTooltip({
									visible: false,
									blockId: id,
									position: { x: X, y: Y + height / 2 },
								});
							}
						} else {
							if (labelRef.current)
								labelRef.current.style.display = "unset";
							setBlockTooltip({
								visible: true,
								blockId: id,
								position: { x: X, y: Y + height / 2 },
							});
						}
					}}
					onKeyUp={(e) => {
						if (e.key === "Enter") {
							if (
								blockRef.current &&
								blockRef.current?.innerHTML.length < 5
							)
								return;
							setVideoLinkTextareaVisible(false);
						}
					}}
				></div>
				{!videoLinkTextareaVisible && blockRef.current && (
					<div className="w-full aspect-video rounded-sm overflow-hidden relative group">
						<div className="absolute w-full h-full left-0 top-0 bg-mango/60 flex items-center justify-center">
							<Loader2
								size={40}
								className="animate-spin text-black"
							/>
						</div>
						<div className="w-full h-full relative">
							<ReactPlayer
								url={blockRef.current.innerHTML}
								width="100%"
								height="100%"
								controls
							/>
						</div>
						<button
							onClick={handleDeleteBlock}
							className="absolute bottom-24 left-5 invisible max-[500px]:visible rounded-full bg-white p-3 border-[1.5px] cursor-pointer group-hover:visible shadow-2xl"
						>
							<Trash2 size={25} />
						</button>
					</div>
				)}
			</div>
		);
	}

	return null;
}
