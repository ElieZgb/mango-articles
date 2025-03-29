"use client";
import type { User } from "@node_modules/.prisma/client";
import Image from "@node_modules/next/image";
import { useMentionPopupState } from "@state/mentionBlockPopup";
import React, { useEffect, useRef, useState } from "react";
import PlaceholderImage from "@public/assets/images/profile-placeholder.png";
import clsx from "clsx";
import type { BlockData } from "@app/write/page";

export default function MentionPopup({
	position,
	updateBlock,
	blockId,
	blockRef,
}: {
	position: { x: number; y: number };
	updateBlock: (
		id: string,
		newBlock: Partial<BlockData>,
		action?: "update" | "delete"
	) => void;
	blockId: string | null;
	blockRef: React.RefObject<HTMLElement | null> | null;
}) {
	const popupRef = useRef<HTMLDivElement>(null);
	const { setData } = useMentionPopupState();
	const [users, setUsers] = useState<User[]>([]);

	const insertTextAtCaret = (mentionText: string) => {
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;

		const range = selection.getRangeAt(0);
		const container = range.startContainer;
		const offset = range.startOffset;

		if (container.nodeType === Node.TEXT_NODE) {
			const text = container.textContent || "";
			const atIndex = text.lastIndexOf("@", offset); // Find the last "@"

			if (atIndex !== -1) {
				// Replace "@" with "@username "
				const newText =
					text.substring(0, atIndex + 1) +
					mentionText +
					" " +
					text.substring(offset);
				container.textContent = newText;

				// Move caret to the end of the inserted mention
				const newRange = document.createRange();
				newRange.setStart(container, atIndex + mentionText.length + 2); // +2 to move after space
				newRange.setEnd(container, atIndex + mentionText.length + 2);

				selection.removeAllRanges();
				selection.addRange(newRange);

				if (blockId && blockRef?.current) {
					updateBlock(
						blockId,
						{ textValue: blockRef.current.innerHTML },
						"update"
					);
				}
			}
		}
	};

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await fetch("/api/users");
			const responseData = await response.json();
			setUsers(responseData);
		};

		fetchUsers();

		const handleClickOutside = (event: MouseEvent) => {
			if (
				popupRef.current &&
				!popupRef.current.contains(event.target as Node)
			) {
				setData({ active: false });
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div
			ref={popupRef}
			style={{ left: position.x, top: position.y }}
			className="absolute z-10"
		>
			<div className="w-fit max-h-[300px] bg-white overflow-auto flex flex-col rounded-sm shadow-[0px_1px_7px_5px_#eee]">
				{users.length == 0 && (
					<div className="p-5">
						<UserSkeleton index={1} />
						<UserSkeleton index={2} />
						<UserSkeleton index={3} />
					</div>
				)}
				{users.map((user, index) => {
					return (
						<button
							onClick={() => {
								insertTextAtCaret(`${user.username}`);
								setData({ active: false });
							}}
							className={clsx(
								"flex items-center gap-2 text-left px-4 py-1.5 cursor-pointer hover:bg-mango",
								index == 0 && "pt-4",
								index == users.length - 1 && "pb-4"
							)}
							key={user.id}
						>
							<div className="w-[35px] aspect-square rounded-full overflow-hidden relative">
								<Image
									src={user.image || PlaceholderImage}
									alt={`profile image of ${user.name}`}
									fill={true}
									className="object-cover"
								/>
							</div>
							<span>{user.name}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}

const UserSkeleton = ({ index }: { index: number }) => {
	return (
		<button className="flex items-center gap-2 text-left py-1.5">
			<div
				className={`w-[35px] aspect-square rounded-full bg-gray-200 animate-pulse delay-[${index}]`}
			></div>
			<div
				className={`w-[80px] h-[20px] rounded-sm bg-gray-200 animate-pulse delay-[${index}]`}
			></div>
		</button>
	);
};
