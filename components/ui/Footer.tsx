"use client";
import { useSession } from "@node_modules/next-auth/react";
import Link from "@node_modules/next/link";
import React from "react";

const FOOTER_LINKS = [
	{ label: "Home", url: "/" },
	{ label: "Articles", url: "/articles" },
	{ label: "Write", url: "/write", authentication: true },
	{ label: "Settings", url: "/settings", authentication: true },
	{ label: "About", url: "" },
	{ label: "Privacy", url: "" },
	{ label: "Terms", url: "" },
];

export default function Footer() {
	const { status } = useSession();
	return (
		<div className="flex justify-center border-t-[1px] border-t-black">
			<div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mx-16 max-[500px]:mx-7 max-w-[1192px] py-5">
				{FOOTER_LINKS.map((el, index) => {
					if (el.authentication && status === "unauthenticated")
						return;

					if (el.url) {
						return (
							<Link
								href={el.url}
								key={index}
								className="text-sm text-[#6B6B6B] cursor-pointer"
							>
								{el.label}
							</Link>
						);
					}

					return (
						<div
							key={index}
							className="text-sm text-[#6B6B6B] cursor-not-allowed"
						>
							{el.label}
						</div>
					);
				})}
			</div>
		</div>
	);
}
