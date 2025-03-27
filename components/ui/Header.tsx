"use client";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "@node_modules/next-auth/react";
import { useModalsState } from "@state/modals";
import ProfileButton from "./buttons/ProfileButton";
import Link from "@node_modules/next/link";
import { usePopupState } from "@state/popups";

export default function Header() {
	const { data: session } = useSession();
	const { setData: setModalData } = useModalsState();
	const { setData: setPopupData } = usePopupState();
	const [doneFetching, setDoneFetching] = useState<boolean>(false);
	const [username, setUsername] = useState<string | null>(null);

	const openModal = (type: number) => {
		setModalData({ isOpen: true, type });
	};

	useEffect(() => {
		if (session?.user) {
			if (doneFetching) return;

			const fetchAndUpdateUser = async () => {
				const userFetchResponse = await fetch("/api/users", {
					method: "POST",
					body: JSON.stringify({ email: session.user.email }),
				});

				if (!userFetchResponse.ok) return signOut();

				const user = await userFetchResponse.json();

				if (user.username) {
					setDoneFetching(true);
					setUsername(user.username);
					return;
				}

				setPopupData({ isOpen: true, email: user.email });
			};

			fetchAndUpdateUser();
		}
	}, [session]);

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
		<div className="flex justify-center border-b-[1px] border-b-black sticky top-0 bg-background z-20">
			<div className="mx-16 max-w-[1192px] w-full py-5 flex justify-between">
				<h1 className="font-logo text-3xl">
					<Link href="/">MangoArticles</Link>
				</h1>
				<div className="flex items-center gap-6 text-sm">
					<Link href="/articles">Articles</Link>
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
					{session?.user.email && (
						<ProfileButton username={username} />
					)}
				</div>
			</div>
		</div>
	);
}
