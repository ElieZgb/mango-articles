import FeedAside from "@components/section/FeedAside";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-row max-[900px]:flex-col  max-w-[1300px] mx-auto min-h-[50vh]">
			<main className="w-full">{children}</main>
			<FeedAside />
		</div>
	);
}
