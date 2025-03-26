import Image from "@node_modules/next/image";
import React from "react";
import MangoPreview from "@public/assets/images/mango-bg.png";
import Link from "@node_modules/next/link";

export default function page() {
	return (
		<div className="text-3xl font-display-light h-[85vh] flex justify-center">
			<div className="mx-16 max-w-[1192px] w-full flex gap-10 flex-col justify-center h-full relative">
				<div className="absolute -z-1 w-full max-w-[500px] aspect-square right-0">
					<Image
						src={MangoPreview}
						fill={true}
						alt="Mango"
						className="object-cover"
					/>
				</div>
				<h1 className="font-logo text-8xl">
					Mango
					<br />
					stories & ideas
				</h1>
				<p className="text-2xl">
					A place to read, write, and deepen your understanding
				</p>
				<Link
					href="/articles"
					className="w-fit text-xl bg-black px-11 py-2.5 rounded-full cursor-pointer text-white flex items-center justify-center transition-all hover:bg-mango hover:text-black"
				>
					Start reading
				</Link>
			</div>
		</div>
	);
}
