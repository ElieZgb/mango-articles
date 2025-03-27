import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function ProfilePagination({
	currentPage,
}: {
	currentPage: number;
}) {
	return (
		<div className="flex items-center justify-center mt-5">
			<ul className="flex items-center -space-x-px h-8 text-sm">
				<li>
					<a
						href="#"
						className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-[#777] rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
					>
						<span className="sr-only">Previous</span>
						<ChevronLeft size={20} />
					</a>
				</li>
				{Array(5)
					.fill(0)
					.map((el, index) => (
						<li key={index}>
							<a
								href="#"
								className={clsx(
									"flex items-center justify-center px-3 h-8 leading-tight text-[#777] border border-[#777]  hover:text-gray-700",
									currentPage === index && "bg-mango",
									currentPage != index &&
										"bg-white hover:bg-gray-100"
								)}
							>
								{index + 1}
							</a>
						</li>
					))}

				<li>
					<a
						href="#"
						className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-[#777] rounded-e-lg hover:bg-gray-100 hover:text-gray-700 "
					>
						<span className="sr-only">Next</span>
						<ChevronRight size={20} />
					</a>
				</li>
			</ul>
		</div>
	);
}
