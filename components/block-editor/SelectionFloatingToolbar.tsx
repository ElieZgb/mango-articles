import React from "react";
import type { SelectionPosition } from "./Block";

export default function SelectionFloatingToolbar({
	position,
}: {
	position: SelectionPosition | null;
}) {
	console.log(position);

	if (!position) return;

	return (
		<div
			style={{
				left: position.x,
				top: position.y,
			}}
			className="absolute bg-red-500 text-sm"
		>
			SelectionFloatingToolbar
		</div>
	);
}
