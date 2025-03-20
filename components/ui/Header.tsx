"use client";
import React from "react";
import { useSession } from "@node_modules/next-auth/react";

export default function Header() {
	const { data: session } = useSession();

	return (
		<div className="flex justify-center border-b-[1px] border-b-black">
			<div className="mx-16 max-w-[1192px] w-full py-5 flex justify-between">
				<h1 className="font-logo text-3xl">MangoArticles</h1>
				<div className="flex items-center gap-6 text-sm">
					<div>Home</div>
					<div>Articles</div>
					<div>Write</div>
					{!session?.user?.email && (
						<>
							<div>Sign in</div>
							<div className="py-2.5 px-4 rounded-full bg-black text-white hover:bg-mango transition-all">
								Get started
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
