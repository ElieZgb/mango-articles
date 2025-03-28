"use client";
import React, { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { isValidURL } from "@lib/validateURL";

export default function SelectionFloatingToolbar({
	position,
}: {
	position: { x: number; y: number } | null;
}) {
	const [isBold, setIsBold] = useState<boolean>(true);
	const [isItalic, setIsItalic] = useState<boolean>(true);
	const [isHyperLink, setHyperLink] = useState<boolean>(true);

	const toggleBoldFormat = () => {
		setIsBold((prev) => !prev);
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const selectedText = selection.toString();

			const span = document.createElement("span");

			span.style.fontWeight = isBold ? "bold" : "normal";
			span.textContent = selectedText;
			range.deleteContents();
			range.insertNode(span);
		}
	};
	const toggleItalicFormat = () => {
		setIsItalic((prev) => !prev);
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const selectedText = selection.toString();

			const span = document.createElement("span");

			span.style.fontStyle = isItalic ? "italic" : "normal";
			span.textContent = selectedText;
			range.deleteContents();
			range.insertNode(span);
		}
	};

	const handleFontSize = (size: "small" | "base" | "large") => {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const selectedText = selection.toString();

			const span = document.createElement("span");

			if (size == "small") {
				span.style.fontSize = "16px";
			} else if (size == "base") {
				span.style.fontSize = "20px";
			} else if (size == "large") {
				span.style.fontSize = "24px";
			}
			span.textContent = selectedText;
			range.deleteContents();
			range.insertNode(span);
		}
	};

	const handleHyperLink = () => {
		setHyperLink((prev) => !prev);
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const selectedText = selection.toString();
			let url = selectedText;

			if (
				!selectedText.startsWith("http://") &&
				!selectedText.startsWith("https://")
			) {
				url = "https://" + selectedText;
			}

			const urlRegex =
				/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-.~:/?#[\]@!$&'()*+,;=]*)?$/i;

			if (!urlRegex.test(url)) {
				return;
			}

			const aTag = document.createElement("a");
			aTag.className = "relative hover:cursor-pointer";
			aTag.href = url;
			aTag.onclick = () => {
				window.open(url, "_blank");
			};
			aTag.style.textDecoration = "underline";
			aTag.textContent = selectedText;
			range.deleteContents();

			if (isHyperLink) {
				range.insertNode(aTag);
			} else {
				const span = document.createElement("span");
				span.textContent = selectedText;
				range.insertNode(span);
			}
		}
	};

	if (!position) return;

	return (
		<div
			style={{
				left: position.x,
				top: position.y,
			}}
			className="absolute bg-black py-3 px-3 rounded-lg text-sm z-50 flex gap-1.5 shadow-[0px_1px_12px_5px_#c4c4c4]"
		>
			<button
				onClick={toggleBoldFormat}
				className="font-display-bold rounded-sm cursor-pointer bg-mango p-1 w-8 h-8 flex items-center justify-center"
			>
				B
			</button>
			<button
				onClick={toggleItalicFormat}
				className="font-display-bold rounded-sm cursor-pointer bg-mango p-1 w-8 h-8 flex items-center justify-center"
			>
				I
			</button>
			<button
				onClick={() => handleFontSize("small")}
				className="font-display-bold text-xs rounded-sm cursor-pointer bg-mango p-1 w-8 h-8 flex items-center justify-center"
			>
				T
			</button>
			<button
				onClick={() => handleFontSize("base")}
				className="font-display-bold text-base rounded-sm cursor-pointer bg-mango p-1 w-8 h-8 flex items-center justify-center"
			>
				T
			</button>
			<button
				onClick={() => handleFontSize("large")}
				className="font-display-bold text-xl rounded-sm cursor-pointer bg-mango p-1 w-8 h-8 flex items-center justify-center"
			>
				T
			</button>
			<button
				onClick={handleHyperLink}
				className="font-display-bold text-xl rounded-sm cursor-pointer bg-mango p-1 w-8 h-8 flex items-center justify-center"
			>
				<Link2 strokeWidth={2} size={20} />
			</button>
		</div>
	);
}
