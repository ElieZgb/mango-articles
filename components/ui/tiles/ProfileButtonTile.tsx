import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "@node_modules/lucide-react/dist/lucide-react";
import Link from "@node_modules/next/link";

interface ProfileButtonTileProps {
	label: string;
	icon?: ForwardRefExoticComponent<
		Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
	>;
	url?: string;
	onclick?: () => void;
	rawHTML?: boolean;
	closeMenu?: () => void;
}

export default function ProfileButtonTile({
	label,
	icon: Icon,
	url,
	onclick,
	rawHTML = false,
	closeMenu,
}: ProfileButtonTileProps) {
	return (
		<div
			className="relative flex flex-row gap-3 items-center py-1.5 px-5 cursor-pointer group"
			onClick={onclick || undefined}
		>
			{url && (
				<Link
					href={url}
					className="absolute w-full h-full top-0 left-0"
					onClick={closeMenu}
				/>
			)}
			{Icon && (
				<Icon
					size={19}
					className="text-gray-500 group-hover:text-black"
				/>
			)}
			{rawHTML ? (
				<div
					dangerouslySetInnerHTML={{ __html: label }}
					className="text-sm flex pt-1 items-center justify-center text-gray-500 group-hover:text-black"
				/>
			) : (
				<div className="text-sm flex pt-1 items-center justify-center text-gray-500 group-hover:text-black">
					{label}
				</div>
			)}
		</div>
	);
}
