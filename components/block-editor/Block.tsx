"use client";
import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { Block } from "@app/write/page";
import Image from "@node_modules/next/image";
import LanguageSelector from "./LanguageSelector";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ReactPlayer from "react-player";
import { Loader2, Trash2 } from "lucide-react";

export interface SelectionPosition {
	x: number;
	y: number;
}

export default function Block({
	id,
	type,
	className,
	placeholder,
	updateTooltip,
	updateBlock,
	imagePreview,
}: Block) {
	const blockRef = useRef<HTMLTextAreaElement>(null);
	const [codeLanguage, setCodeLanguage] = useState<string>("javascript");
	const [videoLinkTextareaVisible, setVideoLinkTextareaVisible] =
		useState<boolean>(true);

	useEffect(() => {
		if (blockRef.current) {
			const scrollY = window.scrollY || window.pageYOffset;
			const X = blockRef.current.getBoundingClientRect().x;
			const Y = blockRef.current.getBoundingClientRect().y + scrollY;
			const height = blockRef.current.getBoundingClientRect().height;

			updateTooltip({
				visible: true,
				position: { x: X, y: Y + height / 2 },
				blockId: id,
			});
		}
	}, [blockRef, updateTooltip]);

	const handleDeleteBlock = () => {
		updateBlock(id, {}, "delete");
		updateTooltip({ visible: false });
	};

	const handleMouseUp = () => {};

	if (type == "text" || type == "title") {
		return (
			<div
				onMouseUp={handleMouseUp}
				className={clsx(
					"flex my-2 w-full relative",
					type == "title" ? "text-5xl" : "text-xl",
					className
				)}
			>
				<textarea
					ref={blockRef}
					placeholder={placeholder}
					className={clsx(
						"bg-transparent resize-none font-display-regular outline-none flex-1 p-1 relative top-1 placeholder:font-logo placeholder:text-[#aaa]",
						type == "title" ? "h-[55px]" : "h-[36px]"
					)}
					onFocus={(v) => {
						if (v.target.value.length > 0) return;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = v.target.getBoundingClientRect().x;
						const Y = v.target.getBoundingClientRect().y + scrollY;
						const height = v.target.getBoundingClientRect().height;

						updateTooltip({
							visible: true,
							position: { x: X, y: Y + height / 2 },
							blockId: id,
						});
					}}
					onInput={(e) => {
						e.currentTarget.style.height = "0px";
						e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = e.currentTarget.getBoundingClientRect().x;
						const Y =
							e.currentTarget.getBoundingClientRect().y + scrollY;
						const height =
							e.currentTarget.getBoundingClientRect().height;

						if (e.currentTarget.value.length > 0) {
							updateTooltip({
								visible: false,
								blockId: id,
								position: { x: X, y: Y + height / 2 },
							});
						} else {
							updateTooltip({
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
							updateTooltip,
							updateBlock,
							textValue: e.currentTarget.value,
						});
					}}
				></textarea>
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
						className="absolute bottom-5 left-5 invisible rounded-full bg-white p-3 border-[1.5px] cursor-pointer group-hover:visible shadow-2xl"
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
					className="rounded-full p-3 invisible cursor-pointer border-[1.5px] bg-white absolute left-5 top-[50%] translate-y-[-50%] group-hover:visible shadow-2xl"
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
					"flex flex-col my-2 w-full relative text-lg",
					className
				)}
			>
				<textarea
					ref={blockRef}
					placeholder={"const x = 10;"}
					className={clsx(
						"bg-[#ececec] border border-black rounded-sm resize-none font-mono outline-none w-full px-10 py-10 relative top-1"
					)}
					onFocus={(v) => {
						if (v.target.value.length > 0) return;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = v.target.getBoundingClientRect().x;
						const Y = v.target.getBoundingClientRect().y + scrollY;
						const height = v.target.getBoundingClientRect().height;

						updateTooltip({
							visible: true,
							position: { x: X, y: Y + height / 2 },
							blockId: id,
						});
					}}
					onInput={(e) => {
						e.currentTarget.style.height = "auto";
						e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = e.currentTarget.getBoundingClientRect().x;
						const Y =
							e.currentTarget.getBoundingClientRect().y + scrollY;
						const height =
							e.currentTarget.getBoundingClientRect().height;

						if (e.currentTarget.value.length > 0) {
							updateTooltip({
								visible: false,
								blockId: id,
								position: { x: X, y: Y + height / 2 },
							});
						} else {
							updateTooltip({
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
							updateTooltip,
							updateBlock,
							textValue: e.currentTarget.value,
						});
					}}
				></textarea>
				<span className="mt-3 text-sm">Code Preview:</span>
				<div className="border rounded-sm border-black text-base">
					<SyntaxHighlighter language={codeLanguage}>
						{blockRef.current?.value || "const x = 10;"}
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
				<textarea
					ref={blockRef}
					placeholder={placeholder}
					className={clsx(
						"bg-transparent resize-none h-[36px] font-display-regular outline-none w-full p-1 relative top-1 placeholder:font-logo placeholder:text-[#aaa]",
						!videoLinkTextareaVisible && "hidden"
					)}
					onFocus={(v) => {
						if (v.target.value.length > 0) return;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = v.target.getBoundingClientRect().x;
						const Y = v.target.getBoundingClientRect().y + scrollY;
						const height = v.target.getBoundingClientRect().height;

						updateTooltip({
							visible: true,
							position: { x: X, y: Y + height / 2 },
							blockId: id,
						});
					}}
					onInput={(e) => {
						e.currentTarget.style.height = "0px";
						e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
						const scrollY = window.scrollY || window.pageYOffset;
						const X = e.currentTarget.getBoundingClientRect().x;
						const Y =
							e.currentTarget.getBoundingClientRect().y + scrollY;
						const height =
							e.currentTarget.getBoundingClientRect().height;

						if (e.currentTarget.value.length > 0) {
							updateTooltip({
								visible: false,
								blockId: id,
								position: { x: X, y: Y + height / 2 },
							});
						} else {
							updateTooltip({
								visible: true,
								blockId: id,
								position: { x: X, y: Y + height / 2 },
							});
						}

						if (e.currentTarget.value.length > 0) {
							e.currentTarget.style.textDecoration = "underline";
						} else {
							e.currentTarget.style.textDecoration = "none";
						}
					}}
					onKeyUp={(e) => {
						if (e.key === "Enter") {
							if (
								blockRef.current &&
								blockRef.current?.value.length < 5
							)
								return;
							setVideoLinkTextareaVisible(false);
						}
					}}
				></textarea>
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
								url={blockRef.current.value}
								width="100%"
								height="100%"
								controls
							/>
						</div>
						<button
							onClick={handleDeleteBlock}
							className="absolute bottom-24 left-5 invisible rounded-full bg-white p-3 border-[1.5px] cursor-pointer group-hover:visible shadow-2xl"
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
