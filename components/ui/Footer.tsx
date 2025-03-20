import React from "react";

const FOOTER_LINKS = [
	{ label: "Help", url: "" },
	{ label: "Status", url: "" },
	{ label: "About", url: "" },
	{ label: "Careers", url: "" },
	{ label: "Press", url: "" },
	{ label: "Blog", url: "" },
	{ label: "Privacy", url: "" },
	{ label: "Terms", url: "" },
	{ label: "Text to speech", url: "" },
	{ label: "Teams", url: "" },
];

export default function Footer() {
	return (
		<div className="flex justify-center border-t-[1px] border-t-black">
			<div className="flex gap-5 mx-16 max-w-[1192px] py-5">
				{FOOTER_LINKS.map((el, index) => (
					<div
						key={index}
						className="text-sm text-[#6B6B6B] cursor-pointer"
					>
						{el.label}
					</div>
				))}
			</div>
		</div>
	);
}
