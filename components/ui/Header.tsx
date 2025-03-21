"use client";
import React from "react";
import { useSession } from "@node_modules/next-auth/react";
import { useModalsState } from "@state/modals";
import ProfileButton from "./buttons/ProfileButton";
import Link from "@node_modules/next/link";

export default function Header() {
	const { data: session } = useSession();
	const { setData: setModalData } = useModalsState();

	const openModal = (type: number) => {
		setModalData({ isOpen: true, type });
	};

	const handleWritePage = () => {
		if (!session?.user?.email) {
			setModalData({
				isOpen: true,
				type: 1,
				title: "Create an account to start writing.",
			});
		}
	};

	return (
		<div className="flex justify-center border-b-[1px] border-b-black">
			<div className="mx-16 max-w-[1192px] w-full py-5 flex justify-between">
				<h1 className="font-logo text-3xl">
					<Link href="/">MangoArticles</Link>
				</h1>
				<div className="flex items-center gap-6 text-sm">
					<Link href="/feed">Articles</Link>
					<div onClick={handleWritePage} className="cursor-pointer">
						Write
					</div>
					{!session?.user?.email && (
						<>
							<div
								onClick={() => openModal(1)}
								className="cursor-pointer"
							>
								Sign in
							</div>
							<div
								onClick={() => openModal(2)}
								className="py-2.5 px-4 rounded-full bg-black text-white hover:bg-mango transition-all cursor-pointer"
							>
								Get started
							</div>
						</>
					)}
					{session?.user.email && <ProfileButton />}
				</div>
			</div>
		</div>
	);
}
