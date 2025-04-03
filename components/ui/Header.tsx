"use client";
import React, { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "@node_modules/next-auth/react";
import { useSignInRegisterModalState } from "@state/signInRegisterModals";
import ProfileButton from "./buttons/ProfileButton";
import Link from "@node_modules/next/link";
import { useUsernamePopupState } from "@state/usernamePopup";
import { usePathname, useRouter } from "@node_modules/next/navigation";
import clsx from "clsx";
import { Menu } from "lucide-react";
import { Session } from "next-auth";
import ProfileButtonTile from "./tiles/ProfileButtonTile";

export default function Header() {
	const { data: session, status: sessionStatus } = useSession();
	const pathname = usePathname();
	const { setData: setModalData } = useSignInRegisterModalState();
	const { setData: setPopupData } = useUsernamePopupState();
	const [doneFetching, setDoneFetching] = useState<boolean>(false);
	const [username, setUsername] = useState<string | null>(null);
	const router = useRouter();
	const [activeMenu, setActiveMenu] = useState<boolean>(false);

	const toggleBurgerMenu = () => {
		setActiveMenu((prev) => !prev);
	};

	const openModal = (type: number) => {
		setModalData({ isOpen: true, type });
	};

	useEffect(() => {
		if (session?.user) {
			if (doneFetching) return;

			const fetchAndUpdateUser = async () => {
				const userFetchResponse = await fetch(
					`/api/users?email=${session.user.email}`
				);

				if (!userFetchResponse.ok) return signOut({ callbackUrl: "/" });

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
		if (sessionStatus === "authenticated") {
			return router.push("/write");
		}

		setModalData({
			isOpen: true,
			type: 1,
			title: "Create an account to start writing.",
		});
	};

	return (
		<div className="flex justify-center border-b-[1px] border-b-black sticky top-0 bg-background z-20">
			<div className="mx-16 max-[500px]:mx-7 max-w-[1192px] w-full py-5 flex justify-between">
				<h1 className="font-logo text-3xl">
					<Link href="/">MangoArticles</Link>
				</h1>

				{/* DESKTOP */}
				<div className="max-sm:hidden flex items-center gap-6 text-sm">
					<Link
						href="/articles"
						className={clsx(
							pathname == "/articles" &&
								"font-display-bold italic transition-all relative after:none after:bottom-[-6px] after:left-[50%] after:translate-x-[-50%] after:w-[5px] after:aspect-square after:bg-black after:rounded-full"
						)}
					>
						Articles
					</Link>
					<div
						onClick={handleWritePage}
						className={clsx(
							"cursor-pointer",
							pathname.includes("/write") &&
								"font-display-bold italic transition-all relative after:none after:bottom-[-6px] after:left-[50%] after:translate-x-[-50%] after:w-[5px] after:aspect-square after:bg-black after:rounded-full"
						)}
					>
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

				{/* MOBILE VIEW */}
				<div className="max-sm:flex hidden items-center gap-6 text-sm">
					<Link
						href="/articles"
						className={clsx(
							pathname == "/articles" &&
								"font-display-bold italic transition-all relative after:none after:bottom-[-6px] after:left-[50%] after:translate-x-[-50%] after:w-[5px] after:aspect-square after:bg-black after:rounded-full"
						)}
					>
						Articles
					</Link>
					{!session?.user.email && (
						<div className="relative">
							<div
								id="burger-menu"
								className="cursor-pointer"
								onClick={toggleBurgerMenu}
							>
								<Menu size={25} className="" />
							</div>
							<BurgerMenu
								active={activeMenu}
								session={session}
								setActive={setActiveMenu}
								openModal={openModal}
								handleWritePage={handleWritePage}
							/>
						</div>
					)}
					{session?.user.email && (
						<ProfileButton username={username} />
					)}
				</div>
			</div>
		</div>
	);
}

const BurgerMenu = ({
	active,
	setActive,
	session,
	openModal,
	handleWritePage,
}: {
	active: boolean;
	session: Session | null;
	setActive: React.Dispatch<React.SetStateAction<boolean>>;
	openModal: (type: number) => void;
	handleWritePage: () => void;
}) => {
	const menuRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as HTMLElement;
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node) &&
				target.id !== "burger-menu"
			) {
				setActive(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, [setActive]);

	const closeMenu = () => setActive(false);

	return (
		<div
			ref={menuRef}
			className={clsx([
				"absolute top-[120%] z-50 right-0 py-3 w-max bg-[#f1f1f1] rounded-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-all duration-[200ms]",
				active && "opacity-100 visible",
				!active && "opacity-0 invisible",
			])}
		>
			<ProfileButtonTile
				onclick={handleWritePage}
				label="Write"
				closeMenu={closeMenu}
			/>
			{!session?.user?.email && (
				<>
					<ProfileButtonTile
						onclick={() => openModal(1)}
						closeMenu={closeMenu}
						label="Sign in"
					/>
					<ProfileButtonTile
						onclick={() => openModal(2)}
						closeMenu={closeMenu}
						label="Get Started"
					/>
				</>
			)}
		</div>
	);
};
