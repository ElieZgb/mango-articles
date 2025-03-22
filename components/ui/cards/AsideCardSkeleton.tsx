import React from "react";

export default function AsideCardSkeleton({ index }: { index: number }) {
	return (
		<div
			style={{
				animationDelay: `${index}ms`,
				animationDuration: "1300ms",
			}}
			className="mb-5 flex relative rounded-lg overflow-hidden bg-gray-200 animate-pulse"
		>
			<div className="flex-1 p-2 relative z-10">
				<div className={`flex w-full items-center gap-2`}>
					<div className="aspect-square w-6 rounded-full flex-shrink-0 bg-gray-300 relative"></div>
					<div className="h-3.5 w-[100px] bg-gray-300 rounded-full" />
				</div>

				<div className="py-2">
					<div className="h-7 mb-2 w-[60%] bg-gray-300 rounded-sm" />
					<div className="h-3 mb-1 w-[100%] bg-gray-300 rounded-sm" />
					<div className="h-3 mb-1 w-[30%] bg-gray-300 rounded-sm" />
				</div>

				<div className="flex items-center gap-4 text-sm text-gray-700">
					<div className="h-4 w-[30%] bg-gray-300 rounded-sm" />
					<div className="h-4 w-[10%] bg-gray-300 rounded-sm" />
				</div>
			</div>
		</div>
	);
}
