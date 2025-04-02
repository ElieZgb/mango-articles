"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { languages } from "./languages";

export default function LanguageSelector({
	language,
	setCodeLanguage,
}: {
	language: string;
	setCodeLanguage: React.Dispatch<React.SetStateAction<string>>;
}) {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div>
			<button
				onClick={() => {
					setOpen((prev) => !prev);
				}}
				className="flex items-center gap-1 cursor-pointer"
			>
				{language} <ChevronDown size={16} />
			</button>
			{open && (
				<div className="flex mt-2 bg-white h-64 overflow-auto rounded-sm p-4 w-[200px] flex-col">
					{languages.map((l, index) => (
						<div
							onClick={() => {
								setCodeLanguage(l);
								setOpen(false);
							}}
							key={index}
							className="py-1 cursor-pointer hover:font-display-medium"
						>
							{l}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
